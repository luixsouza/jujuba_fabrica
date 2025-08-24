package com.jujuba.Integration;

import com.jujuba.model.*;
import com.jujuba.repository.*;
import com.jujuba.service.CarrinhoService;
import com.jujuba.service.VendaService;
import com.jujuba.utils.enums.EstadoConservacao;
import com.jujuba.utils.enums.Genero;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class EstoqueIntegrationTest {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private FornecedoraRepository fornecedoraRepository;

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private CarrinhoService carrinhoService;

    @Autowired
    private VendaService vendaService;

    private Fornecedora fornecedoraTeste;
    private Lote loteTeste;
    private Produto produtoComEstoque;
    private Produto produtoSemEstoque;

    @BeforeEach
    void setUp() {
        vendaRepository.deleteAll();
        produtoRepository.deleteAll();
        loteRepository.deleteAll();
        fornecedoraRepository.deleteAll();
        carrinhoService.limparCarrinho();

        fornecedoraTeste = new Fornecedora();
        fornecedoraTeste.setNome("Fornecedora Estoque Teste");
        fornecedoraTeste.setContato("11999999999");
        fornecedoraTeste.setEndereco("Rua Teste, 123");
        fornecedoraTeste.setDataNascimento(LocalDate.of(1990, 1, 1));
        fornecedoraTeste.setChavePix("teste@email.com");
        fornecedoraTeste.setCreditoLoja(BigDecimal.valueOf(100.00));
        fornecedoraTeste = fornecedoraRepository.save(fornecedoraTeste);

        loteTeste = new Lote();
        loteTeste.setFornecedora(fornecedoraTeste);
        loteTeste = loteRepository.save(loteTeste);

        produtoComEstoque = new Produto();
        produtoComEstoque.setDescricao("Produto com Estoque");
        produtoComEstoque.setMarca("Marca Teste");
        produtoComEstoque.setTamanho("M");
        produtoComEstoque.setEstadoConservacao(EstadoConservacao.BOM);
        produtoComEstoque.setGenero(Genero.UNISSEX);
        produtoComEstoque.setPreco(BigDecimal.valueOf(30.00));
        produtoComEstoque.setQuantidade(10);
        produtoComEstoque.setLote(loteTeste);
        produtoComEstoque = produtoRepository.save(produtoComEstoque);

        produtoSemEstoque = new Produto();
        produtoSemEstoque.setDescricao("Produto sem Estoque");
        produtoSemEstoque.setMarca("Marca Teste");
        produtoSemEstoque.setTamanho("G");
        produtoSemEstoque.setEstadoConservacao(EstadoConservacao.OTIMO);
        produtoSemEstoque.setGenero(Genero.MASCULINO);
        produtoSemEstoque.setPreco(BigDecimal.valueOf(50.00));
        produtoSemEstoque.setQuantidade(0);
        produtoSemEstoque.setLote(loteTeste);
        produtoSemEstoque = produtoRepository.save(produtoSemEstoque);
    }

    @Test
    void deveVerificarEstoqueDisponivel() {
        assertTrue(produtoComEstoque.getQuantidade() > 0);
        assertEquals(0, produtoSemEstoque.getQuantidade());
    }

    @Test
    void deveAtualizarEstoqueAposVenda() {
        Integer estoqueInicial = produtoComEstoque.getQuantidade();
        carrinhoService.adicionarProduto(produtoComEstoque.getId());
        Venda venda = vendaService.finalizarVendaSimples();

        assertNotNull(venda);
        assertNotNull(venda.getId());

        Produto produtoAtualizado = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
        assertEquals(estoqueInicial - 1, produtoAtualizado.getQuantidade());
    }

    @Test
    void deveImpedirVendaComProdutoSemEstoque() {
        assertThrows(RuntimeException.class, () -> carrinhoService.adicionarProduto(produtoSemEstoque.getId()));
    }

    @Test
    void deveManterConsistenciaDoEstoqueEmVendasMultiplas() {
        Integer estoqueInicial = produtoComEstoque.getQuantidade();
        int numeroVendas = 3;

        for (int i = 0; i < numeroVendas; i++) {
            carrinhoService.adicionarProduto(produtoComEstoque.getId());
            vendaService.finalizarVendaSimples();
        }

        Produto produtoAtualizado = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
        assertEquals(estoqueInicial - numeroVendas, produtoAtualizado.getQuantidade());

        List<Venda> vendas = vendaRepository.findAll();
        assertEquals(numeroVendas, vendas.size());
    }

    @Test
    void deveZerarEstoqueQuandoVenderTodosItens() {
        produtoComEstoque.setQuantidade(2);
        produtoRepository.save(produtoComEstoque);

        carrinhoService.adicionarProduto(produtoComEstoque.getId());
        vendaService.finalizarVendaSimples();

        carrinhoService.adicionarProduto(produtoComEstoque.getId());
        vendaService.finalizarVendaSimples();

        Produto produtoAtualizado = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
        assertEquals(0, produtoAtualizado.getQuantidade());

        assertThrows(RuntimeException.class, () -> carrinhoService.adicionarProduto(produtoAtualizado.getId()));
    }

    @Test
    void deveListarProdutosComEstoqueDisponivel() {
        List<Produto> produtosDisponiveis = produtoRepository.findAll().stream()
                .filter(p -> p.getQuantidade() != null && p.getQuantidade() > 0)
                .toList();

        assertEquals(1, produtosDisponiveis.size());
        assertEquals(produtoComEstoque.getId(), produtosDisponiveis.get(0).getId());
    }

    @Test
    void deveCalcularValorTotalDoEstoque() {
        BigDecimal valorTotalEstoque = produtoRepository.findAll().stream()
                .filter(p -> p.getQuantidade() != null && p.getQuantidade() > 0)
                .map(p -> p.getPreco().multiply(BigDecimal.valueOf(p.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        assertEquals(BigDecimal.valueOf(300.00), valorTotalEstoque);
    }

    @Test
    void deveManterIntegridadeTransacionalNoEstoque() {
        Integer estoqueInicial = produtoComEstoque.getQuantidade();

        try {
            carrinhoService.adicionarProduto(produtoComEstoque.getId());
            Venda venda = vendaService.finalizarVendaSimples();
            assertNotNull(venda);
        } catch (Exception e) {
            Produto produtoVerificacao = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
            assertEquals(estoqueInicial, produtoVerificacao.getQuantidade());
        }
    }
}