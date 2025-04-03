package com.jujuba.service;

import com.jujuba.mapper.VendaMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.model.Produto;
import com.jujuba.model.Venda;
import com.jujuba.repository.FornecedoraRepository;
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

    public Venda finalizarVendaSimples() {
        BigDecimal totalVenda = carrinhoService.calcularTotal();
        List<Produto> produtosCarrinho = carrinhoService.listarProdutos();

        if (produtosCarrinho.isEmpty()) {
            throw new RuntimeException("O carrinho está vazio!");
        }

        Venda venda = VendaMapper.mapearVendaSimples(totalVenda, produtosCarrinho);

        carrinhoService.limparCarrinho();
        return vendaRepository.save(venda);
    }

    public Venda finalizarVendaFornecedora(Long fornecedoraId) {
        BigDecimal totalVenda = carrinhoService.calcularTotal();
        List<Produto> produtosCarrinho = carrinhoService.listarProdutos();

        if (produtosCarrinho.isEmpty()) {
            throw new RuntimeException("O carrinho está vazio!");
        }

        Optional<Fornecedora> fornecedoraOptional = fornecedoraRepository.findById(fornecedoraId);

        if (fornecedoraOptional.isEmpty()) {
            throw new RuntimeException("Fornecedora não encontrada!");
        }

        Fornecedora fornecedora = fornecedoraOptional.get();
        Venda venda = VendaMapper.mapearVendaFornecedora(totalVenda, fornecedora, produtosCarrinho);

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