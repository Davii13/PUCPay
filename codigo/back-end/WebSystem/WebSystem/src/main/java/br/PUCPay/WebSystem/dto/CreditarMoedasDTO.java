package br.PUCPay.WebSystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditarMoedasDTO {
    private Long professorId;
    private Double valor;
}
