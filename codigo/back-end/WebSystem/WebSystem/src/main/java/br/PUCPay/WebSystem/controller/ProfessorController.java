package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.dao.InstituicaoDAO;
import br.PUCPay.WebSystem.model.Instituicao;
import br.PUCPay.WebSystem.model.Professor;
import br.PUCPay.WebSystem.model.Usuario;
import br.PUCPay.WebSystem.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private InstituicaoDAO instituicaoDAO;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            Professor professor = new Professor();
            professor.setNome(payload.get("nome").toString());
            professor.setEmail(payload.get("email").toString());
            professor.setLogin(
                    payload.get("login") != null ? payload.get("login").toString() : payload.get("email").toString());
            professor.setTelefone(payload.getOrDefault("telefone", "").toString());
            professor.setSenha(payload.get("senha").toString());
            professor.setRole(Usuario.Role.PROFESSOR);
            professor.setCpf(payload.getOrDefault("cpf", "").toString());
            professor.setDepartamento(payload.getOrDefault("departamento", "Não informado").toString());
            professor.setSaldo(1000.0);

            if (payload.containsKey("instituicaoId") && payload.get("instituicaoId") != null) {
                Long instId = Long.valueOf(payload.get("instituicaoId").toString());
                Instituicao inst = instituicaoDAO.findById(instId);
                professor.setInstituicao(inst);
            }

            return ResponseEntity.ok(professorService.save(professor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> getById(@PathVariable Long id) {
        Professor professor = professorService.findById(id);
        return professor != null ? ResponseEntity.ok(professor) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Professor>> getAll() {
        return ResponseEntity.ok(professorService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Professor professor = professorService.findById(id);
            if (professor == null)
                return ResponseEntity.notFound().build();

            if (payload.containsKey("nome"))
                professor.setNome(payload.get("nome").toString());
            if (payload.containsKey("email"))
                professor.setEmail(payload.get("email").toString());
            if (payload.containsKey("telefone"))
                professor.setTelefone(payload.get("telefone").toString());
            if (payload.containsKey("departamento"))
                professor.setDepartamento(payload.get("departamento").toString());
            if (payload.containsKey("cpf"))
                professor.setCpf(payload.get("cpf").toString());

            return ResponseEntity.ok(professorService.update(professor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professorService.delete(id);
        return ResponseEntity.ok().build();
    }
}
