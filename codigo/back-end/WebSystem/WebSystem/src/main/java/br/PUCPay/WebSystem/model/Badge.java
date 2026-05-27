package br.PUCPay.WebSystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Badge {

    public enum TipoBadge {
        PRIMEIRO_RESGATE,
        CINCO_RESGATES,
        DEZ_RESGATES,
        VINTE_CINCO_RESGATES,
        CEM_MOEDAS_RECEBIDAS,
        QUINHENTAS_MOEDAS_RECEBIDAS,
        MIL_MOEDAS_RECEBIDAS,
        FIVE_MIL_MOEDAS_RECEBIDAS
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 500)
    private String descricao;

    private String iconeUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoBadge tipo;

    @Column(nullable = false)
    private Integer xpRecompensa;

    @Column(nullable = false)
    private Integer criterioNumerico;
}
