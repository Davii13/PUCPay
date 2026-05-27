package br.PUCPay.WebSystem.dao;

import br.PUCPay.WebSystem.model.AlunoBadge;
import java.util.List;
import java.util.Optional;

public interface AlunoBadgeDAO extends GenericDAO<AlunoBadge> {
    List<AlunoBadge> findByAlunoId(Long alunoId);
    Optional<AlunoBadge> findByAlunoIdAndBadgeId(Long alunoId, Long badgeId);
}
