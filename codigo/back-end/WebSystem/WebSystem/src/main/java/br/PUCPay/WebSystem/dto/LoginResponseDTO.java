package br.PUCPay.WebSystem.dto;

import br.PUCPay.WebSystem.model.Usuario;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String login;
    private String telefone;
    private Usuario.Role role;
    private Double saldo;
    private String cpf;
    private String rg;
    private String endereco;
    private String curso;
    private String departamento;
    private String cnpj;
    private Long instituicaoId;
    private String instituicaoNome;

    // Gamificação
    private Integer xpTotal;
    private Integer nivel;
    private Integer totalResgates;
    private Double totalMoedasRecebidas;
}
