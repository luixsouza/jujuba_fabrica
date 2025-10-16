package com.jujuba.service;

import com.jujuba.exception.ProductUnavailableException;
import com.jujuba.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));

        if (produto.getQuantidade() == null || produto.getQuantidade() <= 0) {
            throw new ProductUnavailableException("Produto com ID " + produtoId + " está indisponível ou com estoque zerado.");
        }

        long existentes = carrinho.stream().filter(p -> p.getId().equals(produtoId)).count();
        int estoqueDisponivel = produto.getQuantidade() != null ? produto.getQuantidade() : 0;
        if (existentes >= estoqueDisponivel) {
            throw new ProductUnavailableException("Não é possível adicionar mais unidades do produto (ID " + produtoId + "). Estoque disponível: " + estoqueDisponivel + ".");
        }

        produto.setQuantidade(estoqueDisponivel - 1);
        produtoRepository.save(produto);

        carrinho.add(produto);
    }

    public void removerProduto(Long produtoId) {
        boolean removido = carrinho.removeIf(produto -> produto.getId().equals(produtoId));
        if (!removido) {
            throw new ResourceNotFoundException("Produto com ID " + produtoId + " não está no carrinho.");
        }

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));
        int atual = produto.getQuantidade() != null ? produto.getQuantidade() : 0;
        produto.setQuantidade(atual + 1);
        produtoRepository.save(produto);
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