package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.BadgeDAO;
import br.PUCPay.WebSystem.model.Badge;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class BadgeDAOImpl extends GenericDAOImpl<Badge> implements BadgeDAO {

    public BadgeDAOImpl() {
        super(Badge.class);
    }

    @Override
    public Badge findByTipo(Badge.TipoBadge tipo) {
        return entityManager
            .createQuery("SELECT b FROM Badge b WHERE b.tipo = :tipo", Badge.class)
            .setParameter("tipo", tipo)
            .getResultList()
            .stream()
            .findFirst()
            .orElse(null);
    }

    @Override
    public List<Badge> findAll() {
        return entityManager
            .createQuery("SELECT b FROM Badge b ORDER BY b.id", Badge.class)
            .getResultList();
    }
}
