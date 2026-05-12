package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.InstituicaoDAO;
import br.PUCPay.WebSystem.model.Instituicao;
import org.springframework.stereotype.Repository;

@Repository
public class InstituicaoDAOImpl extends GenericDAOImpl<Instituicao> implements InstituicaoDAO {
    public InstituicaoDAOImpl() {
        super(Instituicao.class);
    }
}
