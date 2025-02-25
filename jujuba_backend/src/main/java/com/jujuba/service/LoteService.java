package com.jujuba.service;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Lote;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.LoteRepository;
import com.jujuba.model.Produto;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class LoteService {

    private final LoteRepository loteRepository;
    private final FornecedoraRepository fornecedoraRepository;

    public Lote salvar(Lote lote) {

        Fornecedora fornecedora = fornecedoraRepository.findById(lote.getFornecedora().getId())
            .orElseThrow(() -> new IllegalArgumentException("Fornecedora não encontrada"));

        lote.setFornecedora(fornecedora);

        if (lote.getProdutos() != null && !lote.getProdutos().isEmpty()) {
            for (Produto produto : lote.getProdutos()) {
                produto.setLote(lote);
            }
        }

        return loteRepository.save(lote);
    }
}
