package com.jujuba.controller;

import com.jujuba.model.Venda;
import com.jujuba.service.VendaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VendaControllerTest {

    private VendaService vendaService;
    private VendaController vendaController;

    @BeforeEach
    void setUp() {
        vendaService = mock(VendaService.class);
        vendaController = new VendaController(vendaService);
    }

    @Test
    void deveFinalizarVendaSimplesComSucesso() {
        Venda vendaMock = new Venda();
        when(vendaService.finalizarVendaSimples()).thenReturn(vendaMock);

        ResponseEntity<Venda> response = vendaController.finalizarVendaSimples();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(vendaMock, response.getBody());
        verify(vendaService).finalizarVendaSimples();
    }

    @Test
    void deveFinalizarVendaComFornecedoraComSucesso() {
        Long fornecedoraId = 1L;
        Venda vendaMock = new Venda();
        when(vendaService.finalizarVendaFornecedora(fornecedoraId)).thenReturn(vendaMock);

        ResponseEntity<Venda> response = vendaController.finalizarVendaFornecedora(fornecedoraId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(vendaMock, response.getBody());
        verify(vendaService).finalizarVendaFornecedora(fornecedoraId);
    }

    @Test
    void deveListarTodasVendasComSucesso() {
        List<Venda> vendas = Arrays.asList(new Venda(), new Venda());
        when(vendaService.listarTodas()).thenReturn(vendas);

        ResponseEntity<List<Venda>> response = vendaController.listarTodasVendas();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(vendaService).listarTodas();
    }

    @Test
    void deveBuscarVendaPorIdComSucesso() {
        Long id = 1L;
        Venda vendaMock = new Venda();
        when(vendaService.buscarPorId(id)).thenReturn(vendaMock);

        ResponseEntity<Venda> response = vendaController.buscarVendaPorId(id);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(vendaMock, response.getBody());
        verify(vendaService).buscarPorId(id);
    }

    @Test
    void deveRetornarErroAoFinalizarVendaSimples() {
        when(vendaService.finalizarVendaSimples()).thenThrow(new RuntimeException("Erro interno"));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            vendaController.finalizarVendaSimples();
        });

        assertEquals("Erro interno", ex.getMessage());
        verify(vendaService).finalizarVendaSimples();
    }

    @Test
    void deveRetornarErroAoFinalizarVendaComFornecedora() {
        Long fornecedoraId = 1L;
        when(vendaService.finalizarVendaFornecedora(fornecedoraId))
                .thenThrow(new IllegalArgumentException("Fornecedora não encontrada"));

        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            vendaController.finalizarVendaFornecedora(fornecedoraId);
        });

        assertEquals("Fornecedora não encontrada", ex.getMessage());
        verify(vendaService).finalizarVendaFornecedora(fornecedoraId);
    }

    @Test
    void deveRetornarErroAoBuscarVendaPorId() {
        Long id = 99L;
        when(vendaService.buscarPorId(id)).thenThrow(new RuntimeException("Venda não encontrada"));

        Exception ex = assertThrows(RuntimeException.class, () -> {
            vendaController.buscarVendaPorId(id);
        });

        assertEquals("Venda não encontrada", ex.getMessage());
        verify(vendaService).buscarPorId(id);
    }

    @Test
    void deveRetornarListaVaziaQuandoNaoExistemVendas() {
        when(vendaService.listarTodas()).thenReturn(List.of());

        ResponseEntity<List<Venda>> response = vendaController.listarTodasVendas();

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
        verify(vendaService).listarTodas();
    }
}