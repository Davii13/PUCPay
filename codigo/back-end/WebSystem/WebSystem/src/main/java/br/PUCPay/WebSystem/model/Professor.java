package br.PUCPay.WebSystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "professores")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Professor extends Usuario {

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String departamento;

    private Double saldo = 1000.0;

    @ManyToOne
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;

    public Professor(String nome, String email, String login, String senha, String cpf, String departamento, Instituicao instituicao) {
        super();
        setNome(nome); setEmail(email); setLogin(login); setSenha(senha); setRole(Role.PROFESSOR);
        this.cpf = cpf; this.departamento = departamento; this.instituicao = instituicao; this.saldo = 1000.0;
    }
}
