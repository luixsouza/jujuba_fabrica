package com.jujuba.service;

import com.jujuba.exception.EmptyCartException;
import com.jujuba.exception.FornecedoraNotFoundException;
import com.jujuba.exception.ProductUnavailableException;
import com.jujuba.exception.SaleNotFoundException;
import com.jujuba.model.Fornecedora;
import com.jujuba.model.Produto;
import com.jujuba.model.Venda;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.ProdutoRepository;
import com.jujuba.repository.VendaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class VendaServiceTest {

    @InjectMocks
    private VendaService vendaService;

    @Mock
    private VendaRepository vendaRepository;

    @Mock
    private CarrinhoService carrinhoService;

    @Mock
    private FornecedoraRepository fornecedoraRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void finalizarVendaSimples_DeveSalvarVendaComSucesso() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setDescricao("Produto Teste");
        produto.setQuantidade(10);
        produto.setPreco(BigDecimal.valueOf(10));

        List<Produto> produtos = List.of(produto);

        when(carrinhoService.listarProdutos()).thenReturn(produtos);
        when(carrinhoService.calcularTotal()).thenReturn(BigDecimal.valueOf(100));
        when(vendaRepository.save(any(Venda.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venda venda = vendaService.finalizarVendaSimples();

        assertNotNull(venda);
        verify(produtoRepository, times(1)).save(any(Produto.class));
        verify(carrinhoService, times(1)).limparCarrinho();
        verify(vendaRepository, times(1)).save(any(Venda.class));
    }

    @Test
    void finalizarVendaSimples_DeveLancarExcecaoCarrinhoVazio() {
        when(carrinhoService.listarProdutos()).thenReturn(Collections.emptyList());

        assertThrows(EmptyCartException.class, () -> vendaService.finalizarVendaSimples());
    }

    @Test
    void finalizarVendaSimples_DeveLancarExcecaoProdutoIndisponivel() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setDescricao("Produto Indisponível");
        produto.setQuantidade(0);

        when(carrinhoService.listarProdutos()).thenReturn(List.of(produto));

        assertThrows(ProductUnavailableException.class, () -> vendaService.finalizarVendaSimples());
    }

    @Test
    void finalizarVendaFornecedora_DeveSalvarVendaComSucesso() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setDescricao("Produto Fornecedora");
        produto.setQuantidade(5);
        produto.setPreco(BigDecimal.valueOf(30));

        Fornecedora fornecedora = new Fornecedora();
        fornecedora.setId(1L);

        List<Produto> produtos = List.of(produto);

        when(carrinhoService.listarProdutos()).thenReturn(produtos);
        when(carrinhoService.calcularTotal()).thenReturn(BigDecimal.valueOf(150));
        when(fornecedoraRepository.findById(1L)).thenReturn(Optional.of(fornecedora));
        when(vendaRepository.save(any(Venda.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venda venda = vendaService.finalizarVendaFornecedora(1L);

        assertNotNull(venda);
        verify(produtoRepository, times(1)).save(any(Produto.class));
        verify(carrinhoService, times(1)).limparCarrinho();
        verify(vendaRepository, times(1)).save(any(Venda.class));
    }

    @Test
    void finalizarVendaFornecedora_DeveLancarExcecaoFornecedoraNaoEncontrada() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setDescricao("Produto Teste");
        produto.setQuantidade(5);

        when(carrinhoService.listarProdutos()).thenReturn(List.of(produto));
        when(fornecedoraRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FornecedoraNotFoundException.class, () -> vendaService.finalizarVendaFornecedora(1L));
    }

    @Test
    void listarTodas_DeveRetornarListaDeVendas() {
        when(vendaRepository.findAll()).thenReturn(Arrays.asList(new Venda(), new Venda()));

        List<Venda> vendas = vendaService.listarTodas();

        assertEquals(2, vendas.size());
        verify(vendaRepository, times(1)).findAll();
    }

    @Test
    void buscarPorId_DeveRetornarVenda() {
        Venda venda = new Venda();
        venda.setId(1L);

        when(vendaRepository.findById(1L)).thenReturn(Optional.of(venda));

        Venda encontrada = vendaService.buscarPorId(1L);

        assertEquals(1L, encontrada.getId());
    }

    @Test
    void buscarPorId_DeveLancarExcecaoVendaNaoEncontrada() {
        when(vendaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(SaleNotFoundException.class, () -> vendaService.buscarPorId(1L));
    }
}
