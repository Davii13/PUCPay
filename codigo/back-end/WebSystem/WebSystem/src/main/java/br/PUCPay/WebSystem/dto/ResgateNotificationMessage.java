package br.PUCPay.WebSystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResgateNotificationMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private String alunoEmail;
    private String alunoNome;
    private String alunoTelefone;
    private String vantagemTitulo;
    private String empresaEmail;
    private String empresaNome;
    private String codigoCupom;
    private String cupomUrl;
}
