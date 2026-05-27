package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.AlunoDAO;
import br.PUCPay.WebSystem.dao.ProfessorDAO;
import br.PUCPay.WebSystem.dao.TransacaoDAO;
import br.PUCPay.WebSystem.dao.VantagemDAO;
import br.PUCPay.WebSystem.dto.EnviarMoedasDTO;
import br.PUCPay.WebSystem.dto.ResgateDTO;
import br.PUCPay.WebSystem.dto.ResgateNotificationMessage;
import br.PUCPay.WebSystem.config.RabbitMQConfig;
import br.PUCPay.WebSystem.model.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoDAO transacaoDAO;

    @Autowired
    private AlunoDAO alunoDAO;

    @Autowired
    private ProfessorDAO professorDAO;

    @Autowired
    private VantagemDAO vantagemDAO;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private GamificacaoService gamificacaoService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Transactional
    public Transacao enviarMoedas(EnviarMoedasDTO dto) {
        if (dto == null || dto.getValor() == null) {
            throw new RuntimeException("Dados da transação inválidos");
        }

        Professor professor = professorDAO.findById(dto.getProfessorId());
        if (professor == null) throw new RuntimeException("Professor não encontrado");

        Aluno aluno = alunoDAO.findById(dto.getAlunoId());
        if (aluno == null) throw new RuntimeException("Aluno não encontrado");

        if (dto.getMensagem() == null || dto.getMensagem().isBlank()) {
            throw new RuntimeException("A mensagem é obrigatória");
        }

        if (dto.getValor() <= 0) {
            throw new RuntimeException("O valor enviado deve ser maior que zero");
        }

        if (professor.getSaldo() < dto.getValor()) {
            throw new RuntimeException("Saldo insuficiente. Saldo atual: " + professor.getSaldo());
        }

        Double newProfessorBalance = professor.getSaldo() - dto.getValor();
        Double newAlunoBalance = aluno.getSaldo() + dto.getValor();

        professor.setSaldo(newProfessorBalance);
        aluno.setSaldo(newAlunoBalance);

        professorDAO.update(professor);
        alunoDAO.update(aluno);

        Transacao transacao = new Transacao();
        transacao.setTipo(Transacao.Tipo.ENVIO);
        transacao.setValor(dto.getValor());
        transacao.setMensagem(dto.getMensagem());
        transacao.setRemetente(professor);
        transacao.setDestinatario(aluno);

        Transacao salva = transacaoDAO.save(transacao);

        try {
            gamificacaoService.registrarRecebimentoMoedas(aluno.getId(), dto.getValor());
        } catch (Exception e) {
            System.err.println("[GAMIFICACAO] Erro ao registrar recebimento de moedas: " + e.getMessage());
        }

        try {
            emailService.enviarNotificacaoMoedas(
                    aluno.getEmail(), aluno.getNome(),
                    professor.getNome(), dto.getValor(), dto.getMensagem()
            );
        } catch (Exception e) {
            System.err.println("[EMAIL] Erro ao enviar notificação: " + e.getMessage());
        }

        return salva;
    }

    @Transactional
    public Transacao resgatarVantagem(ResgateDTO dto) {
        if (dto == null || dto.getAlunoId() == null || dto.getVantagemId() == null) {
            throw new RuntimeException("Dados do resgate inválidos");
        }

        Aluno aluno = alunoDAO.findById(dto.getAlunoId());
        if (aluno == null) throw new RuntimeException("Aluno não encontrado");

        Vantagem vantagem = vantagemDAO.findById(dto.getVantagemId());
        if (vantagem == null) throw new RuntimeException("Vantagem não encontrada");

        if (aluno.getSaldo() < vantagem.getCusto()) {
            throw new RuntimeException("Saldo insuficiente. Necessário: " + vantagem.getCusto() + " | Saldo: " + aluno.getSaldo());
        }

        Double newBalance = aluno.getSaldo() - vantagem.getCusto();
        aluno.setSaldo(newBalance);
        alunoDAO.update(aluno);

        try {
            gamificacaoService.registrarResgate(aluno.getId(), vantagem.getCusto());
        } catch (Exception e) {
            System.err.println("[GAMIFICACAO] Erro ao registrar resgate: " + e.getMessage());
        }

        String codigo = UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

        Transacao transacao = new Transacao();
        transacao.setTipo(Transacao.Tipo.RESGATE);
        transacao.setValor(vantagem.getCusto());
        transacao.setMensagem("Resgate: " + vantagem.getTitulo());
        transacao.setRemetente(aluno);
        transacao.setDestinatario(vantagem.getEmpresa());
        transacao.setVantagem(vantagem);
        transacao.setCodigoCupom(codigo);
        transacao.setStatusCupom(Transacao.StatusCupom.DISPONIVEL);

        Transacao salva = transacaoDAO.save(transacao);
        String cupomUrl = buildCupomUrl(codigo);

        try {
            ResgateNotificationMessage notification = new ResgateNotificationMessage();
            notification.setAlunoEmail(aluno.getEmail());
            notification.setAlunoNome(aluno.getNome());
            notification.setAlunoTelefone(aluno.getTelefone());
            notification.setVantagemTitulo(vantagem.getTitulo());
            notification.setEmpresaEmail(vantagem.getEmpresa().getEmail());
            notification.setEmpresaNome(vantagem.getEmpresa().getNome());
            notification.setCodigoCupom(codigo);
            notification.setCupomUrl(cupomUrl);
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, notification);
        } catch (Exception e) {
            System.err.println("[NOTIFICATION] Erro ao enviar notificação: " + e.getMessage());
        }

        return salva;
    }

    public Transacao consultarCupom(String codigoCupom) {
        return transacaoDAO.findByCodigoCupom(codigoCupom)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));
    }

    @Transactional
    public Transacao validarCupom(String codigoCupom) {
        Transacao transacao = consultarCupom(codigoCupom);

        if (transacao.getTipo() != Transacao.Tipo.RESGATE || transacao.getVantagem() == null) {
            throw new RuntimeException("Cupom inválido para resgate de vantagem");
        }

        if (transacao.getStatusCupom() == Transacao.StatusCupom.USADO) {
            throw new RuntimeException("Cupom já foi utilizado");
        }

        transacao.setStatusCupom(Transacao.StatusCupom.USADO);
        transacao.setDataValidacaoCupom(LocalDateTime.now());
        return transacaoDAO.update(transacao);
    }

    public List<Transacao> getExtratoAluno(Long alunoId) {
        return transacaoDAO.findByUsuarioId(alunoId);
    }

    public List<Transacao> getExtratoProfessor(Long professorId) {
        return transacaoDAO.findByRemetenteId(professorId);
    }

    private String buildCupomUrl(String codigo) {
        return frontendUrl.replaceAll("/$", "") + "/validar-cupom/" + codigo;
    }
}
