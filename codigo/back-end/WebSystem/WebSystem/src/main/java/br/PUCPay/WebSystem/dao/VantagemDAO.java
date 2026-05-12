package br.PUCPay.WebSystem.dao;

import br.PUCPay.WebSystem.model.Vantagem;
import java.util.List;

public interface VantagemDAO extends GenericDAO<Vantagem> {
    List<Vantagem> findByEmpresaId(Long empresaId);
}
