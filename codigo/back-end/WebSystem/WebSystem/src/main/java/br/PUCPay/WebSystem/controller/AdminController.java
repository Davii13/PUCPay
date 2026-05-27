package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.dto.CreditarMoedasDTO;
import br.PUCPay.WebSystem.model.Professor;
import br.PUCPay.WebSystem.service.AdminService;
import br.PUCPay.WebSystem.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ProfessorService professorService;

    @PostMapping("/creditar")
    public ResponseEntity<?> creditarMoedas(@RequestBody CreditarMoedasDTO dto) {
        try {
            Professor professor = adminService.creditarMoedas(dto);
            return ResponseEntity.ok(professor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/professores")
    public ResponseEntity<List<Professor>> getAllProfessores() {
        return ResponseEntity.ok(professorService.findAll());
    }
}
