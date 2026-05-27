package br.PUCPay.WebSystem.dao;

import br.PUCPay.WebSystem.model.Badge;
import java.util.List;

public interface BadgeDAO extends GenericDAO<Badge> {
    Badge findByTipo(Badge.TipoBadge tipo);
    List<Badge> findAll();
}
