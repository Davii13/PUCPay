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
        // Primeiro resgate
        if (aluno.getTotalResgates() == 1) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.PRIMEIRO_RESGATE);
        }

        // 5 resgates
        if (aluno.getTotalResgates() == 5) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.CINCO_RESGATES);
        }

        // 10 resgates
        if (aluno.getTotalResgates() == 10) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.DEZ_RESGATES);
        }

        // 25 resgates
        if (aluno.getTotalResgates() == 25) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.VINTE_CINCO_RESGATES);
        }

        // 100 moedas
        if (aluno.getTotalMoedasRecebidas() >= 100 && aluno.getTotalMoedasRecebidas() < 200) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.CEM_MOEDAS_RECEBIDAS);
        }

        // 500 moedas
        if (aluno.getTotalMoedasRecebidas() >= 500 && aluno.getTotalMoedasRecebidas() < 1000) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.QUINHENTAS_MOEDAS_RECEBIDAS);
        }

        // 1000 moedas
        if (aluno.getTotalMoedasRecebidas() >= 1000 && aluno.getTotalMoedasRecebidas() < 5000) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.MIL_MOEDAS_RECEBIDAS);
        }

        // 5000 moedas
        if (aluno.getTotalMoedasRecebidas() >= 5000) {
            atribuirBadgeSeNaoExistir(aluno, Badge.TipoBadge.FIVE_MIL_MOEDAS_RECEBIDAS);
        }
    }

    private void atribuirBadgeSeNaoExistir(Aluno aluno, Badge.TipoBadge tipoBadge) {
        Badge badge = badgeDAO.findByTipo(tipoBadge);
        if (badge == null) return;

        Optional<AlunoBadge> jaPossui = alunoBadgeDAO.findByAlunoIdAndBadgeId(aluno.getId(), badge.getId());
        if (jaPossui.isEmpty()) {
            AlunoBadge alunoBadge = new AlunoBadge();
            alunoBadge.setAluno(aluno);
            alunoBadge.setBadge(badge);
            alunoBadgeDAO.save(alunoBadge);
        }
    }

    public List<AlunoBadge> getBadgesAluno(Long alunoId) {
        return alunoBadgeDAO.findByAlunoId(alunoId);
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
