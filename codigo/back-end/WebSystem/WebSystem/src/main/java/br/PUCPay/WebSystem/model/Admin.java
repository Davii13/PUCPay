package br.PUCPay.WebSystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admins")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Admin extends Usuario {

    public Admin(String nome, String email, String login, String senha) {
        super();
        setNome(nome); setEmail(email); setLogin(login); setSenha(senha); setRole(Role.ADMIN);
    }
}
