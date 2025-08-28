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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
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
@AutoConfigureMockMvc
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

        Fornecedora fornecedora = new Fornecedora();
        fornecedora.setNome("Fornecedora Teste");
        fornecedora.setContato("11999999999");
        fornecedora.setEndereco("Rua Teste, 123");
        fornecedora.setDataNascimento(LocalDate.of(1990, 1, 1));
        fornecedora.setChavePix("teste@email.com");
        fornecedora.setCreditoLoja(BigDecimal.valueOf(100.00));
        fornecedora = fornecedoraRepository.save(fornecedora);

        loteTeste = new Lote();
        loteTeste.setFornecedora(fornecedora);
        loteTeste = loteRepository.save(loteTeste);

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
}