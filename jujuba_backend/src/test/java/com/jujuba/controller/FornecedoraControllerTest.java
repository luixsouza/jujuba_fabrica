package com.jujuba.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.dto.FornecedoraResponseDTO;
import com.jujuba.mapper.FornecedoraMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.service.ArquivoService;
import com.jujuba.service.FornecedoraService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FornecedoraControllerTest {

    @Mock
    private FornecedoraService fornecedoraService;

    @Mock
    private ArquivoService arquivoService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private FornecedoraController fornecedoraController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCadastrarFornecedora_Success() throws IOException {

        FornecedoraCreateDTO createDTO = new FornecedoraCreateDTO();
        createDTO.setNome("Fornecedora Teste");

        Fornecedora fornecedora = FornecedoraMapper.toFornecedora(createDTO);
        fornecedora.setId(1L);

        when(objectMapper.readValue(anyString(), eq(FornecedoraCreateDTO.class))).thenReturn(createDTO);
        when(fornecedoraService.salvar(any(Fornecedora.class))).thenReturn(fornecedora);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.cadastrarFornecedora(
                "{\"nome\":\"Fornecedora Teste\"}", null);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Fornecedora Teste", response.getBody().getNome());
        verify(fornecedoraService, times(1)).salvar(any(Fornecedora.class));
    }

    @Test
    void testListarFornecedoras() {

        Fornecedora fornecedora = new Fornecedora();
        fornecedora.setId(1L);
        fornecedora.setNome("Fornecedora Teste");

        when(fornecedoraService.listarTodas()).thenReturn(Collections.singletonList(fornecedora));

        ResponseEntity<List<FornecedoraResponseDTO>> response = fornecedoraController.listarFornecedoras();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getId());
        assertEquals("Fornecedora Teste", response.getBody().get(0).getNome());
        verify(fornecedoraService, times(1)).listarTodas();
    }

    @Test
    void testBuscarPorId_Exists() {

        Fornecedora fornecedora = new Fornecedora();
        fornecedora.setId(1L);
        fornecedora.setNome("Fornecedora Teste");

        when(fornecedoraService.buscarPorId(1L)).thenReturn(fornecedora);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.buscarPorId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Fornecedora Teste", response.getBody().getNome());
        verify(fornecedoraService, times(1)).buscarPorId(1L);
    }

    @Test
    void testBuscarPorId_NotFound() {

        when(fornecedoraService.buscarPorId(1L)).thenReturn(null);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.buscarPorId(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(fornecedoraService, times(1)).buscarPorId(1L);
    }

    @Test
    void testAtualizarFornecedora_Success() throws IOException {

        FornecedoraCreateDTO createDTO = new FornecedoraCreateDTO();
        createDTO.setNome("Fornecedora Atualizada");

        Fornecedora fornecedora = new Fornecedora();
        fornecedora.setId(1L);
        fornecedora.setNome("Fornecedora Atualizada");

        when(objectMapper.readValue(anyString(), eq(FornecedoraCreateDTO.class))).thenReturn(createDTO);
        when(fornecedoraService.atualizar(eq(1L), any(Fornecedora.class))).thenReturn(fornecedora);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.atualizarFornecedora(
                1L, "{\"nome\":\"Fornecedora Atualizada\"}", null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Fornecedora Atualizada", response.getBody().getNome());
        verify(fornecedoraService, times(1)).atualizar(eq(1L), any(Fornecedora.class));
    }

    @Test
    void testAtualizarFornecedora_NotFound() throws IOException {

        FornecedoraCreateDTO createDTO = new FornecedoraCreateDTO();
        createDTO.setNome("Fornecedora Atualizada");

        when(objectMapper.readValue(anyString(), eq(FornecedoraCreateDTO.class))).thenReturn(createDTO);
        when(fornecedoraService.atualizar(eq(1L), any(Fornecedora.class))).thenReturn(null);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.atualizarFornecedora(
                1L, "{\"nome\":\"Fornecedora Atualizada\"}", null);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(fornecedoraService, times(1)).atualizar(eq(1L), any(Fornecedora.class));
    }

    @Test
    void testExcluirFornecedora() {

        doNothing().when(fornecedoraService).excluir(1L);

        ResponseEntity<Void> response = fornecedoraController.excluirFornecedora(1L);
        
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(fornecedoraService, times(1)).excluir(1L);
    }
}