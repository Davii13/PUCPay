package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.AlunoDAO;
import br.PUCPay.WebSystem.model.Aluno;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlunoService {

    @Autowired
    private AlunoDAO alunoDAO;

    public Aluno save(Aluno aluno) {
        return alunoDAO.save(aluno);
    }

    public Aluno findById(Long id) {
        return alunoDAO.findById(id);
    }

    public List<Aluno> findAll() {
        return alunoDAO.findAll();
    }

    public Aluno update(Aluno aluno) {
        return alunoDAO.update(aluno);
    }

    public void delete(Long id) {
        alunoDAO.delete(id);
    }
}
