package br.PUCPay.WebSystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnviarMoedasDTO {
    private Long professorId;
    private Long alunoId;
    private Double valor;
    private String mensagem;
}
