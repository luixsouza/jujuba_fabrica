package com.jujuba.controller;

import com.jujuba.model.Produto;
import com.jujuba.service.CarrinhoService;
import com.jujuba.utils.enums.EstadoConservacao;
import com.jujuba.utils.enums.Genero;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CarrinhoControllerTest {

    @Mock
    private CarrinhoService carrinhoService;

    @InjectMocks
    private CarrinhoController carrinhoController;

    private Produto produto1;
    private Produto produto2;
    private List<Produto> produtosCarrinho;

    @BeforeEach
    void setUp() {
        produto1 = new Produto();
        produto1.setId(1L);
        produto1.setDescricao("Produto Teste 1");
        produto1.setMarca("Marca Teste 1");
        produto1.setTamanho("M");
        produto1.setEstadoConservacao(EstadoConservacao.OTIMO);
        produto1.setGenero(Genero.UNISSEX);
        produto1.setPreco(new BigDecimal("10.50"));
        produto1.setQuantidade(1);
        
        produto2 = new Produto();
        produto2.setId(2L);
        produto2.setDescricao("Produto Teste 2");
        produto2.setMarca("Marca Teste 2");
        produto2.setTamanho("G");
        produto2.setEstadoConservacao(EstadoConservacao.BOM);
        produto2.setGenero(Genero.FEMININO);
        produto2.setPreco(new BigDecimal("20.75"));
        produto2.setQuantidade(1);

        produtosCarrinho = Arrays.asList(produto1, produto2);
    }

    @Test
    @DisplayName("Deve adicionar produto ao carrinho com sucesso")
    void deveAdicionarProdutoAoCarrinhoComSucesso() {
        Long produtoId = 1L;
        doNothing().when(carrinhoService).adicionarProduto(produtoId);

        ResponseEntity<Void> response = carrinhoController.adicionarProduto(produtoId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(carrinhoService, times(1)).adicionarProduto(produtoId);
    }

    @Test
    @DisplayName("Deve remover produto do carrinho com sucesso")
    void deveRemoverProdutoDoCarrinhoComSucesso() {
        Long produtoId = 1L;
        doNothing().when(carrinhoService).removerProduto(produtoId);

        ResponseEntity<Void> response = carrinhoController.removerProduto(produtoId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(carrinhoService, times(1)).removerProduto(produtoId);
    }

    @Test
    @DisplayName("Deve listar produtos do carrinho com sucesso")
    void deveListarProdutosDoCarrinhoComSucesso() {
        when(carrinhoService.listarProdutos()).thenReturn(produtosCarrinho);

        ResponseEntity<List<Produto>> response = carrinhoController.listarProdutos();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(carrinhoService, times(1)).listarProdutos();
    }

    @Test
    @DisplayName("Deve retornar no content quando carrinho estiver vazio ao listar produtos")
    void deveRetornarNoContentQuandoCarrinhoVazioAoListarProdutos() {
        when(carrinhoService.listarProdutos()).thenReturn(new ArrayList<>());

        ResponseEntity<List<Produto>> response = carrinhoController.listarProdutos();

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(carrinhoService, times(1)).listarProdutos();
    }

    @Test
    @DisplayName("Deve calcular total do carrinho com sucesso")
    void deveCalcularTotalDoCarrinhoComSucesso() {
        BigDecimal totalEsperado = new BigDecimal("31.25");
        when(carrinhoService.calcularTotal()).thenReturn(totalEsperado);

        ResponseEntity<BigDecimal> response = carrinhoController.calcularTotal();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(totalEsperado, response.getBody());
        verify(carrinhoService, times(1)).calcularTotal();
    }

    @Test
    @DisplayName("Deve retornar no content quando carrinho estiver vazio ao calcular total")
    void deveRetornarNoContentQuandoCarrinhoVazioAoCalcularTotal() {
        when(carrinhoService.calcularTotal()).thenReturn(BigDecimal.ZERO);

        ResponseEntity<BigDecimal> response = carrinhoController.calcularTotal();

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(carrinhoService, times(1)).calcularTotal();
    }
}
