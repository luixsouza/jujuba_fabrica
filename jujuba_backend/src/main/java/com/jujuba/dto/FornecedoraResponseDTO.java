package com.jujuba.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

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
    
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNascimento;
}

