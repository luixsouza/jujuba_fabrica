package com.jujuba.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jujuba.exception.ProductNotFoundException;
import com.jujuba.model.Produto;
import com.jujuba.repository.ProdutoRepository;

@ExtendWith(MockitoExtension.class)
public class ProdutoServiceTest {

    @InjectMocks
    private ProdutoService produtoService;

    @Mock
    private ProdutoRepository produtoRepository;

    private Produto produto;

    @BeforeEach
    void setup() {
        produto = new Produto();
        produto.setId(1L);
        produto.setDescricao("Produto teste");
    }

    @Test
    void listarTodos_DeveRetornarListaProdutos() {
        when(produtoRepository.findAll()).thenReturn(Collections.singletonList(produto));

        var produtos = produtoService.listarTodos();

        assertEquals(1, produtos.size());
        assertEquals(produto.getId(), produtos.get(0).getId());
        verify(produtoRepository).findAll();
    }

    @Test
    void buscarPorId_QuandoExistir_DeveRetornarProduto() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        Produto encontrado = produtoService.buscarPorId(1L);

        assertNotNull(encontrado);
        assertEquals(produto.getId(), encontrado.getId());
        verify(produtoRepository).findById(1L);
    }

    @Test
    void buscarPorId_QuandoNaoExistir_DeveLancaExcecao() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> produtoService.buscarPorId(1L));
        verify(produtoRepository).findById(1L);
    }

    @Test
    void excluir_DeveExcluirProdutoExistente() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        produtoService.excluir(1L);

        verify(produtoRepository).delete(produto);
    }

    @Test
    void excluir_QuandoProdutoNaoExistir_DeveLancarExcecao() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> produtoService.excluir(1L));
        verify(produtoRepository, never()).delete(any(Produto.class));
    }
}