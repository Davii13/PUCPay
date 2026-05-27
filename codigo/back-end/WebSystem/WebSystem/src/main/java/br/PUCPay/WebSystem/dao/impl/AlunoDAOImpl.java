package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.AlunoDAO;
import br.PUCPay.WebSystem.model.Aluno;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class AlunoDAOImpl extends GenericDAOImpl<Aluno> implements AlunoDAO {
    public AlunoDAOImpl() {
        super(Aluno.class);
    }

    @Override
    public List<Aluno> getLeaderboard() {
        return entityManager
            .createQuery("SELECT a FROM Aluno a ORDER BY a.xpTotal DESC, a.saldo DESC", Aluno.class)
            .getResultList();
    }
}
