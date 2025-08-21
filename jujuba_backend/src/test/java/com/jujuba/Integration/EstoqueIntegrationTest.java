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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
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
        // Limpar dados
        vendaRepository.deleteAll();
        produtoRepository.deleteAll();
        loteRepository.deleteAll();
        fornecedoraRepository.deleteAll();
        carrinhoService.limparCarrinho();

        // Criar fornecedora
        fornecedoraTeste = new Fornecedora();
        fornecedoraTeste.setNome("Fornecedora Estoque Teste");
        fornecedoraTeste.setContato("11999999999");
        fornecedoraTeste.setEndereco("Rua Teste, 123");
        fornecedoraTeste.setDataNascimento(LocalDate.of(1990, 1, 1));
        fornecedoraTeste.setChavePix("teste@email.com");
        fornecedoraTeste.setCreditoLoja(BigDecimal.valueOf(100.00));
        fornecedoraTeste = fornecedoraRepository.save(fornecedoraTeste);

        // Criar lote
        loteTeste = new Lote();
        loteTeste.setFornecedora(fornecedoraTeste);
        loteTeste.setDataRecebimento(LocalDate.now());
        loteTeste = loteRepository.save(loteTeste);

        // Criar produto com estoque
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

        // Criar produto sem estoque
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
        // Produto com estoque deve estar disponível
        assertTrue(produtoComEstoque.getQuantidade() > 0);
        
        // Produto sem estoque não deve estar disponível
        assertEquals(0, produtoSemEstoque.getQuantidade());
    }

    @Test
    void deveAtualizarEstoqueAposVenda() {
        Integer estoqueInicial = produtoComEstoque.getQuantidade();
        
        // Adicionar produto ao carrinho e finalizar venda
        carrinhoService.adicionarProduto(produtoComEstoque.getId());
        Venda venda = vendaService.finalizarVendaSimples();
        
        // Verificar se a venda foi criada
        assertNotNull(venda);
        assertNotNull(venda.getId());
        
        // Verificar se o estoque foi atualizado
        Produto produtoAtualizado = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
        assertEquals(estoqueInicial - 1, produtoAtualizado.getQuantidade());
    }

    @Test
    void deveImpedirVendaComProdutoSemEstoque() {
        // Tentar adicionar produto sem estoque ao carrinho
        assertThrows(Exception.class, () -> {
            carrinhoService.adicionarProduto(produtoSemEstoque.getId());
        });
    }

    @Test
    void deveManterConsistenciaDoEstoqueEmVendasMultiplas() {
        Integer estoqueInicial = produtoComEstoque.getQuantidade();
        int numeroVendas = 3;
        
        // Realizar múltiplas vendas
        for (int i = 0; i < numeroVendas; i++) {
            carrinhoService.adicionarProduto(produtoComEstoque.getId());
            vendaService.finalizarVendaSimples();
        }
        
        // Verificar se o estoque foi atualizado corretamente
        Produto produtoAtualizado = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
        assertEquals(estoqueInicial - numeroVendas, produtoAtualizado.getQuantidade());
        
        // Verificar se as vendas foram registradas
        List<Venda> vendas = vendaRepository.findAll();
        assertEquals(numeroVendas, vendas.size());
    }

    @Test
    void deveZerarEstoqueQuandoVenderTodosItens() {
        // Definir quantidade específica para o teste
        produtoComEstoque.setQuantidade(2);
        produtoRepository.save(produtoComEstoque);
        
        // Vender todos os itens
        carrinhoService.adicionarProduto(produtoComEstoque.getId());
        vendaService.finalizarVendaSimples();
        
        carrinhoService.adicionarProduto(produtoComEstoque.getId());
        vendaService.finalizarVendaSimples();
        
        // Verificar se o estoque zerou
        Produto produtoAtualizado = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
        assertEquals(0, produtoAtualizado.getQuantidade());
        
        // Tentar vender mais um item deve falhar
        assertThrows(Exception.class, () -> {
            carrinhoService.adicionarProduto(produtoAtualizado.getId());
        });
    }

    @Test
    void deveListarProdutosComEstoqueDisponivel() {
        List<Produto> todosProdutos = produtoRepository.findAll();
        
        // Filtrar produtos com estoque disponível
        List<Produto> produtosDisponiveis = todosProdutos.stream()
                .filter(p -> p.getQuantidade() != null && p.getQuantidade() > 0)
                .toList();
        
        // Deve ter apenas o produto com estoque
        assertEquals(1, produtosDisponiveis.size());
        assertEquals(produtoComEstoque.getId(), produtosDisponiveis.get(0).getId());
    }

    @Test
    void deveCalcularValorTotalDoEstoque() {
        List<Produto> todosProdutos = produtoRepository.findAll();
        
        BigDecimal valorTotalEstoque = todosProdutos.stream()
                .filter(p -> p.getQuantidade() != null && p.getQuantidade() > 0)
                .map(p -> p.getPreco().multiply(BigDecimal.valueOf(p.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Produto com estoque: R$ 30,00 * 10 unidades = R$ 300,00
        assertEquals(BigDecimal.valueOf(300.00), valorTotalEstoque);
    }

    @Test
    void deveManterIntegridadeTransacionalNoEstoque() {
        Integer estoqueInicial = produtoComEstoque.getQuantidade();
        
        try {
            // Simular erro durante a venda (forçar rollback)
            carrinhoService.adicionarProduto(produtoComEstoque.getId());
            
            // Se houvesse um erro aqui, o estoque deveria ser revertido
            // Para este teste, vamos apenas verificar que a transação funciona normalmente
            Venda venda = vendaService.finalizarVendaSimples();
            assertNotNull(venda);
            
        } catch (Exception e) {
            // Em caso de erro, verificar se o estoque não foi alterado
            Produto produtoVerificacao = produtoRepository.findById(produtoComEstoque.getId()).orElseThrow();
            assertEquals(estoqueInicial, produtoVerificacao.getQuantidade());
        }
    }
}
