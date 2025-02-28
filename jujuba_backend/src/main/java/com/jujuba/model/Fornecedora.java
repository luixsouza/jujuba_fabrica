package com.jujuba.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@JsonIgnoreProperties({"contato", "endereco", "chavePix", "creditoLoja", "contratoUrl", "lotes"})
@Table(name = "fornecedora")
public class Fornecedora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false, length = 200)
    private String nome;

    @Column(name = "contato", nullable = false, length = 15)
    private String contato;

    @Column(name = "endereco", nullable = false, length = 200)
    private String endereco;

    @Column(name = "chave_pix", nullable = false, length = 100)
    private String chavePix;

    @Column(name = "credito_loja")
    private Double creditoLoja;

    @Column(name = "contrato_url")
    private String contratoUrl;

    @OneToMany(mappedBy = "fornecedora", cascade = CascadeType.ALL)
    private List<Lote> lotes;
}