package br.PUCPay.WebSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String fromAddress;

    private void send(String to, String subject, String body) {
        if (mailSender == null || mailUsername == null || mailUsername.isBlank()) {
            System.out.println("[EMAIL SIMULADO] Para: " + to);
            System.out.println("[EMAIL SIMULADO] Assunto: " + subject);
            System.out.println("[EMAIL SIMULADO] Corpo:\n" + body);
            System.out.println("[EMAIL SIMULADO] Configure spring.mail.username e spring.mail.password para envio real.");
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom(fromAddress == null || fromAddress.isBlank() ? mailUsername : fromAddress);
            mailSender.send(message);
            System.out.println("[EMAIL] Enviado para: " + to);
        } catch (Exception e) {
            System.err.println("[EMAIL] Erro ao enviar email: " + e.getMessage());
        }
    }

    public void enviarNotificacaoMoedas(String alunoEmail, String nomeAluno, String nomeProfessor,
            Double valor, String mensagem) {
        String subject = "PUCPay — Você recebeu " + valor.intValue() + " PUCCoins!";
        String body = "Olá, " + nomeAluno + "!\n\n"
                + "O professor " + nomeProfessor + " enviou " + valor.intValue() + " PUCCoins para você.\n\n"
                + "Motivo: " + mensagem + "\n\n"
                + "Acesse o PUCPay para ver seu novo saldo!\n\n"
                + "Equipe PUCPay";
        send(alunoEmail, subject, body);
    }

    public void enviarCupomAluno(String alunoEmail, String nomeAluno, String tituloVantagem,
            String nomeEmpresa, String codigo, String cupomUrl) {
        String subject = "PUCPay — Cupom de resgate: " + tituloVantagem;
        String body = "Olá, " + nomeAluno + "!\n\n"
                + "Você resgatou a vantagem: " + tituloVantagem + " da empresa " + nomeEmpresa + ".\n\n"
                + "Seu código de cupom é: " + codigo + "\n\n"
                + "Apresente este QR Code/link na troca presencial: " + cupomUrl + "\n\n"
                + "Equipe PUCPay";
        send(alunoEmail, subject, body);
    }

    public void enviarCupomEmpresa(String empresaEmail, String nomeEmpresa, String tituloVantagem,
            String nomeAluno, String codigo) {
        String subject = "PUCPay — Resgate de vantagem: " + tituloVantagem;
        String body = "Olá, " + nomeEmpresa + "!\n\n"
                + "O aluno " + nomeAluno + " resgatou a vantagem: " + tituloVantagem + ".\n\n"
                + "Código de verificação: " + codigo + "\n\n"
                + "Use este código para conferir a troca presencial.\n\n"
                + "Equipe PUCPay";
        send(empresaEmail, subject, body);
    }
}
