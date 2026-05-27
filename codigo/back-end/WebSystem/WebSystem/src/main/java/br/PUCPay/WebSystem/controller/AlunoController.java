package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.dao.InstituicaoDAO;
import br.PUCPay.WebSystem.model.Aluno;
import br.PUCPay.WebSystem.model.Instituicao;
import br.PUCPay.WebSystem.model.Usuario;
import br.PUCPay.WebSystem.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private InstituicaoDAO instituicaoDAO;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            Aluno aluno = new Aluno();
            aluno.setNome(payload.get("nome").toString());
            aluno.setEmail(payload.get("email").toString());
            aluno.setLogin(payload.get("login") != null ? payload.get("login").toString() : payload.get("email").toString());
            aluno.setTelefone(payload.getOrDefault("telefone", "").toString());
            aluno.setSenha(payload.get("senha").toString());
            aluno.setRole(Usuario.Role.ALUNO);
            aluno.setCpf(payload.getOrDefault("cpf", "").toString());
            aluno.setRg(payload.getOrDefault("rg", "").toString());
            aluno.setEndereco(payload.getOrDefault("endereco", "").toString());
            aluno.setCurso(payload.getOrDefault("curso", "Não informado").toString());
            aluno.setSaldo(0.0);

            if (payload.containsKey("instituicaoId") && payload.get("instituicaoId") != null) {
                Long instId = Long.valueOf(payload.get("instituicaoId").toString());
                Instituicao inst = instituicaoDAO.findById(instId);
                aluno.setInstituicao(inst);
            }

            return ResponseEntity.ok(alunoService.save(aluno));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> getById(@PathVariable Long id) {
        Aluno aluno = alunoService.findById(id);
        return aluno != null ? ResponseEntity.ok(aluno) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Aluno>> getAll() {
        return ResponseEntity.ok(alunoService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Aluno aluno = alunoService.findById(id);
            if (aluno == null) return ResponseEntity.notFound().build();

            if (payload.containsKey("nome")) aluno.setNome(payload.get("nome").toString());
            if (payload.containsKey("email")) aluno.setEmail(payload.get("email").toString());
            if (payload.containsKey("telefone")) aluno.setTelefone(payload.get("telefone").toString());
            if (payload.containsKey("curso")) aluno.setCurso(payload.get("curso").toString());
            if (payload.containsKey("cpf")) aluno.setCpf(payload.get("cpf").toString());
            if (payload.containsKey("rg")) aluno.setRg(payload.get("rg").toString());
            if (payload.containsKey("endereco")) aluno.setEndereco(payload.get("endereco").toString());

            return ResponseEntity.ok(alunoService.update(aluno));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alunoService.delete(id);
        return ResponseEntity.ok().build();
    }
}
