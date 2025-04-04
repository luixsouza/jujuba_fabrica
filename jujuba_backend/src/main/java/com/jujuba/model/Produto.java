package com.jujuba.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jujuba.utils.enums.EstadoConservacao;
import com.jujuba.utils.enums.Genero;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @NotNull
    @Size(max = 300)
    @Column(name = "descricao", nullable = false, length = 300)
    private String descricao;
    
    @NotNull
    @Size(max = 100)
    @Column(name = "marca", nullable = false, length = 100)
    private String marca;
    
    @NotNull
    @Size(max = 50)
    @Column(name = "tamanho", nullable = false, length = 50)
    private String tamanho;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "estado_conservacao", nullable = false, length = 20)
    private EstadoConservacao estadoConservacao;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "genero", nullable = false, length = 10)
    private Genero genero;
    
    @NotNull
    @Column(name = "preco", nullable = false)
    private BigDecimal preco;
    
    @Column(nullable = false)
    private Integer quantidade = 1;
    
    @ManyToOne
    @JoinColumn(name = "lote_id", nullable = false)
    @JsonIgnore
    private Lote lote;
}