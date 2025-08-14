package com.jujuba.mapper;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.ItemVenda;
import com.jujuba.model.Produto;
import com.jujuba.model.Venda;
import com.jujuba.utils.enums.TipoVenda;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

public class VendaMapper {

    private static final BigDecimal PERCENTUAL_BRECHO = new BigDecimal("0.60"); // 60% para o brechó
    private static final BigDecimal PERCENTUAL_FORNECEDORA = new BigDecimal("0.40"); // 40% para a fornecedora

    /**
     * Mapeia uma venda simples (sem fornecedora)
     */
    public static Venda mapearVendaSimples(BigDecimal totalVenda, List<Produto> produtos) {
        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_SIMPLES);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(totalVenda); // Todo valor vai para o brechó
        venda.setValorFornecedora(BigDecimal.ZERO);
        venda.setFornecedora(null);

        // Criar itens da venda
        List<ItemVenda> itens = produtos.stream()
                .map(produto -> criarItemVenda(produto, venda))
                .collect(Collectors.toList());
        
        venda.setItens(itens);
        
        return venda;
    }

    /**
     * Mapeia uma venda com fornecedora
     */
    public static Venda mapearVendaFornecedora(BigDecimal totalVenda, Fornecedora fornecedora, List<Produto> produtos) {
        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_FORNECEDOR);
        venda.setTotal(totalVenda);
        venda.setFornecedora(fornecedora);

        // Calcular divisão de valores
        BigDecimal valorBrecho = totalVenda.multiply(PERCENTUAL_BRECHO).setScale(2, RoundingMode.HALF_UP);
        BigDecimal valorFornecedora = totalVenda.multiply(PERCENTUAL_FORNECEDORA).setScale(2, RoundingMode.HALF_UP);
        
        venda.setValorBrecho(valorBrecho);
        venda.setValorFornecedora(valorFornecedora);

        // Criar itens da venda
        List<ItemVenda> itens = produtos.stream()
                .map(produto -> criarItemVenda(produto, venda))
                .collect(Collectors.toList());
        
        venda.setItens(itens);
        
        return venda;
    }

    /**
     * Cria um item de venda a partir de um produto
     */
    private static ItemVenda criarItemVenda(Produto produto, Venda venda) {
        ItemVenda item = new ItemVenda();
        item.setProduto(produto);
        item.setVenda(venda);
        item.setQuantidade(1); // Por padrão, quantidade 1
        item.setPrecoUnitario(produto.getPreco());
        item.setSubtotal(produto.getPreco());
        
        return item;
    }

    /**
     * Calcula o total de uma lista de produtos
     */
    public static BigDecimal calcularTotal(List<Produto> produtos) {
        return produtos.stream()
                .map(Produto::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
