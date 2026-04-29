package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.EmpresaDAO;
import br.PUCPay.WebSystem.model.Empresa;
import org.springframework.stereotype.Repository;

@Repository
public class EmpresaDAOImpl extends GenericDAOImpl<Empresa> implements EmpresaDAO {
    public EmpresaDAOImpl() {
        super(Empresa.class);
    }
}
