package com.jujuba.mapper;

import com.jujuba.model.ItemVenda;
import com.jujuba.model.Produto;
import com.jujuba.model.Venda;
import com.jujuba.model.Fornecedora;
import com.jujuba.utils.enums.TipoVenda;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class VendaMapper {

    public static Venda mapearVendaSimples(BigDecimal totalVenda, List<Produto> produtosCarrinho) {
        Venda venda = new Venda();
        venda.setDataVenda(LocalDateTime.now());
        venda.setTipoVenda(TipoVenda.VENDA_SIMPLES);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(totalVenda);
        venda.setValorFornecedora(BigDecimal.ZERO);

        List<ItemVenda> itensVenda = produtosCarrinho.stream().map(produto -> {
            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setVenda(venda);
            item.setQuantidade(1);
            item.setPrecoUnitario(produto.getPreco());
            item.setSubtotal(produto.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade())));
            return item;
        }).collect(Collectors.toList());

        venda.setItens(itensVenda);
        return venda;
    }

    public static Venda mapearVendaFornecedora(BigDecimal totalVenda, Fornecedora fornecedora, List<Produto> produtosCarrinho) {
        Venda venda = new Venda();
        venda.setDataVenda(LocalDateTime.now());
        venda.setTipoVenda(TipoVenda.VENDA_FORNECEDOR);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(totalVenda.multiply(new BigDecimal("0.6"))); 
        venda.setValorFornecedora(totalVenda.multiply(new BigDecimal("0.4"))); 
        venda.setFornecedora(fornecedora);

        List<ItemVenda> itensVenda = produtosCarrinho.stream().map(produto -> {
            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setVenda(venda);
            item.setQuantidade(1);
            item.setPrecoUnitario(produto.getPreco());
            item.setSubtotal(produto.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade())));
            return item;
        }).collect(Collectors.toList());

        venda.setItens(itensVenda);
        return venda;
    }
}