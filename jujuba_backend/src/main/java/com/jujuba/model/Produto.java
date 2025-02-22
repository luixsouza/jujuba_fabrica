package com.jujuba.model;

import com.jujuba.utils.enums.EstadoConservacao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "descricao", nullable = false, length = 300)
    private String descricao;
    
    @Column(name = "marca", nullable = false, length = 100)
    private String marca;
    
    @Column(name = "tamanho", nullable = false, length = 50)
    private String tamanho;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_conservacao", nullable = false, length = 20)
    private EstadoConservacao estadoConservacao;
    
    @Column(name = "preco", nullable = false)
    private Double preco;
    
    @Column(name = "imagem_url", length = 300)
    private String imagemUrl;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "fornecedora_id", nullable = false)
    private Fornecedora fornecedora;
}
