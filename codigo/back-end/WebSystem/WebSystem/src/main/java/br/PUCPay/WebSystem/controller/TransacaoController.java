package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.dto.EnviarMoedasDTO;
import br.PUCPay.WebSystem.dto.ResgateDTO;
import br.PUCPay.WebSystem.model.Transacao;
import br.PUCPay.WebSystem.service.TransacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transacoes")
public class TransacaoController {

    @Autowired
    private TransacaoService transacaoService;

    @PostMapping("/enviar")
    public ResponseEntity<?> enviarMoedas(@RequestBody EnviarMoedasDTO dto) {
        try {
            Transacao transacao = transacaoService.enviarMoedas(dto);
            return ResponseEntity.ok(transacao);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/resgatar")
    public ResponseEntity<?> resgatarVantagem(@RequestBody ResgateDTO dto) {
        try {
            Transacao transacao = transacaoService.resgatarVantagem(dto);
            return ResponseEntity.ok(transacao);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/cupom/{codigoCupom}")
    public ResponseEntity<?> consultarCupom(@PathVariable String codigoCupom) {
        try {
            return ResponseEntity.ok(transacaoService.consultarCupom(codigoCupom));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/cupom/{codigoCupom}/validar")
    public ResponseEntity<?> validarCupom(@PathVariable String codigoCupom) {
        try {
            return ResponseEntity.ok(transacaoService.validarCupom(codigoCupom));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/aluno/{id}")
    public ResponseEntity<List<Transacao>> getExtratoAluno(@PathVariable Long id) {
        return ResponseEntity.ok(transacaoService.getExtratoAluno(id));
    }

    @GetMapping("/professor/{id}")
    public ResponseEntity<List<Transacao>> getExtratoProfessor(@PathVariable Long id) {
        return ResponseEntity.ok(transacaoService.getExtratoProfessor(id));
    }
}
