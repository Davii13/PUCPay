package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.ProfessorDAO;
import br.PUCPay.WebSystem.dto.CreditarMoedasDTO;
import br.PUCPay.WebSystem.model.Professor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    @Autowired
    private ProfessorDAO professorDAO;

    @Transactional
    public Professor creditarMoedas(CreditarMoedasDTO dto) {
        Professor professor = professorDAO.findById(dto.getProfessorId());
        if (professor == null) throw new RuntimeException("Professor não encontrado");
        professor.setSaldo(professor.getSaldo() + dto.getValor());
        return professorDAO.update(professor);
    }
}
