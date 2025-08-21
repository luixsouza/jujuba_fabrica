package com.jujuba.Integration;

import com.jujuba.model.*;
import com.jujuba.repository.*;
import com.jujuba.service.CarrinhoService;
import com.jujuba.utils.enums.EstadoConservacao;
import com.jujuba.utils.enums.Genero;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public class VendaIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private FornecedoraRepository fornecedoraRepository;

    @Autowired
    private CarrinhoService carrinhoService;

    private Fornecedora fornecedoraTeste;
    private Lote loteTeste;
    private Produto produto1;
    private Produto produto2;

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
        fornecedoraTeste.setNome("Fornecedora Teste");
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

        // Criar produtos
        produto1 = new Produto();
        produto1.setDescricao("Camiseta Teste 1");
        produto1.setMarca("Marca 1");
        produto1.setTamanho("M");
        produto1.setEstadoConservacao(EstadoConservacao.BOM);
        produto1.setGenero(Genero.UNISSEX);
        produto1.setPreco(BigDecimal.valueOf(25.00));
        produto1.setQuantidade(5);
        produto1.setLote(loteTeste);
        produto1 = produtoRepository.save(produto1);

        produto2 = new Produto();
        produto2.setDescricao("Calça Teste 2");
        produto2.setMarca("Marca 2");
        produto2.setTamanho("G");
        produto2.setEstadoConservacao(EstadoConservacao.OTIMO);
        produto2.setGenero(Genero.FEMININO);
        produto2.setPreco(BigDecimal.valueOf(45.00));
        produto2.setQuantidade(3);
        produto2.setLote(loteTeste);
        produto2 = produtoRepository.save(produto2);
    }

    @Test
    void deveFinalizarVendaSimples() throws Exception {
        carrinhoService.adicionarProduto(produto1.getId());
        carrinhoService.adicionarProduto(produto2.getId());

        mockMvc.perform(post("/api/vendas/finalizar/simples"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipoVenda", is("SIMPLES")))
                .andExpect(jsonPath("$.total", is(70.00))) // 25.00 + 45.00
                .andExpect(jsonPath("$.itens", hasSize(2)))
                .andExpect(jsonPath("$.dataVenda", notNullValue()));

        // Verificar se o estoque foi atualizado
        Produto produto1Atualizado = produtoRepository.findById(produto1.getId()).orElseThrow();
        Produto produto2Atualizado = produtoRepository.findById(produto2.getId()).orElseThrow();
        
        // Estoque deve ter diminuído em 1 unidade para cada produto
        assert produto1Atualizado.getQuantidade() == 4; // era 5, agora 4
        assert produto2Atualizado.getQuantidade() == 2; // era 3, agora 2
    }

    @Test
    void deveFinalizarVendaComFornecedora() throws Exception {
        carrinhoService.adicionarProduto(produto1.getId());
        carrinhoService.adicionarProduto(produto2.getId());

        mockMvc.perform(post("/api/vendas/finalizar/fornecedora/{fornecedoraId}", fornecedoraTeste.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipoVenda", is("FORNECEDORA")))
                .andExpect(jsonPath("$.total", is(70.00)))
                .andExpect(jsonPath("$.fornecedora.id", is(fornecedoraTeste.getId().intValue())))
                .andExpect(jsonPath("$.fornecedora.nome", is("Fornecedora Teste")))
                .andExpect(jsonPath("$.itens", hasSize(2)))
                .andExpect(jsonPath("$.valorBrecho", notNullValue()))
                .andExpect(jsonPath("$.valorFornecedora", notNullValue()));
    }

    @Test
    void deveRetornar400AoFinalizarVendaComCarrinhoVazio() throws Exception {
        // Carrinho já está vazio pelo setUp

        mockMvc.perform(post("/api/vendas/finalizar/simples"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornar400AoFinalizarVendaComProdutoSemEstoque() throws Exception {
        // Zerar estoque do produto
        produto1.setQuantidade(0);
        produtoRepository.save(produto1);
        
        carrinhoService.adicionarProduto(produto1.getId());

        mockMvc.perform(post("/api/vendas/finalizar/simples"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornar404AoFinalizarVendaComFornecedoraInexistente() throws Exception {
        carrinhoService.adicionarProduto(produto1.getId());

        mockMvc.perform(post("/api/vendas/finalizar/fornecedora/{fornecedoraId}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveListarTodasVendas() throws Exception {
        // Criar algumas vendas
        carrinhoService.adicionarProduto(produto1.getId());
        mockMvc.perform(post("/api/vendas/finalizar/simples"));
        
        carrinhoService.adicionarProduto(produto2.getId());
        mockMvc.perform(post("/api/vendas/finalizar/fornecedora/{fornecedoraId}", fornecedoraTeste.getId()));

        mockMvc.perform(get("/api/vendas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].tipoVenda", anyOf(is("SIMPLES"), is("FORNECEDORA"))))
                .andExpect(jsonPath("$[1].tipoVenda", anyOf(is("SIMPLES"), is("FORNECEDORA"))));
    }

    @Test
    void deveBuscarVendaPorId() throws Exception {
        // Criar uma venda
        carrinhoService.adicionarProduto(produto1.getId());
        carrinhoService.adicionarProduto(produto2.getId());
        
        String response = mockMvc.perform(post("/api/vendas/finalizar/simples"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        // Extrair ID da venda (simplificado - em um teste real usaria ObjectMapper)
        Long vendaId = vendaRepository.findAll().get(0).getId();

        mockMvc.perform(get("/api/vendas/{id}", vendaId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(vendaId.intValue())))
                .andExpect(jsonPath("$.tipoVenda", is("SIMPLES")))
                .andExpect(jsonPath("$.total", is(70.00)))
                .andExpect(jsonPath("$.itens", hasSize(2)));
    }

    @Test
    void deveRetornar404AoBuscarVendaInexistente() throws Exception {
        mockMvc.perform(get("/api/vendas/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveCalcularValoresCorretamenteNaVendaComFornecedora() throws Exception {
        carrinhoService.adicionarProduto(produto1.getId()); // R$ 25,00
        carrinhoService.adicionarProduto(produto2.getId()); // R$ 45,00
        // Total: R$ 70,00

        mockMvc.perform(post("/api/vendas/finalizar/fornecedora/{fornecedoraId}", fornecedoraTeste.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total", is(70.00)))
                .andExpect(jsonPath("$.valorBrecho", notNullValue()))
                .andExpect(jsonPath("$.valorFornecedora", notNullValue()))
                // Verificar se a soma dos valores parciais é igual ao total
                .andExpect(jsonPath("$.valorBrecho + $.valorFornecedora", closeTo(70.00, 0.01)));
    }

    @Test
    void deveManterIntegridadeDoEstoqueAposVenda() throws Exception {
        Integer estoqueInicialProduto1 = produto1.getQuantidade();
        Integer estoqueInicialProduto2 = produto2.getQuantidade();

        carrinhoService.adicionarProduto(produto1.getId());
        carrinhoService.adicionarProduto(produto2.getId());

        mockMvc.perform(post("/api/vendas/finalizar/simples"))
                .andExpect(status().isOk());

        // Verificar estoque após venda
        Produto produto1Atualizado = produtoRepository.findById(produto1.getId()).orElseThrow();
        Produto produto2Atualizado = produtoRepository.findById(produto2.getId()).orElseThrow();

        assert produto1Atualizado.getQuantidade().equals(estoqueInicialProduto1 - 1);
        assert produto2Atualizado.getQuantidade().equals(estoqueInicialProduto2 - 1);
    }
}
