package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.AlunoDAO;
import br.PUCPay.WebSystem.dao.AlunoBadgeDAO;
import br.PUCPay.WebSystem.dao.BadgeDAO;
import br.PUCPay.WebSystem.model.Aluno;
import br.PUCPay.WebSystem.model.AlunoBadge;
import br.PUCPay.WebSystem.model.Badge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GamificacaoService {

    @Autowired
    private AlunoDAO alunoDAO;

    @Autowired
    private BadgeDAO badgeDAO;

    @Autowired
    private AlunoBadgeDAO alunoBadgeDAO;

    @Transactional
    public void registrarResgate(Long alunoId, Double valor) {
        Aluno aluno = alunoDAO.findById(alunoId);
        if (aluno == null) return;

        aluno.setTotalResgates(aluno.getTotalResgates() + 1);
        aluno.setXpTotal(aluno.getXpTotal() + 10);
        alunoDAO.update(aluno);

        verificarEAtribuirBadges(aluno);
    }

    @Transactional
    public void registrarRecebimentoMoedas(Long alunoId, Double valor) {
        Aluno aluno = alunoDAO.findById(alunoId);
        if (aluno == null) return;

        aluno.setTotalMoedasRecebidas(aluno.getTotalMoedasRecebidas() + valor);
        aluno.setXpTotal(aluno.getXpTotal() + Math.min(50, (int)(valor / 10)));
        alunoDAO.update(aluno);

        verificarEAtribuirBadges(aluno);
    }

    @Transactional
    private void verificarEAtribuirBadges(Aluno aluno) {
        System.out.println("[GAMIFICACAO] Verificando badges para aluno " + aluno.getId() +
                         " | Resgates: " + aluno.getTotalResgates() +
                         " | Moedas: " + aluno.getTotalMoedasRecebidas() +
                         " | XP: " + aluno.getXpTotal());

        // Badges de resgate (progressivos)
        if (aluno.getTotalResgates() >= 1) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.PRIMEIRO_RESGATE);
        }
        if (aluno.getTotalResgates() >= 5) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.CINCO_RESGATES);
        }
        if (aluno.getTotalResgates() >= 10) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.DEZ_RESGATES);
        }
        if (aluno.getTotalResgates() >= 25) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.VINTE_CINCO_RESGATES);
        }

        // Badges de moedas (progressivos)
        if (aluno.getTotalMoedasRecebidas() >= 100) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.CEM_MOEDAS_RECEBIDAS);
        }
        if (aluno.getTotalMoedasRecebidas() >= 500) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.QUINHENTAS_MOEDAS_RECEBIDAS);
        }
        if (aluno.getTotalMoedasRecebidas() >= 1000) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.MIL_MOEDAS_RECEBIDAS);
        }
        if (aluno.getTotalMoedasRecebidas() >= 5000) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.FIVE_MIL_MOEDAS_RECEBIDAS);
        }
    }

    private void atribuirBadgeSeNaoExistir(Aluno aluno, Badge.TipoBadge tipoBadge) {
        Badge badge = badgeDAO.findByTipo(tipoBadge);
        if (badge == null) {
            System.err.println("[GAMIFICACAO] Badge tipo " + tipoBadge + " não encontrado!");
            return;
        }

        Optional<AlunoBadge> jaPossui = alunoBadgeDAO.findByAlunoIdAndBadgeId(aluno.getId(), badge.getId());
        if (jaPossui.isEmpty()) {
            AlunoBadge alunoBadge = new AlunoBadge();
            alunoBadge.setAluno(aluno);
            alunoBadge.setBadge(badge);
            alunoBadgeDAO.save(alunoBadge);
            System.out.println("[GAMIFICACAO] Badge '" + badge.getNome() + "' atribuído ao aluno " + aluno.getId());
        } else {
            System.out.println("[GAMIFICACAO] Aluno " + aluno.getId() + " já possui badge '" + badge.getNome() + "'");
        }
    }

    public List<AlunoBadge> getBadgesAluno(Long alunoId) {
        return alunoBadgeDAO.findByAlunoId(alunoId);
    }

    public List<Map<String, Object>> getAllBadgesComStatus(Long alunoId) {
        List<Badge> todosBadges = badgeDAO.findAll();
        List<AlunoBadge> badgesDesbloqueados = alunoBadgeDAO.findByAlunoId(alunoId);

        return todosBadges.stream().map(badge -> {
            boolean desbloqueado = badgesDesbloqueados.stream()
                .anyMatch(ab -> ab.getBadge().getId().equals(badge.getId()));

            AlunoBadge alunoBadgeData = badgesDesbloqueados.stream()
                .filter(ab -> ab.getBadge().getId().equals(badge.getId()))
                .findFirst()
                .orElse(null);

            var resultado = Map.ofEntries(
                Map.entry("id", (Object) badge.getId()),
                Map.entry("nome", (Object) badge.getNome()),
                Map.entry("descricao", (Object) badge.getDescricao()),
                Map.entry("iconeUrl", (Object) badge.getIconeUrl()),
                Map.entry("tipo", (Object) badge.getTipo().toString()),
                Map.entry("xpRecompensa", (Object) badge.getXpRecompensa()),
                Map.entry("desbloqueado", (Object) desbloqueado)
            );

            if (alunoBadgeData != null) {
                var comData = new java.util.HashMap<String, Object>(resultado);
                comData.put("dataConquista", alunoBadgeData.getDataConquista());
                return comData;
            }
            return resultado;
        }).toList();
    }

    public Aluno getProgressoAluno(Long alunoId) {
        return alunoDAO.findById(alunoId);
    }

    public List<Aluno> getLeaderboard() {
        return alunoDAO.getLeaderboard();
    }

    public Integer getRankingAluno(Long alunoId) {
        List<Aluno> leaderboard = getLeaderboard();
        for (int i = 0; i < leaderboard.size(); i++) {
            if (leaderboard.get(i).getId().equals(alunoId)) {
                return i + 1;
            }
        }
        return -1;
    }
}
