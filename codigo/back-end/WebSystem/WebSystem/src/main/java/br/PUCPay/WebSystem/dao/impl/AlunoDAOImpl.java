package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.AlunoDAO;
import br.PUCPay.WebSystem.model.Aluno;
import org.springframework.stereotype.Repository;

@Repository
public class AlunoDAOImpl extends GenericDAOImpl<Aluno> implements AlunoDAO {
    public AlunoDAOImpl() {
        super(Aluno.class);
    }
}
