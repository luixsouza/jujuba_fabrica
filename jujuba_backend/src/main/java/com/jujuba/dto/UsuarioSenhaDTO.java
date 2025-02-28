package com.jujuba.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UsuarioSenhaDTO {

    @NotBlank
    @Size(min = 50, max = 50)
    private String senhaAtual;

    @NotBlank
    @Size(min = 50, max = 50)
    private String novaSenha;

    @NotBlank
    @Size(min = 50, max = 50)
    private String confirmaSenha;
}
