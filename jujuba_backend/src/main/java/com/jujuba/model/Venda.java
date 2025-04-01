package com.jujuba.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    private LocalDateTime dataVenda;

    @Enumerated(EnumType.STRING)
    private TipoVenda tipoVenda;

    private BigDecimal total;

    private BigDecimal valorBrecho;
    private BigDecimal valorFornecedora;

    @ManyToOne
    private Fornecedora fornecedora;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL)
    private List<ItemVenda> itens;
}