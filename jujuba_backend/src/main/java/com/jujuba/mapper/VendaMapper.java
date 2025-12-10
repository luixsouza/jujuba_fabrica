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
    public static Venda mapearVendaSimples(BigDecimal totalVenda, List<ItemVenda> itens) {
        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_SIMPLES);
        venda.setTotal(totalVenda);
        venda.setValorBrecho(totalVenda); // Todo valor vai para o brechó
        venda.setValorFornecedora(BigDecimal.ZERO);
        venda.setFornecedora(null);

        // Associar itens à venda
        itens.forEach(item -> item.setVenda(venda));
        venda.setItens(itens);
        
        return venda;
    }

    /**
     * Mapeia uma venda com fornecedora
     */
    public static Venda mapearVendaFornecedora(BigDecimal totalVenda, Fornecedora fornecedora, List<ItemVenda> itens) {
        Venda venda = new Venda();
        venda.setTipoVenda(TipoVenda.VENDA_FORNECEDOR);
        venda.setTotal(totalVenda);
        venda.setFornecedora(fornecedora);

        // Calcular divisão de valores
        BigDecimal valorBrecho = totalVenda.multiply(PERCENTUAL_BRECHO).setScale(2, RoundingMode.HALF_UP);
        BigDecimal valorFornecedora = totalVenda.multiply(PERCENTUAL_FORNECEDORA).setScale(2, RoundingMode.HALF_UP);
        
        venda.setValorBrecho(valorBrecho);
        venda.setValorFornecedora(valorFornecedora);

        // Associar itens à venda
        itens.forEach(item -> item.setVenda(venda));
        venda.setItens(itens);
        
        return venda;
    }

    /**
     * Cria um item de venda a partir de um produto e quantidade
     */
    public static ItemVenda criarItemVenda(Produto produto, Integer quantidade) {
        ItemVenda item = new ItemVenda();
        item.setProduto(produto);
        item.setQuantidade(quantidade != null ? quantidade : 1);
        item.setPrecoUnitario(produto.getPreco());
        item.setSubtotal(produto.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade())));
        
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
