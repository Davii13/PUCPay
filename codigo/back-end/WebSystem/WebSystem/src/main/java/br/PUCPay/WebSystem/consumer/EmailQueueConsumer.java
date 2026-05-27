package br.PUCPay.WebSystem.consumer;

import br.PUCPay.WebSystem.config.RabbitMQConfig;
import br.PUCPay.WebSystem.dto.ResgateNotificationMessage;
import br.PUCPay.WebSystem.service.EmailService;
import br.PUCPay.WebSystem.service.WhatsAppService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmailQueueConsumer {

    @Autowired
    private EmailService emailService;

    @Autowired
    private WhatsAppService whatsAppService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void consumeResgateNotification(ResgateNotificationMessage message) {
        System.out.println("[RABBITMQ CONSUMER] Processando envio de cupons para o resgate: " + message.getCodigoCupom());
        
        emailService.enviarCupomAluno(
                message.getAlunoEmail(),
                message.getAlunoNome(),
                message.getVantagemTitulo(),
                message.getEmpresaNome(),
                message.getCodigoCupom(),
                message.getCupomUrl()
        );
        
        emailService.enviarCupomEmpresa(
                message.getEmpresaEmail(),
                message.getEmpresaNome(),
                message.getVantagemTitulo(),
                message.getAlunoNome(),
                message.getCodigoCupom()
        );

        whatsAppService.enviarCupomAluno(
                message.getAlunoTelefone(),
                message.getAlunoNome(),
                message.getVantagemTitulo(),
                message.getEmpresaNome(),
                message.getCodigoCupom(),
                message.getCupomUrl()
        );
    }
}
