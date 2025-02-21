package com.jujuba.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "fornecedora")
public class Fornecedora implements Serializable {

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
}
