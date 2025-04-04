package com.jujuba.service;

import com.jujuba.mapper.VendaMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.model.Produto;
import com.jujuba.model.Venda;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.ProdutoRepository;
import com.jujuba.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final CarrinhoService carrinhoService;
    private final FornecedoraRepository fornecedoraRepository;
    private final ProdutoRepository produtoRepository;

    public Venda finalizarVendaSimples() {
        BigDecimal totalVenda = carrinhoService.calcularTotal();
        List<Produto> produtosCarrinho = carrinhoService.listarProdutos();
    
        if (produtosCarrinho.isEmpty()) {
            throw new RuntimeException("O carrinho está vazio!");
        }
    
        for (Produto produto : produtosCarrinho) {
            if (produto.getQuantidade() == null || produto.getQuantidade() <= 0) {
                throw new RuntimeException("Produto '" + produto.getDescricao() + "' está indisponível no estoque!");
            }
        }
    
        Venda venda = VendaMapper.mapearVendaSimples(totalVenda, produtosCarrinho);
    
        for (Produto produto : produtosCarrinho) {
            produto.setQuantidade(produto.getQuantidade() - 1);
            produtoRepository.save(produto);
        }
    
        carrinhoService.limparCarrinho();
        return vendaRepository.save(venda);
    }    

    public Venda finalizarVendaFornecedora(Long fornecedoraId) {
        BigDecimal totalVenda = carrinhoService.calcularTotal();
        List<Produto> produtosCarrinho = carrinhoService.listarProdutos();
    
        if (produtosCarrinho.isEmpty()) {
            throw new RuntimeException("O carrinho está vazio!");
        }
    
        for (Produto produto : produtosCarrinho) {
            if (produto.getQuantidade() == null || produto.getQuantidade() <= 0) {
                throw new RuntimeException("Produto '" + produto.getDescricao() + "' está indisponível no estoque!");
            }
        }
    
        Optional<Fornecedora> fornecedoraOptional = fornecedoraRepository.findById(fornecedoraId);
    
        if (fornecedoraOptional.isEmpty()) {
            throw new RuntimeException("Fornecedora não encontrada!");
        }
    
        Fornecedora fornecedora = fornecedoraOptional.get();
        Venda venda = VendaMapper.mapearVendaFornecedora(totalVenda, fornecedora, produtosCarrinho);
    
        for (Produto produto : produtosCarrinho) {
            produto.setQuantidade(produto.getQuantidade() - 1);
            produtoRepository.save(produto);
        }
    
        carrinhoService.limparCarrinho();
        return vendaRepository.save(venda);
    }

    public List<Venda> listarTodas() {
        return vendaRepository.findAll();
    }

    public Venda buscarPorId(Long id) {
        return vendaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada!"));
    }    
}