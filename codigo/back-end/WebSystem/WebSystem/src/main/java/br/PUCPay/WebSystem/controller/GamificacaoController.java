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
@CrossOrigin(origins = "*")
public class GamificacaoController {

    @Autowired
    private GamificacaoService gamificacaoService;

    @GetMapping("/aluno/{id}/badges")
    public ResponseEntity<List<AlunoBadge>> getBadgesAluno(@PathVariable Long id) {
        try {
            List<AlunoBadge> badges = gamificacaoService.getBadgesAluno(id);
            return ResponseEntity.ok(badges);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        try {
            List<Aluno> leaderboard = gamificacaoService.getLeaderboard();

            List<Map<String, Object>> resultado = leaderboard.stream()
                .limit(50)
                .map(aluno -> Map.of(
                    "id", aluno.getId(),
                    "nome", aluno.getNome(),
                    "xpTotal", aluno.getXpTotal(),
                    "nivel", aluno.getNivel(),
                    "totalResgates", aluno.getTotalResgates(),
                    "saldo", aluno.getSaldo()
                ))
                .toList();

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
