package br.PUCPay.WebSystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "alunos")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Aluno extends Usuario {

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false, unique = true)
    private String rg;

    @Column(nullable = false)
    private String endereco;

    @ManyToOne
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;

    @Column(nullable = false)
    private String curso;

    private Double saldo = 0.0;

    @Column(nullable = false)
    private Integer xpTotal = 0;

    @Column(nullable = false)
    private Integer totalResgates = 0;

    @Column(nullable = false)
    private Double totalMoedasRecebidas = 0.0;

    public Integer getNivel() {
        return Math.max(1, (xpTotal / 100) + 1);
    }

    public Integer getXpProximoNivel() {
        Integer proximoNivel = getNivel() + 1;
        return (proximoNivel * 100) - xpTotal;
    }

    public Aluno(String nome, String email, String login, String senha, String cpf, String rg, String endereco,
            Instituicao instituicao, String curso) {
        super();
        setNome(nome);
        setEmail(email);
        setLogin(login);
        setSenha(senha);
        setRole(Role.ALUNO);
        this.cpf = cpf;
        this.rg = rg;
        this.endereco = endereco;
        this.instituicao = instituicao;
        this.curso = curso;
        this.saldo = 0.0;
        this.xpTotal = 0;
        this.totalResgates = 0;
        this.totalMoedasRecebidas = 0.0;
    }
}
