package com.jujuba.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Fornecedora {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O contato é obrigatório")
    private String contato;

    @NotBlank(message = "O endereço é obrigatório")
    private String endereco;

    @NotBlank(message = "A chave PIX é obrigatória")
    private String chavePix;

    private String contratoUrl; // URL para o arquivo do contrato

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getChavePix() { return chavePix; }
    public void setChavePix(String chavePix) { this.chavePix = chavePix; }

    public String getContratoUrl() { return contratoUrl; }
    public void setContratoUrl(String contratoUrl) { this.contratoUrl = contratoUrl; }
}
