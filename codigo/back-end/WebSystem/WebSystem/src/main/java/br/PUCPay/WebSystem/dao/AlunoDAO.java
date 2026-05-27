package br.PUCPay.WebSystem.dao;

import br.PUCPay.WebSystem.model.Aluno;
import java.util.List;

public interface AlunoDAO extends GenericDAO<Aluno> {
    List<Aluno> getLeaderboard();
}
