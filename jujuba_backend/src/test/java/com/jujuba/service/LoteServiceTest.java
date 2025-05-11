package com.jujuba.service;

import com.jujuba.model.Fornecedora;
import com.jujuba.model.Lote;
import com.jujuba.model.Produto;
import com.jujuba.repository.FornecedoraRepository;
import com.jujuba.repository.LoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoteServiceTest {

    @InjectMocks
    private LoteService loteService;

    @Mock
    private LoteRepository loteRepository;

    @Mock
    private FornecedoraRepository fornecedoraRepository;

    private Lote lote;
    private Fornecedora fornecedora;
    private Produto produto;

    @BeforeEach
    void setUp() {
        fornecedora = new Fornecedora();
        fornecedora.setId(1L);
        fornecedora.setNome("Fornecedora Teste");

        lote = new Lote();
        lote.setId(1L);
        lote.setFornecedora(fornecedora);

        produto = new Produto();
        produto.setId(1L);
        produto.setDescricao("Produto Teste");
        produto.setLote(lote);

        lote.setProdutos(Collections.singletonList(produto));
    }

    @Test
    void salvar_DeverSalvarComProdutos() {
        when(fornecedoraRepository.findById(fornecedora.getId())).thenReturn(Optional.of(fornecedora));
        when(loteRepository.save(any(Lote.class))).thenReturn(lote);

        Lote salvo = loteService.salvar(lote);

        assertNotNull(salvo);
        verify(loteRepository).save(lote);
    }

    @Test
    void salvar_QuandoFornecedorNaoExistir_LancarExcecao() {
        when(fornecedoraRepository.findById(fornecedora.getId())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> loteService.salvar(lote));
    }

    @Test
    void listarTodos_DeveRetornarListaLotes() {
        when(loteRepository.findAll()).thenReturn(Collections.singletonList(lote));

        var lotes = loteService.listarTodos();

        assertEquals(1, lotes.size());
        assertEquals(lote.getId(), lotes.get(0).getId());
    }

    @Test
    void buscarPorId_QuandoExistir_DeveRetornarLote() {
        when(loteRepository.findById(lote.getId())).thenReturn(Optional.of(lote));

        var encontrado = loteService.buscarPorId(lote.getId());

        assertNotNull(encontrado);
        assertEquals(lote.getId(), encontrado.getId());
    }

    @Test
    void buscarPorId_QuandoNaoExistir_DevelancarExcecao() {
        when(loteRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> loteService.buscarPorId(1L));
    }

    @Test
    void atualizar_DeveAtualizarLoteComSucesso() {
        when(loteRepository.findById(lote.getId())).thenReturn(Optional.of(lote));
        when(fornecedoraRepository.findById(fornecedora.getId())).thenReturn(Optional.of(fornecedora));
        when(loteRepository.save(any(Lote.class))).thenReturn(lote);

        Lote atualizado = loteService.atualizar(lote.getId(), lote);

        assertNotNull(atualizado);
        verify(loteRepository).save(lote);
    }

    @Test
    void deletar_DeveExcluirLote() {
        when(loteRepository.findById(lote.getId())).thenReturn(Optional.of(lote));

        loteService.deletar(lote.getId());

        verify(loteRepository).delete(lote);
    }
}