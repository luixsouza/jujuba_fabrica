package com.jujuba.service;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Lote;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.LoteRepository;
import lombok.RequiredArgsConstructor;
import com.jujuba.model.Produto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
            List<Produto> produtosExistentes = loteExistente.getProdutos();
            List<Produto> produtosAtualizados = new ArrayList<>();
            
            // PRIMEIRO: Preservar TODOS os produtos vendidos (quantidade = 0)
            for (Produto produtoExistente : produtosExistentes) {
                if (produtoExistente.getQuantidade() == 0) {
                    // Produto vendido - SEMPRE preservar sem alterações
                    produtosAtualizados.add(produtoExistente);
                }
            }
            
            // SEGUNDO: Processar produtos com estoque (quantidade > 0)
            for (Produto produtoExistente : produtosExistentes) {
                if (produtoExistente.getQuantidade() > 0) {
                    boolean encontrado = false;
                    for (Produto produtoAtualizado : loteAtualizado.getProdutos()) {
                        if (produtoAtualizado.getId() != null && produtoAtualizado.getId().equals(produtoExistente.getId())) {
                            // Atualizar produto existente com estoque
                            produtoExistente.setDescricao(produtoAtualizado.getDescricao());
                            produtoExistente.setPreco(produtoAtualizado.getPreco());
                            produtoExistente.setMarca(produtoAtualizado.getMarca());
                            produtoExistente.setTamanho(produtoAtualizado.getTamanho());
                            produtoExistente.setEstadoConservacao(produtoAtualizado.getEstadoConservacao());
                            produtoExistente.setGenero(produtoAtualizado.getGenero());
                            produtoExistente.setQuantidade(produtoAtualizado.getQuantidade());
                            produtoExistente.setLote(loteExistente);
                            produtosAtualizados.add(produtoExistente);
                            encontrado = true;
                            break;
                        }
                    }
                    // Se produto com estoque não foi encontrado na atualização, foi removido pelo usuário
                    // Não adiciona à lista (efetivamente remove)
                }
            }
            
            // TERCEIRO: Adicionar novos produtos (sem ID)
            for (Produto produtoNovo : loteAtualizado.getProdutos()) {
                if (produtoNovo.getId() == null) {
                    produtoNovo.setLote(loteExistente);
                    produtosAtualizados.add(produtoNovo);
                }
            }
            
            loteExistente.setProdutos(produtosAtualizados);
        }
        
        return loteRepository.save(loteExistente);
    }

    public void deletar(Long id) {
        Lote lote = buscarPorId(id);
        loteRepository.delete(lote);
    }
}