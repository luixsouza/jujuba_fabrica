package com.jujuba.dto;

import org.springframework.web.multipart.MultipartFile;

import com.jujuba.utils.enums.EstadoConservacao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProdutoResponseDTO {
    
    private Long id;  
    private String descricao; 
    private String marca;  
    private String tamanho;  
    private EstadoConservacao estadoConservacao; 
    private Double preco;  
    private MultipartFile imagem;
    private Long fornecedora_id;
}
