package com.jujuba.service;

import com.jujuba.model.Lote;
import com.jujuba.repository.LoteRepository;
import com.jujuba.model.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class LoteService {

    private final LoteRepository loteRepository;

    @Transactional
    public Lote criarLote(Lote lote) {
        if (lote.getProdutos() != null) {
            for (Produto produto : lote.getProdutos()) {
                produto.setLote(lote);
            }
        }
        return loteRepository.save(lote);
    }

}
