package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.ProfessorDAO;
import br.PUCPay.WebSystem.model.Professor;
import org.springframework.stereotype.Repository;

@Repository
public class ProfessorDAOImpl extends GenericDAOImpl<Professor> implements ProfessorDAO {

    public ProfessorDAOImpl() {
        super(Professor.class);
    }
}
