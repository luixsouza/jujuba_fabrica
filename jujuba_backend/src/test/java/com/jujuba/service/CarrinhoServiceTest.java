package com.jujuba.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jujuba.exception.ProductUnavailableException;
import com.jujuba.exception.ResourceNotFoundException;
import com.jujuba.model.Produto;
import com.jujuba.repository.ProdutoRepository; 

@ExtendWith(MockitoExtension.class)
class CarrinhoServiceTest {

    @InjectMocks
    CarrinhoService carrinhoService;

    @Mock
    ProdutoRepository produtoRepository; 

    Produto produto;
    
    @BeforeEach
    void setUp() {
        produto = new Produto();
        produto.setId(1L);
        produto.setDescricao("Produto Teste");
        produto.setPreco(new BigDecimal("50.00"));
        produto.setQuantidade(10);
    }

    @Test
    void adicionarProduto_ComSucesso() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        carrinhoService.adicionarProduto(1L);

        assertEquals(1, carrinhoService.listarProdutos().size());
    }

    @Test
    void adicionarProduto_ProdutoNaoEncontrado_DeveLancarExcecao() {
        when(produtoRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> carrinhoService.adicionarProduto(2L));
    }

    @Test
    void adicionarProduto_SemEstoque_DeveLancarExcecao() {
        produto.setQuantidade(0);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        assertThrows(ProductUnavailableException.class, () -> carrinhoService.adicionarProduto(1L));
    }

    @Test
    void removerProduto_ComSucesso() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        carrinhoService.adicionarProduto(1L);

        carrinhoService.removerProduto(1L);

        assertTrue(carrinhoService.listarProdutos().isEmpty());
    }

    @Test
    void listarProdutos_DeveRetornarProdutosAdicionados() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        carrinhoService.adicionarProduto(1L);

        assertFalse(carrinhoService.listarProdutos().isEmpty());
    }

    @Test
    void calcularTotal_DeveSomarPrecosCorretamente() {
        Produto produto2 = new Produto();
        produto2.setId(2L);
        produto2.setDescricao("Outro Produto");
        produto2.setPreco(new BigDecimal("30.00"));
        produto2.setQuantidade(5);

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(produtoRepository.findById(2L)).thenReturn(Optional.of(produto2));

        carrinhoService.adicionarProduto(1L);
        carrinhoService.adicionarProduto(2L);

        BigDecimal total = carrinhoService.calcularTotal();

        assertEquals(new BigDecimal("80.00"), total);
    }

    @Test
    void limparCarrinho_DeveEsvaziarCarrinho() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        carrinhoService.adicionarProduto(1L);

        carrinhoService.limparCarrinho();

        assertTrue(carrinhoService.listarProdutos().isEmpty());
    }
}
