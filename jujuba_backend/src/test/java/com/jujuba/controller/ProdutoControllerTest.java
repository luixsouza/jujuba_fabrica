package com.jujuba.controller;

import com.jujuba.model.Produto;
import com.jujuba.service.ProdutoService;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProdutoControllerTest {

    @Mock
    private ProdutoService produtoService;

    @InjectMocks
    private ProdutoController produtoController;

    private Produto produto1;
    private Produto produto2;
    private List<Produto> produtos;

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

        produtos = Arrays.asList(produto1, produto2);
    }

    @Test
    @DisplayName("Deve listar todos os produtos com sucesso")
    void deveListarTodosProdutosComSucesso() {
        when(produtoService.listarTodos()).thenReturn(produtos);

        List<Produto> resultado = produtoController.listarProdutos();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals(produto1.getId(), resultado.get(0).getId());
        assertEquals(produto2.getId(), resultado.get(1).getId());
        verify(produtoService, times(1)).listarTodos();
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não houver produtos")
    void deveRetornarListaVaziaQuandoNaoHouverProdutos() {
        when(produtoService.listarTodos()).thenReturn(new ArrayList<>());

        List<Produto> resultado = produtoController.listarProdutos();

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(produtoService, times(1)).listarTodos();
    }

    @Test
    @DisplayName("Deve buscar produto por ID com sucesso")
    void deveBuscarProdutoPorIdComSucesso() {
        when(produtoService.buscarPorId(anyLong())).thenReturn(produto1);

        ResponseEntity<Produto> response = produtoController.buscarProduto(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Produto Teste 1", response.getBody().getDescricao());
        verify(produtoService, times(1)).buscarPorId(1L);
    }

    @Test
    @DisplayName("Deve excluir produto com sucesso")
    void deveExcluirProdutoComSucesso() {
        doNothing().when(produtoService).excluir(anyLong());

        ResponseEntity<String> response = produtoController.excluirProduto(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(produtoService, times(1)).excluir(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar produto inexistente")
    void deveLancarExcecaoAoBuscarProdutoInexistente() {
        when(produtoService.buscarPorId(anyLong())).thenThrow(new RuntimeException("Produto não encontrado"));

        assertThrows(RuntimeException.class, () -> {
            produtoController.buscarProduto(999L);
        });
        verify(produtoService, times(1)).buscarPorId(999L);
    }

    @Test
    @DisplayName("Deve lançar exceção ao excluir produto inexistente")
    void deveLancarExcecaoAoExcluirProdutoInexistente() {
        doThrow(new RuntimeException("Produto não encontrado")).when(produtoService).excluir(anyLong());

        assertThrows(RuntimeException.class, () -> {
            produtoController.excluirProduto(999L);
        });
        verify(produtoService, times(1)).excluir(999L);
    }
}
