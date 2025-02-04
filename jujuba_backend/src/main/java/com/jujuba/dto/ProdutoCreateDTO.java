package com.jujuba.dto;

import org.springframework.web.multipart.MultipartFile;

import com.jujuba.utils.enums.EstadoConservacao;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProdutoCreateDTO {
    
    @NotBlank
    private String descricao;
    
    @NotBlank
    private String marca;
    
    @NotBlank
    private String tamanho;
    
    @NotBlank
    private EstadoConservacao estadoConservacao;
    
    @NotBlank
    private Double preco;
    
    @NotBlank
    private MultipartFile imagem;
    
    @NotBlank
    private Long fornecedora_id;
}
