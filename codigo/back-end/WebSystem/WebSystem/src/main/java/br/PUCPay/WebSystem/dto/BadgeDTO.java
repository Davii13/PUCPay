package br.PUCPay.WebSystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BadgeDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String iconeUrl;
    private String tipo;
    private Integer xpRecompensa;
}
