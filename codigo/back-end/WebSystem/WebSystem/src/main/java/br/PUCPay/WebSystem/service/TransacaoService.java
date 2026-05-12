package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.AlunoDAO;
import br.PUCPay.WebSystem.dao.ProfessorDAO;
import br.PUCPay.WebSystem.dao.TransacaoDAO;
import br.PUCPay.WebSystem.dao.VantagemDAO;
import br.PUCPay.WebSystem.dto.EnviarMoedasDTO;
import br.PUCPay.WebSystem.dto.ResgateDTO;
import br.PUCPay.WebSystem.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    public Transacao enviarMoedas(EnviarMoedasDTO dto) {
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

        professor.setSaldo(professor.getSaldo() - dto.getValor());
        aluno.setSaldo(aluno.getSaldo() + dto.getValor());

        professorDAO.update(professor);
        alunoDAO.update(aluno);

        Transacao transacao = new Transacao();
        transacao.setTipo(Transacao.Tipo.ENVIO);
        transacao.setValor(dto.getValor());
        transacao.setMensagem(dto.getMensagem());
        transacao.setRemetente(professor);
        transacao.setDestinatario(aluno);

        Transacao salva = transacaoDAO.save(transacao);

        emailService.enviarNotificacaoMoedas(
                aluno.getEmail(), aluno.getNome(),
                professor.getNome(), dto.getValor(), dto.getMensagem()
        );

        return salva;
    }

    @Transactional
    public Transacao resgatarVantagem(ResgateDTO dto) {
        Aluno aluno = alunoDAO.findById(dto.getAlunoId());
        if (aluno == null) throw new RuntimeException("Aluno não encontrado");

        Vantagem vantagem = vantagemDAO.findById(dto.getVantagemId());
        if (vantagem == null) throw new RuntimeException("Vantagem não encontrada");

        if (aluno.getSaldo() < vantagem.getCusto()) {
            throw new RuntimeException("Saldo insuficiente. Necessário: " + vantagem.getCusto() + " | Saldo: " + aluno.getSaldo());
        }

        aluno.setSaldo(aluno.getSaldo() - vantagem.getCusto());
        alunoDAO.update(aluno);

        String codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Transacao transacao = new Transacao();
        transacao.setTipo(Transacao.Tipo.RESGATE);
        transacao.setValor(vantagem.getCusto());
        transacao.setMensagem("Resgate: " + vantagem.getTitulo());
        transacao.setRemetente(aluno);
        transacao.setDestinatario(vantagem.getEmpresa());
        transacao.setVantagem(vantagem);
        transacao.setCodigoCupom(codigo);

        Transacao salva = transacaoDAO.save(transacao);

        emailService.enviarCupomAluno(
                aluno.getEmail(), aluno.getNome(),
                vantagem.getTitulo(), vantagem.getEmpresa().getNome(), codigo
        );
        emailService.enviarCupomEmpresa(
                vantagem.getEmpresa().getEmail(), vantagem.getEmpresa().getNome(),
                vantagem.getTitulo(), aluno.getNome(), codigo
        );

        return salva;
    }

    public List<Transacao> getExtratoAluno(Long alunoId) {
        return transacaoDAO.findByUsuarioId(alunoId);
    }

    public List<Transacao> getExtratoProfessor(Long professorId) {
        return transacaoDAO.findByRemetenteId(professorId);
    }
}
