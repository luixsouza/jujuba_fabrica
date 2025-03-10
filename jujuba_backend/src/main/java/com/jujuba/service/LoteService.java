package com.jujuba.service;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Lote;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.LoteRepository;
import lombok.RequiredArgsConstructor;
import com.jujuba.model.Produto;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<Lote> listarTodos() {
        return loteRepository.findAll();
    }

    public Lote buscarPorId(Long id) {
        return loteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Lote não encontrado"));
    }

    public Lote atualizar(Long id, Lote loteAtualizado) {
        Lote loteExistente = loteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Lote não encontrado"));
        
        Fornecedora fornecedora = fornecedoraRepository.findById(loteAtualizado.getFornecedora().getId())
            .orElseThrow(() -> new IllegalArgumentException("Fornecedora não encontrada"));
        loteExistente.setFornecedora(fornecedora);
        
        if (loteAtualizado.getProdutos() != null && !loteAtualizado.getProdutos().isEmpty()) {
            for (Produto produto : loteAtualizado.getProdutos()) {
                produto.setLote(loteExistente);
            }
            loteExistente.setProdutos(loteAtualizado.getProdutos());
        }
        
        return loteRepository.save(loteExistente);
    }

    public void deletar(Long id) {
        Lote lote = buscarPorId(id);
        loteRepository.delete(lote);
    }
}