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
    public ResponseEntity<Transacao> enviarMoedas(@RequestBody EnviarMoedasDTO dto) {
        return ResponseEntity.ok(transacaoService.enviarMoedas(dto));
    }

    @PostMapping("/resgatar")
    public ResponseEntity<Transacao> resgatarVantagem(@RequestBody ResgateDTO dto) {
        return ResponseEntity.ok(transacaoService.resgatarVantagem(dto));
    }

    @GetMapping("/cupom/{codigoCupom}")
    public ResponseEntity<Transacao> consultarCupom(@PathVariable String codigoCupom) {
        return ResponseEntity.ok(transacaoService.consultarCupom(codigoCupom));
    }

    @PostMapping("/cupom/{codigoCupom}/validar")
    public ResponseEntity<Transacao> validarCupom(@PathVariable String codigoCupom) {
        return ResponseEntity.ok(transacaoService.validarCupom(codigoCupom));
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
