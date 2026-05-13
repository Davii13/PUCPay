package br.PUCPay.WebSystem.dao;

import br.PUCPay.WebSystem.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioDAO extends GenericDAO<Usuario> {
    Optional<Usuario> findByLogin(String login);

    Optional<Usuario> findByEmail(String email);
}
