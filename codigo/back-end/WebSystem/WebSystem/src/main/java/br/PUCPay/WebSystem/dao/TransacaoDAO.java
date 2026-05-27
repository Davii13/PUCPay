package br.PUCPay.WebSystem.dao;

import br.PUCPay.WebSystem.model.Transacao;
import java.util.List;
import java.util.Optional;

public interface TransacaoDAO extends GenericDAO<Transacao> {
    List<Transacao> findByDestinatarioId(Long destinatarioId);
    List<Transacao> findByRemetenteId(Long remetenteId);
    List<Transacao> findByUsuarioId(Long usuarioId);
    Optional<Transacao> findByCodigoCupom(String codigoCupom);
}
