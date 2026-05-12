package br.PUCPay.WebSystem.dao.impl;

import br.PUCPay.WebSystem.dao.UsuarioDAO;
import br.PUCPay.WebSystem.model.Usuario;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioDAOImpl extends GenericDAOImpl<Usuario> implements UsuarioDAO {

    public UsuarioDAOImpl() {
        super(Usuario.class);
    }

    @Override
    public Optional<Usuario> findByLogin(String login) {
        List<Usuario> result = entityManager
                .createQuery("SELECT u FROM Usuario u WHERE u.login = :login OR u.email = :login", Usuario.class)
                .setParameter("login", login)
                .getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        List<Usuario> result = entityManager
                .createQuery("SELECT u FROM Usuario u WHERE u.email = :email", Usuario.class)
                .setParameter("email", email)
                .getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }
}
