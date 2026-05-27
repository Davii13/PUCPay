package br.PUCPay.WebSystem.config;

import br.PUCPay.WebSystem.model.Instituicao;
import br.PUCPay.WebSystem.model.Badge;
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
                if (entityManager.createQuery("select count(i) from Instituicao i", Long.class)
                        .getSingleResult() == 0) {
                    String[] instituicoes = { "PUC Minas", "UFMG", "UEMG", "UNA", "UniBH" };
                    for (String nome : instituicoes) {
                        Instituicao inst = new Instituicao();
                        inst.setNome(nome);
                        entityManager.persist(inst);
                    }
                }

                if (entityManager.createQuery("select count(a) from Admin a", Long.class).getSingleResult() == 0) {
                    br.PUCPay.WebSystem.model.Admin admin = new br.PUCPay.WebSystem.model.Admin("Administrador",
                            "admin@pucpay.com", "admin", "admin123");
                    entityManager.persist(admin);
                }

                if (entityManager.createQuery("select count(b) from Badge b", Long.class).getSingleResult() == 0) {
                    Badge[] badges = {
                        new Badge(null, "Primeiros Passos", "Resgate sua primeira vantagem!", "🎯", Badge.TipoBadge.PRIMEIRO_RESGATE, 50, 1),
                        new Badge(null, "Colecionador", "Resgate 5 vantagens!", "🎁", Badge.TipoBadge.CINCO_RESGATES, 100, 5),
                        new Badge(null, "Viciado em Descontos", "Resgate 10 vantagens!", "🛍️", Badge.TipoBadge.DEZ_RESGATES, 150, 10),
                        new Badge(null, "Especialista em Ofertas", "Resgate 25 vantagens!", "⭐", Badge.TipoBadge.VINTE_CINCO_RESGATES, 250, 25),
                        new Badge(null, "Centenas", "Receba 100 moedas!", "💯", Badge.TipoBadge.CEM_MOEDAS_RECEBIDAS, 100, 100),
                        new Badge(null, "Milionário", "Receba 500 moedas!", "💰", Badge.TipoBadge.QUINHENTAS_MOEDAS_RECEBIDAS, 200, 500),
                        new Badge(null, "Super Milionário", "Receba 1000 moedas!", "👑", Badge.TipoBadge.MIL_MOEDAS_RECEBIDAS, 300, 1000),
                        new Badge(null, "Lenda", "Receba 5000 moedas!", "🏆", Badge.TipoBadge.FIVE_MIL_MOEDAS_RECEBIDAS, 500, 5000)
                    };
                    for (Badge badge : badges) {
                        entityManager.persist(badge);
                    }
                }

                return null;
            });
        };
    }
}
