package br.PUCPay.WebSystem.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsAppService {

    @Value("${whatsapp.api-url:}")
    private String apiUrl;

    @Value("${whatsapp.access-token:}")
    private String accessToken;

    public void enviarCupomAluno(String telefone, String nomeAluno, String tituloVantagem, String nomeEmpresa,
            String codigo, String cupomUrl) {
        String body = "Olá, " + nomeAluno + "!\n\n"
                + "Seu cupom PUCPay para \"" + tituloVantagem + "\" da empresa " + nomeEmpresa + " foi gerado.\n"
                + "Código: " + codigo + "\n"
                + "QR Code/validação: " + cupomUrl;

        if (telefone == null || telefone.isBlank()) {
            System.out.println("[WHATSAPP] Aluno sem telefone cadastrado. Mensagem simulada:\n" + body);
            return;
        }

        if (apiUrl == null || apiUrl.isBlank() || accessToken == null || accessToken.isBlank()) {
            System.out.println("[WHATSAPP SIMULADO] Para: " + telefone);
            System.out.println("[WHATSAPP SIMULADO] Corpo:\n" + body);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, Object> payload = new HashMap<>();
            payload.put("messaging_product", "whatsapp");
            payload.put("to", onlyDigits(telefone));
            payload.put("type", "text");
            payload.put("text", Map.of("body", body));

            new RestTemplate().postForEntity(apiUrl, new HttpEntity<>(payload, headers), String.class);
        } catch (Exception e) {
            System.err.println("[WHATSAPP] Erro ao enviar mensagem: " + e.getMessage());
        }
    }

    private String onlyDigits(String value) {
        return value.replaceAll("\\D", "");
    }
}
