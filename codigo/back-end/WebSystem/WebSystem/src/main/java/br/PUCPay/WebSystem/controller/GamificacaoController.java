package br.PUCPay.WebSystem.controller;

import br.PUCPay.WebSystem.model.Aluno;
import br.PUCPay.WebSystem.model.AlunoBadge;
import br.PUCPay.WebSystem.service.GamificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamificacao")
public class GamificacaoController {

    @Autowired
    private GamificacaoService gamificacaoService;

    @GetMapping("/aluno/{id}/badges")
    public ResponseEntity<List<Map<String, Object>>> getBadgesAluno(@PathVariable Long id) {
        try {
            List<Map<String, Object>> badges = gamificacaoService.getAllBadgesComStatus(id);
            return ResponseEntity.ok(badges);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of(Map.of("error", e.getMessage())));
        }
    }

    @GetMapping("/aluno/{id}/progresso")
    public ResponseEntity<Map<String, Object>> getProgressoAluno(@PathVariable Long id) {
        try {
            Aluno aluno = gamificacaoService.getProgressoAluno(id);
            if (aluno == null) return ResponseEntity.notFound().build();

            Integer ranking = gamificacaoService.getRankingAluno(id);

            return ResponseEntity.ok(Map.of(
                "xpTotal", aluno.getXpTotal(),
                "nivel", aluno.getNivel(),
                "xpProximoNivel", aluno.getXpProximoNivel(),
                "totalResgates", aluno.getTotalResgates(),
                "totalMoedasRecebidas", aluno.getTotalMoedasRecebidas(),
                "ranking", ranking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        try {
            List<Aluno> leaderboard = gamificacaoService.getLeaderboard();

            var resultado = leaderboard.stream()
                .limit(50)
                .map(aluno -> Map.ofEntries(
                    Map.entry("id", aluno.getId()),
                    Map.entry("nome", aluno.getNome()),
                    Map.entry("xpTotal", aluno.getXpTotal()),
                    Map.entry("nivel", aluno.getNivel()),
                    Map.entry("totalResgates", aluno.getTotalResgates()),
                    Map.entry("saldo", aluno.getSaldo())
                ))
                .toList();

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
