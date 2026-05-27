package br.PUCPay.WebSystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transacao {

    public enum Tipo {
        ENVIO, RESGATE
    }

    public enum StatusCupom {
        DISPONIVEL, USADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    @Column(nullable = false)
    private Double valor;

    @Column(length = 1000)
    private String mensagem;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "remetente_id")
    private Usuario remetente;

    @ManyToOne
    @JoinColumn(name = "destinatario_id")
    private Usuario destinatario;

    @ManyToOne
    @JoinColumn(name = "vantagem_id")
    private Vantagem vantagem;

    private String codigoCupom;

    @Enumerated(EnumType.STRING)
    private StatusCupom statusCupom;

    private LocalDateTime dataValidacaoCupom;

    @PrePersist
    public void prePersist() {
        if (dataHora == null) dataHora = LocalDateTime.now();
        if (tipo == Tipo.RESGATE && statusCupom == null) statusCupom = StatusCupom.DISPONIVEL;
    }
}
