package com.jujuba.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jujuba.utils.enums.TipoVenda;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataVenda;

    @Enumerated(EnumType.STRING)
    private TipoVenda tipoVenda;

    private BigDecimal total;

    private BigDecimal valorBrecho;
    private BigDecimal valorFornecedora;

    @ManyToOne
    private Fornecedora fornecedora;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ItemVenda> itens;

    @PrePersist
    public void prePersist() {
        this.dataVenda = LocalDateTime.now();
    }
}