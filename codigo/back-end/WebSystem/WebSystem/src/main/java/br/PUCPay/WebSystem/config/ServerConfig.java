package br.PUCPay.WebSystem.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
public class ServerConfig {

    @Bean
    public ServletWebServerFactory servletWebServerFactory() throws UnknownHostException {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.setAddress(InetAddress.getByName("0.0.0.0"));
        factory.setPort(8080);
        return factory;
    }
}
