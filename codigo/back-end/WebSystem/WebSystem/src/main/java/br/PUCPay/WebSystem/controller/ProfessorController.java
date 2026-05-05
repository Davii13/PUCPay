package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.model.Professor;
import br.PUCPay.WebSystem.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "*")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @PostMapping
    public ResponseEntity<Professor> create(@RequestBody Professor professor) {
        return ResponseEntity.ok(professorService.save(professor));
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
    public ResponseEntity<Professor> update(@PathVariable Long id, @RequestBody Professor professor) {
        professor.setId(id);
        return ResponseEntity.ok(professorService.update(professor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professorService.delete(id);
        return ResponseEntity.ok().build();
    }
}
