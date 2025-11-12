package com.jujuba.mapper;

import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.dto.FornecedoraResponseDTO;
import com.jujuba.model.Fornecedora;

public class FornecedoraMapper {

    public static Fornecedora toFornecedora(FornecedoraCreateDTO dto) {
        Fornecedora fornecedora = new Fornecedora();
        fornecedora.setNome(dto.getNome());
        fornecedora.setContato(dto.getContato());
        fornecedora.setEndereco(dto.getEndereco());
        fornecedora.setChavePix(dto.getChavePix() != null && !dto.getChavePix().trim().isEmpty() ? dto.getChavePix() : null);
        fornecedora.setDataNascimento(dto.getDataNascimento());
        fornecedora.setCreditoLoja(dto.getCreditoLoja());
        return fornecedora;
    }

    public static void updateFornecedoraFromDTO(Fornecedora fornecedora, FornecedoraCreateDTO dto) {
        fornecedora.setNome(dto.getNome());
        fornecedora.setContato(dto.getContato());
        fornecedora.setEndereco(dto.getEndereco());
        fornecedora.setChavePix(dto.getChavePix() != null && !dto.getChavePix().trim().isEmpty() ? dto.getChavePix() : null);
        fornecedora.setDataNascimento(dto.getDataNascimento());
        fornecedora.setCreditoLoja(dto.getCreditoLoja());
    }

    public static FornecedoraResponseDTO toDTO(Fornecedora fornecedora) {
        return new FornecedoraResponseDTO(
            fornecedora.getId(),
            fornecedora.getNome(),
            fornecedora.getContato(),
            fornecedora.getEndereco(),
            fornecedora.getChavePix(),
            fornecedora.getContratoUrl(),
            fornecedora.getDataNascimento(),
            fornecedora.getCreditoLoja()
        );
    }
}

