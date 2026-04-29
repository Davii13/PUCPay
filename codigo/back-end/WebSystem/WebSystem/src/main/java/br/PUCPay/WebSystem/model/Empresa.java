package br.PUCPay.WebSystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "empresas")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Empresa extends Usuario {

    @Column(nullable = false)
    private String cnpj; // Adding CNPJ as it's common for companies, though not explicitly in text.

    // Advantages will be added in a later phase or as a separate entity.
}
