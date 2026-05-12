package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.TransacaoDAO;
import br.PUCPay.WebSystem.model.Transacao;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class TransacaoDAOImpl extends GenericDAOImpl<Transacao> implements TransacaoDAO {

    public TransacaoDAOImpl() {
        super(Transacao.class);
    }

    @Override
    public List<Transacao> findByDestinatarioId(Long destinatarioId) {
        return entityManager
                .createQuery("SELECT t FROM Transacao t WHERE t.destinatario.id = :id ORDER BY t.dataHora DESC", Transacao.class)
                .setParameter("id", destinatarioId)
                .getResultList();
    }

    @Override
    public List<Transacao> findByRemetenteId(Long remetenteId) {
        return entityManager
                .createQuery("SELECT t FROM Transacao t WHERE t.remetente.id = :id ORDER BY t.dataHora DESC", Transacao.class)
                .setParameter("id", remetenteId)
                .getResultList();
    }

    @Override
    public List<Transacao> findByUsuarioId(Long usuarioId) {
        return entityManager
                .createQuery("SELECT t FROM Transacao t WHERE t.remetente.id = :id OR t.destinatario.id = :id ORDER BY t.dataHora DESC", Transacao.class)
                .setParameter("id", usuarioId)
                .getResultList();
    }
}
