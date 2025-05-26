package com.jujuba.controller;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Lote;
import com.jujuba.service.LoteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoteControllerTest {

    @Mock
    private LoteService loteService;

    @InjectMocks
    private LoteController loteController;

    private Lote lote;
    private Fornecedora fornecedora;
    private List<Lote> lotes;

    @BeforeEach
    void setUp() {
        // Configurando objetos para teste
        fornecedora = new Fornecedora();
        fornecedora.setId(1L);
        
        lote = new Lote();
        lote.setId(1L);
        lote.setDataCriacao(LocalDateTime.now());
        lote.setFornecedora(fornecedora);
        lote.setProdutos(new ArrayList<>());
        
        Lote lote2 = new Lote();
        lote2.setId(2L);
        lote2.setDataCriacao(LocalDateTime.now());
        lote2.setFornecedora(fornecedora);
        lote2.setProdutos(new ArrayList<>());
        
        lotes = Arrays.asList(lote, lote2);
    }

    @Test
    @DisplayName("Deve criar um lote com sucesso")
    void deveCriarLoteComSucesso() {
        // Arrange
        when(loteService.salvar(any(Lote.class))).thenReturn(lote);

        // Act
        ResponseEntity<Lote> response = loteController.criar(lote);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(loteService, times(1)).salvar(any(Lote.class));
    }

    @Test
    @DisplayName("Deve retornar bad request ao tentar criar lote com erro")
    void deveRetornarBadRequestAoTentarCriarLoteComErro() {
        // Arrange
        when(loteService.salvar(any(Lote.class))).thenThrow(new RuntimeException("Erro ao salvar"));

        // Act
        ResponseEntity<Lote> response = loteController.criar(lote);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
        verify(loteService, times(1)).salvar(any(Lote.class));
    }

    @Test
    @DisplayName("Deve listar todos os lotes com sucesso")
    void deveListarTodosLotesComSucesso() {
        // Arrange
        when(loteService.listarTodos()).thenReturn(lotes);

        // Act
        ResponseEntity<List<Lote>> response = loteController.listarTodos();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(loteService, times(1)).listarTodos();
    }

    @Test
    @DisplayName("Deve retornar internal server error ao listar lotes com erro")
    void deveRetornarInternalServerErrorAoListarLotesComErro() {
        // Arrange
        when(loteService.listarTodos()).thenThrow(new RuntimeException("Erro ao listar"));

        // Act
        ResponseEntity<List<Lote>> response = loteController.listarTodos();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
        verify(loteService, times(1)).listarTodos();
    }

    @Test
    @DisplayName("Deve buscar lote por id com sucesso")
    void deveBuscarLotePorIdComSucesso() {
        // Arrange
        when(loteService.buscarPorId(anyLong())).thenReturn(lote);

        // Act
        ResponseEntity<Lote> response = loteController.buscarPorId(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(loteService, times(1)).buscarPorId(1L);
    }

    @Test
    @DisplayName("Deve retornar not found ao buscar lote inexistente")
    void deveRetornarNotFoundAoBuscarLoteInexistente() {
        // Arrange
        when(loteService.buscarPorId(anyLong())).thenThrow(new RuntimeException("Lote não encontrado"));

        // Act
        ResponseEntity<Lote> response = loteController.buscarPorId(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(loteService, times(1)).buscarPorId(999L);
    }

    @Test
    @DisplayName("Deve atualizar lote com sucesso")
    void deveAtualizarLoteComSucesso() {
        // Arrange
        Lote loteAtualizado = new Lote();
        loteAtualizado.setId(1L);
        loteAtualizado.setDataCriacao(LocalDateTime.now());
        loteAtualizado.setFornecedora(fornecedora);
        
        when(loteService.atualizar(anyLong(), any(Lote.class))).thenReturn(loteAtualizado);

        // Act
        ResponseEntity<Lote> response = loteController.atualizar(1L, lote);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(loteService, times(1)).atualizar(eq(1L), any(Lote.class));
    }

    @Test
    @DisplayName("Deve retornar bad request ao atualizar lote com erro")
    void deveRetornarBadRequestAoAtualizarLoteComErro() {
        // Arrange
        when(loteService.atualizar(anyLong(), any(Lote.class))).thenThrow(new RuntimeException("Erro ao atualizar"));

        // Act
        ResponseEntity<Lote> response = loteController.atualizar(1L, lote);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
        verify(loteService, times(1)).atualizar(eq(1L), any(Lote.class));
    }

    @Test
    @DisplayName("Deve deletar lote com sucesso")
    void deveDeletarLoteComSucesso() {
        // Arrange
        doNothing().when(loteService).deletar(anyLong());

        // Act
        ResponseEntity<Void> response = loteController.deletar(1L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(loteService, times(1)).deletar(1L);
    }

    @Test
    @DisplayName("Deve retornar not found ao deletar lote inexistente")
    void deveRetornarNotFoundAoDeletarLoteInexistente() {
        // Arrange
        doThrow(new RuntimeException("Lote não encontrado")).when(loteService).deletar(anyLong());

        // Act
        ResponseEntity<Void> response = loteController.deletar(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(loteService, times(1)).deletar(999L);
    }
}
