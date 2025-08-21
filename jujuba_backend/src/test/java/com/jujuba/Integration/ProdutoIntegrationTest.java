package com.jujuba.Integration;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Lote;
import com.jujuba.model.Produto;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.LoteRepository;
import com.jujuba.repository.ProdutoRepository;
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
public class ProdutoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private FornecedoraRepository fornecedoraRepository;

    private Produto produtoTeste;
    private Lote loteTeste;

    @BeforeEach
    void setUp() {
        produtoRepository.deleteAll();
        loteRepository.deleteAll();
        fornecedoraRepository.deleteAll();

        // Criar fornecedora para o lote
        Fornecedora fornecedora = new Fornecedora();
        fornecedora.setNome("Fornecedora Teste");
        fornecedora.setContato("11999999999");
        fornecedora.setEndereco("Rua Teste, 123");
        fornecedora.setDataNascimento(LocalDate.of(1990, 1, 1));
        fornecedora.setChavePix("teste@email.com");
        fornecedora.setCreditoLoja(BigDecimal.valueOf(100.00));
        fornecedora = fornecedoraRepository.save(fornecedora);

        // Criar lote
        loteTeste = new Lote();
        loteTeste.setFornecedora(fornecedora);
        loteTeste.setDataRecebimento(LocalDate.now());
        loteTeste = loteRepository.save(loteTeste);

        // Criar produto
        produtoTeste = new Produto();
        produtoTeste.setDescricao("Camiseta Teste");
        produtoTeste.setMarca("Marca Teste");
        produtoTeste.setTamanho("M");
        produtoTeste.setEstadoConservacao(EstadoConservacao.BOM);
        produtoTeste.setGenero(Genero.UNISSEX);
        produtoTeste.setPreco(BigDecimal.valueOf(25.00));
        produtoTeste.setQuantidade(5);
        produtoTeste.setLote(loteTeste);
    }

    @Test
    void deveListarTodosProdutos() throws Exception {
        Produto produto1 = produtoRepository.save(produtoTeste);
        
        Produto produto2 = new Produto();
        produto2.setDescricao("Calça Teste");
        produto2.setMarca("Outra Marca");
        produto2.setTamanho("G");
        produto2.setEstadoConservacao(EstadoConservacao.OTIMO);
        produto2.setGenero(Genero.FEMININO);
        produto2.setPreco(BigDecimal.valueOf(45.00));
        produto2.setQuantidade(3);
        produto2.setLote(loteTeste);
        produtoRepository.save(produto2);

        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].descricao", is("Camiseta Teste")))
                .andExpect(jsonPath("$[0].marca", is("Marca Teste")))
                .andExpect(jsonPath("$[0].preco", is(25.00)))
                .andExpect(jsonPath("$[0].quantidade", is(5)))
                .andExpect(jsonPath("$[1].descricao", is("Calça Teste")))
                .andExpect(jsonPath("$[1].marca", is("Outra Marca")))
                .andExpect(jsonPath("$[1].preco", is(45.00)))
                .andExpect(jsonPath("$[1].quantidade", is(3)));
    }

    @Test
    void deveBuscarProdutoPorId() throws Exception {
        Produto produtoSalvo = produtoRepository.save(produtoTeste);

        mockMvc.perform(get("/api/produtos/{id}", produtoSalvo.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(produtoSalvo.getId().intValue())))
                .andExpect(jsonPath("$.descricao", is("Camiseta Teste")))
                .andExpect(jsonPath("$.marca", is("Marca Teste")))
                .andExpect(jsonPath("$.tamanho", is("M")))
                .andExpect(jsonPath("$.estadoConservacao", is("BOM")))
                .andExpect(jsonPath("$.genero", is("UNISSEX")))
                .andExpect(jsonPath("$.preco", is(25.00)))
                .andExpect(jsonPath("$.quantidade", is(5)));
    }

    @Test
    void deveRetornar404AoBuscarProdutoInexistente() throws Exception {
        mockMvc.perform(get("/api/produtos/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveExcluirProduto() throws Exception {
        Produto produtoSalvo = produtoRepository.save(produtoTeste);

        mockMvc.perform(delete("/api/produtos/{id}", produtoSalvo.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/produtos/{id}", produtoSalvo.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornar404AoExcluirProdutoInexistente() throws Exception {
        mockMvc.perform(delete("/api/produtos/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveVerificarEstoqueDisponivel() throws Exception {
        produtoTeste.setQuantidade(0); // Produto sem estoque
        Produto produtoSemEstoque = produtoRepository.save(produtoTeste);

        mockMvc.perform(get("/api/produtos/{id}", produtoSemEstoque.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantidade", is(0)));
    }

    @Test
    void deveListarProdutosPorEstadoConservacao() throws Exception {
        // Produto em estado BOM
        Produto produtoBom = produtoRepository.save(produtoTeste);
        
        // Produto em estado OTIMO
        Produto produtoOtimo = new Produto();
        produtoOtimo.setDescricao("Produto Ótimo");
        produtoOtimo.setMarca("Marca Premium");
        produtoOtimo.setTamanho("P");
        produtoOtimo.setEstadoConservacao(EstadoConservacao.OTIMO);
        produtoOtimo.setGenero(Genero.MASCULINO);
        produtoOtimo.setPreco(BigDecimal.valueOf(80.00));
        produtoOtimo.setQuantidade(2);
        produtoOtimo.setLote(loteTeste);
        produtoRepository.save(produtoOtimo);

        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.estadoConservacao == 'BOM')]", hasSize(1)))
                .andExpect(jsonPath("$[?(@.estadoConservacao == 'OTIMO')]", hasSize(1)));
    }

    @Test
    void deveListarProdutosPorGenero() throws Exception {
        // Produto UNISSEX
        Produto produtoUnissex = produtoRepository.save(produtoTeste);
        
        // Produto FEMININO
        Produto produtoFeminino = new Produto();
        produtoFeminino.setDescricao("Blusa Feminina");
        produtoFeminino.setMarca("Marca Feminina");
        produtoFeminino.setTamanho("PP");
        produtoFeminino.setEstadoConservacao(EstadoConservacao.BOM);
        produtoFeminino.setGenero(Genero.FEMININO);
        produtoFeminino.setPreco(BigDecimal.valueOf(35.00));
        produtoFeminino.setQuantidade(4);
        produtoFeminino.setLote(loteTeste);
        produtoRepository.save(produtoFeminino);

        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.genero == 'UNISSEX')]", hasSize(1)))
                .andExpect(jsonPath("$[?(@.genero == 'FEMININO')]", hasSize(1)));
    }
}
