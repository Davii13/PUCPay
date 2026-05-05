package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.ProfessorDAO;
import br.PUCPay.WebSystem.model.Professor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorDAO professorDAO;

    public Professor save(Professor professor) {
        if (professor.getSaldo() == null) {
            professor.setSaldo(5000.0);
        }
        return professorDAO.save(professor);
    }

    public Professor findById(Long id) {
        return professorDAO.findById(id);
    }

    public List<Professor> findAll() {
        return professorDAO.findAll();
    }

    public Professor update(Professor professor) {
        return professorDAO.update(professor);
    }

    public void delete(Long id) {
        professorDAO.delete(id);
    }
}
