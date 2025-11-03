package com.jujuba.service;

import com.jujuba.exception.ProductNotFoundException;
import com.jujuba.model.Produto;
import com.jujuba.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public List<Produto> listarComEstoque() {
        return produtoRepository.findByQuantidadeGreaterThan(0);
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    public void excluir(Long id) {
        Produto produto = buscarPorId(id);
        produtoRepository.delete(produto);
    }
}