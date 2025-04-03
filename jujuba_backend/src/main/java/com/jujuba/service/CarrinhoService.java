package com.jujuba.service;

import com.jujuba.model.Produto;
import com.jujuba.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarrinhoService {

    private final ProdutoRepository produtoRepository;
    private final List<Produto> carrinho = new ArrayList<>();

    public void adicionarProduto(Long produtoId) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
        carrinho.add(produto);
    }

    public void removerProduto(Long produtoId) {
        carrinho.removeIf(produto -> produto.getId().equals(produtoId));
    }

    public List<Produto> listarProdutos() {
        return new ArrayList<>(carrinho);
    }

    public BigDecimal calcularTotal() {
        return carrinho.stream()
                .map(Produto::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void limparCarrinho() {
        carrinho.clear();
    }
}