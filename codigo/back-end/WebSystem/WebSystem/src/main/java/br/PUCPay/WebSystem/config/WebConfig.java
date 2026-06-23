package br.PUCPay.WebSystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configurações globais de CORS para a aplicação.
 *
 * O Spring Boot já possui a propriedade {@code app.cors.allowed-origins}
 * definida em {@code application.properties}. Esta classe lê o valor
 * dessa propriedade (ou da variável de ambiente {@code CORS_ALLOWED_ORIGINS})
 * e aplica‑o a todas as rotas da API.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Lista de origens permitidas, separadas por vírgula.
     * Exemplo padrão: "http://localhost:*,http://127.0.0.1:*,${app.frontend-url}".
     */
    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Converte a string separada por vírgulas para um array.
        String[] originsArray = allowedOrigins.split(",");
        registry.addMapping("/**")
                .allowedOrigins(originsArray)
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
