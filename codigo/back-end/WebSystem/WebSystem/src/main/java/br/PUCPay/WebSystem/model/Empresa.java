package br.PUCPay.WebSystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empresas")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Empresa extends Usuario {

    @Column(nullable = false, unique = true)
    private String cnpj;

    public Empresa(String nome, String email, String login, String senha, String cnpj) {
        super();
        setNome(nome); setEmail(email); setLogin(login); setSenha(senha); setRole(Role.EMPRESA);
        this.cnpj = cnpj;
    }
}

