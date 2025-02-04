package com.jujuba.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FornecedoraResponseDTO {
    
    private Long id;
    private String nome;
    private String contato;
    private String endereco;
    private String chavePix;
    private String contratoUrl;
}

