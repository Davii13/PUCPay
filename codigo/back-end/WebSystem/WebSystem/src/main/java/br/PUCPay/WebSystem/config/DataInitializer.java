package br.PUCPay.WebSystem.config;

import br.PUCPay.WebSystem.model.Instituicao;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

@Configuration
public class DataInitializer {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public CommandLineRunner initData(PlatformTransactionManager transactionManager) {
        return args -> {
            TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
            transactionTemplate.execute(status -> {
                if (entityManager.createQuery("select count(i) from Instituicao i", Long.class).getSingleResult() == 0) {
                    String[] instituicoes = {"PUC Minas", "UFMG", "UEMG", "UNA", "UniBH"};
                    for (String nome : instituicoes) {
                        Instituicao inst = new Instituicao();
                        inst.setNome(nome);
                        entityManager.persist(inst);
                    }
                }
                
                if (entityManager.createQuery("select count(a) from Admin a", Long.class).getSingleResult() == 0) {
                    br.PUCPay.WebSystem.model.Admin admin = new br.PUCPay.WebSystem.model.Admin("Administrador", "admin@pucpay.com", "admin", "admin123");
                    entityManager.persist(admin);
                }

                return null;
            });
        };
    }
}
