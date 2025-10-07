package com.jujuba.service;

import com.jujuba.exception.EmptyCartException;
import com.jujuba.exception.FornecedoraNotFoundException;
import com.jujuba.exception.ProductUnavailableException;
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

        for (Produto produto : produtosCarrinho) {
            if (produto.getQuantidade() == null || produto.getQuantidade() <= 0) {
                throw new ProductUnavailableException("Produto indisponível ou fora de estoque: " + produto.getDescricao());
            }
        }

        BigDecimal totalVenda = carrinhoService.calcularTotal();
        Venda venda = VendaMapper.mapearVendaSimples(totalVenda, produtosCarrinho);

        atualizarEstoque(produtosCarrinho);
        carrinhoService.limparCarrinho();

        return vendaRepository.save(venda);
    }

    @Transactional
    public Venda finalizarVendaFornecedora(Long fornecedoraId) {
        List<Produto> produtosCarrinho = carrinhoService.listarProdutos();

        if (produtosCarrinho.isEmpty()) {
            throw new EmptyCartException("O carrinho está vazio. Adicione produtos antes de finalizar a venda.");
        }

        for (Produto produto : produtosCarrinho) {
            if (produto.getQuantidade() == null || produto.getQuantidade() <= 0) {
                throw new ProductUnavailableException("Produto indisponível ou fora de estoque: " + produto.getDescricao());
            }
        }

        Fornecedora fornecedora = fornecedoraRepository.findById(fornecedoraId)
                .orElseThrow(() -> new FornecedoraNotFoundException("Fornecedora com ID " + fornecedoraId + " não encontrada."));

        BigDecimal totalVenda = carrinhoService.calcularTotal();
        Venda venda = VendaMapper.mapearVendaFornecedora(totalVenda, fornecedora, produtosCarrinho);

        atualizarEstoque(produtosCarrinho);
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
        for (Produto produto : produtos) {
            Integer atual = produto.getQuantidade() != null ? produto.getQuantidade() : 0;
            int novo = Math.max(0, atual - 1);
            produto.setQuantidade(novo);
            produtoRepository.save(produto);
        }
    }
}