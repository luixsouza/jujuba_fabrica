package com.jujuba.service;

import com.jujuba.exception.EmptyCartException;
import com.jujuba.exception.FornecedoraNotFoundException;
import com.jujuba.exception.ProductUnavailableException;
import com.jujuba.exception.ResourceNotFoundException;
import com.jujuba.exception.SaleNotFoundException;
import com.jujuba.mapper.VendaMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.model.Produto;
import com.jujuba.model.Venda;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.ProdutoRepository;
import com.jujuba.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final CarrinhoService carrinhoService;
    private final FornecedoraRepository fornecedoraRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional
    public Venda finalizarVendaSimples() {
        List<Produto> produtosCarrinho = carrinhoService.listarProdutos();

        if (produtosCarrinho.isEmpty()) {
            throw new EmptyCartException("O carrinho está vazio. Adicione produtos antes de finalizar a venda.");
        }

        // Valida e decrementa o estoque na finalização da venda
        atualizarEstoque(produtosCarrinho);

        BigDecimal totalVenda = carrinhoService.calcularTotal();
        Venda venda = VendaMapper.mapearVendaSimples(totalVenda, produtosCarrinho);

        carrinhoService.limparCarrinho();

        return vendaRepository.save(venda);
    }

    @Transactional
    public Venda finalizarVendaFornecedora(Long fornecedoraId) {
        List<Produto> produtosCarrinho = carrinhoService.listarProdutos();

        if (produtosCarrinho.isEmpty()) {
            throw new EmptyCartException("O carrinho está vazio. Adicione produtos antes de finalizar a venda.");
        }

        Fornecedora fornecedora = fornecedoraRepository.findById(fornecedoraId)
                .orElseThrow(() -> new FornecedoraNotFoundException("Fornecedora com ID " + fornecedoraId + " não encontrada."));

        // Valida e decrementa o estoque na finalização da venda
        atualizarEstoque(produtosCarrinho);

        BigDecimal totalVenda = carrinhoService.calcularTotal();
        Venda venda = VendaMapper.mapearVendaFornecedora(totalVenda, fornecedora, produtosCarrinho);

        carrinhoService.limparCarrinho();

        return vendaRepository.save(venda);
    }

    public List<Venda> listarTodas() {
        return vendaRepository.findAll();
    }

    public Venda buscarPorId(Long id) {
        return vendaRepository.findById(id)
                .orElseThrow(() -> new SaleNotFoundException("Venda com ID " + id + " não encontrada."));
    }

    private void atualizarEstoque(List<Produto> produtos) {
        System.out.println("[VENDA] Iniciando atualização de estoque para " + produtos.size() + " produtos");
        
        // Primeiro valida se há estoque suficiente para todos os produtos
        for (Produto produtoCarrinho : produtos) {
            Produto produtoAtual = produtoRepository.findById(produtoCarrinho.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoCarrinho.getId()));
            
            int estoqueAtual = produtoAtual.getQuantidade() != null ? produtoAtual.getQuantidade() : 0;
            System.out.println("[VENDA] Produto ID " + produtoCarrinho.getId() + " - Estoque atual: " + estoqueAtual);
            
            if (estoqueAtual <= 0) {
                throw new ProductUnavailableException("Produto indisponível ou fora de estoque: " + produtoAtual.getDescricao());
            }
        }
        
        // Se chegou até aqui, todos os produtos têm estoque, então decrementa
        for (Produto produtoCarrinho : produtos) {
            Produto produtoAtual = produtoRepository.findById(produtoCarrinho.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoCarrinho.getId()));
            
            int estoqueAtual = produtoAtual.getQuantidade() != null ? produtoAtual.getQuantidade() : 0;
            int novoEstoque = estoqueAtual - 1;
            produtoAtual.setQuantidade(novoEstoque);
            produtoRepository.save(produtoAtual);
            
            System.out.println("[VENDA] Produto ID " + produtoCarrinho.getId() + " - Estoque atualizado: " + estoqueAtual + " -> " + novoEstoque);
        }
        
        System.out.println("[VENDA] Atualização de estoque concluída");
    }
}