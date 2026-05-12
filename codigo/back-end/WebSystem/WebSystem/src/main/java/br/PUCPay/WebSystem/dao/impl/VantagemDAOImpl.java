package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.VantagemDAO;
import br.PUCPay.WebSystem.model.Vantagem;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class VantagemDAOImpl extends GenericDAOImpl<Vantagem> implements VantagemDAO {

    public VantagemDAOImpl() {
        super(Vantagem.class);
    }

    @Override
    public List<Vantagem> findByEmpresaId(Long empresaId) {
        return entityManager
                .createQuery("SELECT v FROM Vantagem v WHERE v.empresa.id = :empresaId", Vantagem.class)
                .setParameter("empresaId", empresaId)
                .getResultList();
    }
}
