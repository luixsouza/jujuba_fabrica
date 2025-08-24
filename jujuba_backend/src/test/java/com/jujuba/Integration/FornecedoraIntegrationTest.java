package com.jujuba.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.model.Fornecedora;
import com.jujuba.repository.FornecedoraRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
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
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class FornecedoraIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FornecedoraRepository fornecedoraRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Fornecedora fornecedoraTeste;

    @BeforeEach
    void setUp() {
        fornecedoraRepository.deleteAll();
        
        fornecedoraTeste = new Fornecedora();
        fornecedoraTeste.setNome("Fornecedora Teste");
        fornecedoraTeste.setContato("11999999999");
        fornecedoraTeste.setEndereco("Rua Teste, 123");
        fornecedoraTeste.setDataNascimento(LocalDate.of(1990, 1, 1));
        fornecedoraTeste.setChavePix("teste@email.com");
        fornecedoraTeste.setCreditoLoja(BigDecimal.valueOf(100.00));
    }

    @Test
    void deveCadastrarFornecedoraSemContrato() throws Exception {
        FornecedoraCreateDTO dto = new FornecedoraCreateDTO();
        dto.setNome("Nova Fornecedora");
        dto.setContato("11888888888");
        dto.setEndereco("Rua Nova, 456");
        dto.setDataNascimento(LocalDate.of(1985, 5, 15));
        dto.setChavePix("nova@email.com");

        String fornecedoraJson = objectMapper.writeValueAsString(dto);

        mockMvc.perform(multipart("/api/fornecedoras")
                .param("fornecedora", fornecedoraJson)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome", is("Nova Fornecedora")))
                .andExpect(jsonPath("$.contato", is("11888888888")))
                .andExpect(jsonPath("$.endereco", is("Rua Nova, 456")))
                .andExpect(jsonPath("$.chavePix", is("nova@email.com")));
    }

    @Test
    void deveCadastrarFornecedoraComContrato() throws Exception {
        FornecedoraCreateDTO dto = new FornecedoraCreateDTO();
        dto.setNome("Fornecedora com Contrato");
        dto.setContato("11777777777");
        dto.setEndereco("Rua Contrato, 789");
        dto.setDataNascimento(LocalDate.of(1980, 12, 25));
        dto.setChavePix("contrato@email.com");

        String fornecedoraJson = objectMapper.writeValueAsString(dto);
        
        MockMultipartFile contrato = new MockMultipartFile(
                "contrato", 
                "contrato.pdf", 
                "application/pdf", 
                "conteudo do contrato".getBytes()
        );

        mockMvc.perform(multipart("/api/fornecedoras")
                .file(contrato)
                .param("fornecedora", fornecedoraJson)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome", is("Fornecedora com Contrato")))
                .andExpect(jsonPath("$.contratoUrl", notNullValue()));
    }

    @Test
    void deveListarTodasFornecedoras() throws Exception {
        fornecedoraRepository.save(fornecedoraTeste);
        
        Fornecedora outraFornecedora = new Fornecedora();
        outraFornecedora.setNome("Outra Fornecedora");
        outraFornecedora.setContato("11666666666");
        outraFornecedora.setEndereco("Outra Rua, 321");
        outraFornecedora.setDataNascimento(LocalDate.of(1995, 3, 10));
        outraFornecedora.setChavePix("outra@email.com");
        outraFornecedora.setCreditoLoja(BigDecimal.valueOf(150.00));
        fornecedoraRepository.save(outraFornecedora);

        mockMvc.perform(get("/api/fornecedoras"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nome", is("Fornecedora Teste")))
                .andExpect(jsonPath("$[1].nome", is("Outra Fornecedora")));
    }

    @Test
    void deveBuscarFornecedoraPorId() throws Exception {
        Fornecedora fornecedoraSalva = fornecedoraRepository.save(fornecedoraTeste);

        mockMvc.perform(get("/api/fornecedoras/{id}", fornecedoraSalva.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(fornecedoraSalva.getId().intValue())))
                .andExpect(jsonPath("$.nome", is("Fornecedora Teste")))
                .andExpect(jsonPath("$.contato", is("11999999999")));
    }

    @Test
    void deveRetornar404AoBuscarFornecedoraInexistente() throws Exception {
        mockMvc.perform(get("/api/fornecedoras/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveAtualizarFornecedora() throws Exception {
        Fornecedora fornecedoraSalva = fornecedoraRepository.save(fornecedoraTeste);

        FornecedoraCreateDTO dtoAtualizado = new FornecedoraCreateDTO();
        dtoAtualizado.setNome("Fornecedora Atualizada");
        dtoAtualizado.setContato("11555555555");
        dtoAtualizado.setEndereco("Rua Atualizada, 999");
        dtoAtualizado.setDataNascimento(LocalDate.of(1992, 6, 20));
        dtoAtualizado.setChavePix("atualizada@email.com");

        String fornecedoraJson = objectMapper.writeValueAsString(dtoAtualizado);

        mockMvc.perform(multipart("/api/fornecedoras/{id}", fornecedoraSalva.getId())
                .param("fornecedora", fornecedoraJson)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome", is("Fornecedora Atualizada")))
                .andExpect(jsonPath("$.contato", is("11555555555")));
    }

    @Test
    void deveRetornar404AoAtualizarFornecedoraInexistente() throws Exception {
        FornecedoraCreateDTO dto = new FornecedoraCreateDTO();
        dto.setNome("Teste");
        dto.setContato("11999999999");
        dto.setEndereco("Teste");
        dto.setDataNascimento(LocalDate.now());
        dto.setChavePix("teste@email.com");

        String fornecedoraJson = objectMapper.writeValueAsString(dto);

        mockMvc.perform(multipart("/api/fornecedoras/{id}", 999L)
                .param("fornecedora", fornecedoraJson)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveExcluirFornecedora() throws Exception {
        Fornecedora fornecedoraSalva = fornecedoraRepository.save(fornecedoraTeste);

        mockMvc.perform(delete("/api/fornecedoras/{id}", fornecedoraSalva.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/fornecedoras/{id}", fornecedoraSalva.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornar404AoExcluirFornecedoraInexistente() throws Exception {
        mockMvc.perform(delete("/api/fornecedoras/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornar400ComJsonInvalido() throws Exception {
        mockMvc.perform(multipart("/api/fornecedoras")
                .param("fornecedora", "json-invalido")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());
    }
}
