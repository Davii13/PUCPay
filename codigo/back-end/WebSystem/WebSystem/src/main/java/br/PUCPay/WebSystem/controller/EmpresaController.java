package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.model.Empresa;
import br.PUCPay.WebSystem.model.Usuario;
import br.PUCPay.WebSystem.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            Empresa empresa = new Empresa();
            empresa.setNome(payload.get("nome").toString());
            empresa.setEmail(payload.get("email").toString());
            empresa.setLogin(payload.get("login") != null ? payload.get("login").toString() : payload.get("email").toString());
            empresa.setTelefone(payload.getOrDefault("telefone", "").toString());
            empresa.setSenha(payload.get("senha").toString());
            empresa.setRole(Usuario.Role.EMPRESA);
            empresa.setCnpj(payload.getOrDefault("cnpj", "").toString());
            return ResponseEntity.ok(empresaService.save(empresa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> getById(@PathVariable Long id) {
        Empresa empresa = empresaService.findById(id);
        return empresa != null ? ResponseEntity.ok(empresa) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> getAll() {
        return ResponseEntity.ok(empresaService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Empresa empresa = empresaService.findById(id);
            if (empresa == null) return ResponseEntity.notFound().build();

            if (payload.containsKey("nome")) empresa.setNome(payload.get("nome").toString());
            if (payload.containsKey("email")) empresa.setEmail(payload.get("email").toString());
            if (payload.containsKey("telefone")) empresa.setTelefone(payload.get("telefone").toString());
            if (payload.containsKey("cnpj")) empresa.setCnpj(payload.get("cnpj").toString());

            return ResponseEntity.ok(empresaService.update(empresa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        empresaService.delete(id);
        return ResponseEntity.ok().build();
    }
}
