package com.jujuba.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "item_venda")
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "venda_id", nullable = false)
    @JsonBackReference
    private Venda venda;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "preco_unitario", nullable = false)
    private BigDecimal precoUnitario;

    @Column(name = "subtotal", nullable = false)
    private BigDecimal subtotal;

    /**
     * Expõe a fornecedora do produto via JSON.
     * A fornecedora vem do lote ao qual o produto pertence.
     */
    @JsonProperty("fornecedora")
    public Fornecedora getFornecedora() {
        if (produto != null && produto.getLote() != null) {
            return produto.getLote().getFornecedora();
        }
        return null;
    }
}