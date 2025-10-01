package com.jujuba.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.exception.FornecedoraNotFoundException;
import com.jujuba.exception.InvalidDataException;
import com.jujuba.model.Fornecedora;
import com.jujuba.repository.FornecedoraRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FornecedoraServiceTest {

    @InjectMocks
    private FornecedoraService fornecedoraService;

    @Mock
    private FornecedoraRepository fornecedoraRepository;

    private Fornecedora fornecedora;
    private FornecedoraCreateDTO fornecedoraDTO;

    @BeforeEach
    void setUp() {
        fornecedora = new Fornecedora();
        fornecedora.setId(1L);
        fornecedora.setNome("Fornecedor Teste");
        
        fornecedoraDTO = new FornecedoraCreateDTO();
        fornecedoraDTO.setNome("Fornecedor Teste Atualizado");
        fornecedoraDTO.setContato("11999999999");
        fornecedoraDTO.setEndereco("Endereço Teste");
        fornecedoraDTO.setChavePix("chave@teste.com");
        fornecedoraDTO.setDataNascimento(LocalDate.of(1990, 1, 1));
        fornecedoraDTO.setCreditoLoja(BigDecimal.valueOf(100.0));
    }

    @Test
    void listarTodas_DeveRetornarListaDeFornecedoras() {
        when(fornecedoraRepository.findAll()).thenReturn(Arrays.asList(fornecedora));

        List<Fornecedora> lista = fornecedoraService.listarTodas();

        assertEquals(1, lista.size());
        assertEquals("Fornecedor Teste", lista.get(0).getNome());
    }

    @Test
    void Salvar_ComoNomeValido_DeveSalvar() {
        when(fornecedoraRepository.save(fornecedora)).thenReturn(fornecedora);

        Fornecedora fornecedoraSalva = fornecedoraService.salvar(fornecedora);

        assertNotNull(fornecedoraSalva);
    }

    @Test
    void salvar_ComNomeNulo_DeveLancarExcecao() {
        fornecedora.setNome(null);

        assertThrows(InvalidDataException.class, () -> fornecedoraService.salvar(fornecedora));
    }

    @Test
    void atualizar_ComIdExistente_DeveAtualizar() {
        when(fornecedoraRepository.findById(1L)).thenReturn(Optional.of(fornecedora));
        when(fornecedoraRepository.save(any(Fornecedora.class))).thenReturn(fornecedora);

        Fornecedora atualizada = fornecedoraService.atualizar(1L, fornecedoraDTO, "contrato-url.pdf");

        assertNotNull(atualizada);
        assertEquals(1L, atualizada.getId());
        verify(fornecedoraRepository).findById(1L);
        verify(fornecedoraRepository).save(any(Fornecedora.class));
    }

    @Test
    void atualizar_ComIdInexistente_DeveLancarExcecao() {
        when(fornecedoraRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FornecedoraNotFoundException.class, () -> fornecedoraService.atualizar(1L, fornecedoraDTO, "contrato-url.pdf"));
    }

    @Test
    void excluir_ComIdExistente_DeveExcluir() {
        when(fornecedoraRepository.existsById(1L)).thenReturn(true);
        doNothing().when(fornecedoraRepository).deleteById(1L);

        assertDoesNotThrow(() -> fornecedoraService.excluir(1L));
    }

    @Test
    void excluir_ComIdInexistente_DeveLancarExcecao() {
        when(fornecedoraRepository.existsById(1L)).thenReturn(false);

        assertThrows(FornecedoraNotFoundException.class, () -> fornecedoraService.excluir(1L));
    }

    @Test
    void buscarPorId_ComIdExistente_DeveRetornarFornecedora() {
        when(fornecedoraRepository.findById(1L)).thenReturn(Optional.of(fornecedora));

        Fornecedora encontrada = fornecedoraService.buscarPorId(1L);

        assertNotNull(encontrada);
        assertEquals(1L, encontrada.getId());
    }

    @Test
    void buscarPorId_ComIdInexistente_DeveLancarExcecao() {
        when(fornecedoraRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FornecedoraNotFoundException.class, () -> fornecedoraService.buscarPorId(1L));
    }
}
