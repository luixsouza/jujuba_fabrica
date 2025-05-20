package com.jujuba.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FornecedoraCreateDTO {
    
    @NotBlank
    @Size(max = 200)
    private String nome;

    @NotBlank
    @Size(max = 15)
    private String contato;

    @NotBlank
    @Size(max = 200)
    private String endereco;

    @NotBlank
    @Size(max = 100)
    private String chavePix;

    @NotBlank
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNascimento;
}