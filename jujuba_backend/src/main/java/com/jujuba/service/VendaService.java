package com.jujuba.service;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Venda;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.VendaRepository;
import com.jujuba.utils.enums.TipoVenda;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final CarrinhoService carrinhoService;
    private final FornecedoraRepository fornecedoraRepository;

    public Venda finalizarVendaSimples() {
        BigDecimal totalVenda = carrinhoService.calcularTotal();

        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_SIMPLES);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(totalVenda);
        venda.setValorFornecedora(BigDecimal.ZERO);

        carrinhoService.limparCarrinho();

        return vendaRepository.save(venda);
    }

    public Venda finalizarVendaFornecedora(Long fornecedoraId) {
        BigDecimal totalVenda = carrinhoService.calcularTotal();
        Optional<Fornecedora> fornecedoraOptional = fornecedoraRepository.findById(fornecedoraId);

        if (fornecedoraOptional.isEmpty()) {
            throw new RuntimeException("Fornecedora não encontrada!");
        }

        Fornecedora fornecedora = fornecedoraOptional.get();
        BigDecimal valorFornecedora = totalVenda.multiply(new BigDecimal("0.60"));
        BigDecimal valorBrecho = totalVenda.multiply(new BigDecimal("0.40"));

        fornecedora.setCreditoLoja(fornecedora.getCreditoLoja().add(valorFornecedora));

        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_FORNECEDOR);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(valorBrecho);
        venda.setValorFornecedora(valorFornecedora);
        venda.setFornecedora(fornecedora);

        fornecedoraRepository.save(fornecedora);
        carrinhoService.limparCarrinho();

        return vendaRepository.save(venda);
    }
}