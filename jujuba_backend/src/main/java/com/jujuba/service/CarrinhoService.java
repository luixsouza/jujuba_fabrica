package com.jujuba.service;

import com.jujuba.exception.ProductUnavailableException;
import com.jujuba.exception.ResourceNotFoundException;
import com.jujuba.model.Produto;
import com.jujuba.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CarrinhoService {

    private final ProdutoRepository produtoRepository;
    private final Map<Long, Integer> carrinho = new HashMap<>();

    public void adicionarProduto(Long produtoId) {
        // Delegate to multi-unit method for single unit
        adicionarProduto(produtoId, 1);
    }

    /**
     * Adiciona várias unidades de um produto ao carrinho de forma atômica.
     */
    public synchronized void adicionarProduto(Long produtoId, int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));

        int estoqueDisponivel = produto.getQuantidade() != null ? produto.getQuantidade() : 0;
        if (estoqueDisponivel < quantidade) {
            throw new ProductUnavailableException("Não é possível adicionar mais unidades do produto (ID " + produtoId + "). Estoque disponível: " + estoqueDisponivel + ".");
        }

        // decrementa o estoque de forma atômica
        produto.setQuantidade(estoqueDisponivel - quantidade);
        produtoRepository.save(produto);

        // adiciona quantidade ao carrinho
        carrinho.put(produtoId, carrinho.getOrDefault(produtoId, 0) + quantidade);
    }

    public void removerProduto(Long produtoId) {
        if (!carrinho.containsKey(produtoId)) {
            throw new ResourceNotFoundException("Produto com ID " + produtoId + " não está no carrinho.");
        }

        int quantidadeAtual = carrinho.get(produtoId);
        if (quantidadeAtual > 1) {
            carrinho.put(produtoId, quantidadeAtual - 1);
        } else {
            carrinho.remove(produtoId);
        }

        // Restaura uma unidade no estoque do produto persistido
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));
        int atual = produto.getQuantidade() != null ? produto.getQuantidade() : 0;
        produto.setQuantidade(atual + 1);
        produtoRepository.save(produto);
    }

    public List<Produto> listarProdutos() {
        List<Produto> produtos = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : carrinho.entrySet()) {
            Produto produto = produtoRepository.findById(entry.getKey())
                    .orElse(null);
            if (produto != null) {
                // Cria uma cópia do produto com a quantidade do carrinho (não a original)
                Produto produtoCarrinho = new Produto();
                produtoCarrinho.setId(produto.getId());
                produtoCarrinho.setDescricao(produto.getDescricao());
                produtoCarrinho.setPreco(produto.getPreco());
                produtoCarrinho.setMarca(produto.getMarca());
                produtoCarrinho.setTamanho(produto.getTamanho());
                produtoCarrinho.setGenero(produto.getGenero());
                produtoCarrinho.setEstadoConservacao(produto.getEstadoConservacao());
                // IMPORTANTE: usar a quantidade do carrinho, não do produto original
                produtoCarrinho.setQuantidade(entry.getValue());
                produtos.add(produtoCarrinho);
            }
        }
        return produtos;
    }

    public BigDecimal calcularTotal() {
        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<Long, Integer> entry : carrinho.entrySet()) {
            Produto produto = produtoRepository.findById(entry.getKey())
                    .orElse(null);
            if (produto != null) {
                BigDecimal precoUnitario = produto.getPreco() != null ? produto.getPreco() : BigDecimal.ZERO;
                total = total.add(precoUnitario.multiply(BigDecimal.valueOf(entry.getValue())));
            }
        }
        return total;
    }

    public void limparCarrinho() {
        carrinho.clear();
    }

    public int getTotalItens() {
        return carrinho.values().stream().mapToInt(Integer::intValue).sum();
    }
}