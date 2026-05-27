package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.AlunoBadgeDAO;
import br.PUCPay.WebSystem.model.AlunoBadge;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class AlunoBadgeDAOImpl extends GenericDAOImpl<AlunoBadge> implements AlunoBadgeDAO {

    public AlunoBadgeDAOImpl() {
        super(AlunoBadge.class);
    }

    @Override
    public List<AlunoBadge> findByAlunoId(Long alunoId) {
        return entityManager
            .createQuery("SELECT ab FROM AlunoBadge ab WHERE ab.aluno.id = :alunoId ORDER BY ab.dataConquista DESC", AlunoBadge.class)
            .setParameter("alunoId", alunoId)
            .getResultList();
    }

    @Override
    public Optional<AlunoBadge> findByAlunoIdAndBadgeId(Long alunoId, Long badgeId) {
        return entityManager
            .createQuery("SELECT ab FROM AlunoBadge ab WHERE ab.aluno.id = :alunoId AND ab.badge.id = :badgeId", AlunoBadge.class)
            .setParameter("alunoId", alunoId)
            .setParameter("badgeId", badgeId)
            .getResultList()
            .stream()
            .findFirst();
    }
}
