package com.jujuba.service;

import com.jujuba.model.Lote;
import com.jujuba.model.Produto;
import com.jujuba.repository.LoteRepository;
import com.jujuba.repository.ProdutoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private ProdutoRepository produtoRepository;
    private LoteRepository loteRepository;

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto salvar(Produto produto) {
        Optional<Lote> lote = loteRepository.findById(produto.getLote().getId());
        if (lote.isEmpty()) {
            throw new IllegalArgumentException("Lote não encontrado.");
        }
        return produtoRepository.save(produto);
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produtoExistente = buscarPorId(id);
        if (produtoExistente != null) {
            //produtoExistente.setNome(produtoAtualizado.getNome());
            produtoExistente.setDescricao(produtoAtualizado.getDescricao());
            //produtoExistente.setCodigo(produtoAtualizado.getCodigo());
            produtoExistente.setPreco(produtoAtualizado.getPreco());
            return produtoRepository.save(produtoExistente);
        }
        return null;
    }

    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }
}
