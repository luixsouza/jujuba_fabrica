package com.jujuba.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.dto.FornecedoraResponseDTO;
import com.jujuba.exception.FornecedoraNotFoundException;
import com.jujuba.model.Fornecedora;
import com.jujuba.service.ArquivoService;
import com.jujuba.service.FornecedoraService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FornecedoraControllerTest {

    @Mock
    private FornecedoraService fornecedoraService;

    @Mock
    private ArquivoService arquivoService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private FornecedoraController fornecedoraController;

    private Fornecedora fornecedora;
    private FornecedoraCreateDTO createDTO;
    private FornecedoraResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        fornecedora = new Fornecedora();
        fornecedora.setId(1L);
        fornecedora.setNome("Fornecedora Teste");

        createDTO = new FornecedoraCreateDTO();
        createDTO.setNome("Fornecedora Teste");

        responseDTO = new FornecedoraResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setNome("Fornecedora Teste");
    }

    @Test
    void cadastrarFornecedora_Success() throws IOException {
        when(objectMapper.readValue(anyString(), eq(FornecedoraCreateDTO.class))).thenReturn(createDTO);
        when(fornecedoraService.salvar(any(Fornecedora.class))).thenReturn(fornecedora);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.cadastrarFornecedora(
                "{\"nome\":\"Fornecedora Teste\"}", null);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(fornecedoraService, times(1)).salvar(any(Fornecedora.class));
    }

    @Test
    void cadastrarFornecedora_WithContrato() throws IOException {
        when(objectMapper.readValue(anyString(), eq(FornecedoraCreateDTO.class))).thenReturn(createDTO);
        when(fornecedoraService.salvar(any(Fornecedora.class))).thenReturn(fornecedora);
        when(arquivoService.salvarContrato(any(MultipartFile.class))).thenReturn("http://contrato.url");
        when(multipartFile.isEmpty()).thenReturn(false);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.cadastrarFornecedora(
                "{\"nome\":\"Fornecedora Teste\"}", multipartFile);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(arquivoService, times(1)).salvarContrato(any(MultipartFile.class));
        verify(fornecedoraService, times(1)).salvar(any(Fornecedora.class));
    }

    @Test
    void cadastrarFornecedora_InvalidJson() throws IOException {
        when(objectMapper.readValue(anyString(), eq(FornecedoraCreateDTO.class)))
                .thenThrow(new JsonProcessingException("Invalid JSON") {});

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.cadastrarFornecedora(
                "invalid json", null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void listarFornecedoras_Success() {
        when(fornecedoraService.listarTodas()).thenReturn(Collections.singletonList(fornecedora));

        ResponseEntity<List<FornecedoraResponseDTO>> response = fornecedoraController.listarFornecedoras();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(fornecedoraService, times(1)).listarTodas();
    }

    @Test
    void listarFornecedoras_EmptyList() {
        when(fornecedoraService.listarTodas()).thenReturn(Collections.emptyList());

        ResponseEntity<List<FornecedoraResponseDTO>> response = fornecedoraController.listarFornecedoras();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void buscarPorId_Success() {
        when(fornecedoraService.buscarPorId(1L)).thenReturn(fornecedora);

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.buscarPorId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(fornecedoraService, times(1)).buscarPorId(1L);
    }

    @Test
    void buscarPorId_NotFound() {
        when(fornecedoraService.buscarPorId(1L))
                .thenThrow(new FornecedoraNotFoundException("Fornecedora não encontrada"));

        ResponseEntity<FornecedoraResponseDTO> response = fornecedoraController.buscarPorId(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void excluirFornecedora_Success() {
        doNothing().when(fornecedoraService).excluir(1L);

        ResponseEntity<Void> response = fornecedoraController.excluirFornecedora(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(fornecedoraService, times(1)).excluir(1L);
    }

    @Test
    void excluirFornecedora_NotFound() {
        doThrow(new FornecedoraNotFoundException("Fornecedora não encontrada"))
                .when(fornecedoraService).excluir(1L);

        ResponseEntity<Void> response = fornecedoraController.excluirFornecedora(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}