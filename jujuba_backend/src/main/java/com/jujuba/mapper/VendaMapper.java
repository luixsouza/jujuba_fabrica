package com.jujuba.mapper;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Venda;
import com.jujuba.utils.enums.TipoVenda;

import java.math.BigDecimal;

public class VendaMapper {

    public static Venda mapearVendaSimples(BigDecimal totalVenda) {
        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_SIMPLES);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(totalVenda);
        venda.setValorFornecedora(BigDecimal.ZERO);
        return venda;
    }

    public static Venda mapearVendaFornecedora(BigDecimal totalVenda, Fornecedora fornecedora) {
        BigDecimal valorFornecedora = totalVenda.multiply(new BigDecimal("0.60"));
        BigDecimal valorBrecho = totalVenda.multiply(new BigDecimal("0.40"));

        fornecedora.setCreditoLoja(fornecedora.getCreditoLoja().add(valorFornecedora));

        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_FORNECEDOR);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(valorBrecho);
        venda.setValorFornecedora(valorFornecedora);
        venda.setFornecedora(fornecedora);
        
        return venda;
    }
}