package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.dao.EmpresaDAO;
import br.PUCPay.WebSystem.model.Empresa;
import br.PUCPay.WebSystem.model.Vantagem;
import br.PUCPay.WebSystem.service.VantagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    @Autowired
    private VantagemService vantagemService;

    @Autowired
    private EmpresaDAO empresaDAO;

    @GetMapping
    public ResponseEntity<List<Vantagem>> getAll() {
        return ResponseEntity.ok(vantagemService.findAll());
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<Vantagem>> getByEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(vantagemService.findByEmpresaId(empresaId));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            Long empresaId = Long.valueOf(payload.get("empresaId").toString());
            Empresa empresa = empresaDAO.findById(empresaId);
            if (empresa == null) return ResponseEntity.badRequest().body("Empresa não encontrada");

            Vantagem vantagem = new Vantagem();
            vantagem.setTitulo(payload.get("titulo").toString());
            vantagem.setDescricao(payload.get("descricao").toString());
            vantagem.setCusto(Double.valueOf(payload.get("custo").toString()));
            vantagem.setFotoUrl(payload.containsKey("fotoUrl") ? payload.get("fotoUrl").toString() : null);
            vantagem.setEmpresa(empresa);

            return ResponseEntity.ok(vantagemService.save(vantagem));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Vantagem vantagem) {
        vantagem.setId(id);
        return ResponseEntity.ok(vantagemService.update(vantagem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vantagemService.delete(id);
        return ResponseEntity.ok().build();
    }
}
