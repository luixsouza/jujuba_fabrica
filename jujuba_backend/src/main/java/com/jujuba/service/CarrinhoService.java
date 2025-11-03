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
        // Delegate to multi-unit method for single unit
        adicionarProduto(produtoId, 1);
    }

    /**
     * Adiciona várias unidades de um produto ao carrinho.
     * Apenas verifica disponibilidade, sem decrementar o estoque.
     * O estoque será decrementado apenas na finalização da venda.
     */
    public synchronized void adicionarProduto(Long produtoId, int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));

        int estoqueDisponivel = produto.getQuantidade() != null ? produto.getQuantidade() : 0;
        
        // Conta quantas unidades deste produto já estão no carrinho
        long unidadesNoCarrinho = carrinho.stream()
                .filter(p -> p.getId().equals(produtoId))
                .count();
        
        if (estoqueDisponivel < (unidadesNoCarrinho + quantidade)) {
            throw new ProductUnavailableException("Não é possível adicionar mais unidades do produto (ID " + produtoId + "). Estoque disponível: " + (estoqueDisponivel - unidadesNoCarrinho) + ".");
        }

        // Adiciona ao carrinho SEM decrementar o estoque
        for (int i = 0; i < quantidade; i++) {
            carrinho.add(produto);
        }
    }

    public void removerProduto(Long produtoId) {
        // Remove apenas uma ocorrência do produto no carrinho (uma unidade)
        int indexToRemove = -1;
        for (int i = 0; i < carrinho.size(); i++) {
            Produto p = carrinho.get(i);
            if (p.getId().equals(produtoId)) {
                indexToRemove = i;
                break;
            }
        }

        if (indexToRemove == -1) {
            throw new ResourceNotFoundException("Produto com ID " + produtoId + " não está no carrinho.");
        }

        // Remove somente a unidade encontrada do carrinho
        // Não altera o estoque, pois ele não foi decrementado ao adicionar
        carrinho.remove(indexToRemove);
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