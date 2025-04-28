package com.jujuba.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class ArquivoServiceTest {

    @InjectMocks
    ArquivoService subject;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void salvarArquivo_SuccessTest() throws IOException {
        MultipartFile fileMock = Mockito.mock(MultipartFile.class);
        byte[] conteudo = "conteudo de teste".getBytes();
        String fileName = "arquivoTeste.txt";

        when(fileMock.getOriginalFilename()).thenReturn(fileName);
        when(fileMock.getBytes()).thenReturn(conteudo);

        String resultado = subject.salvarContrato(fileMock);

        assertEquals(fileName, resultado.substring(resultado.lastIndexOf("_") + 1));
    }

    @Test
    void salvarImagem_SuccessTest() throws IOException {
        MultipartFile fileMock = Mockito.mock(MultipartFile.class);
        byte[] conteudo = "conteudo de teste".getBytes();
        String fileName = "arquivoTeste.txt";

        when(fileMock.getOriginalFilename()).thenReturn(fileName);
        when(fileMock.getBytes()).thenReturn(conteudo);

        String resultado = subject.salvarImagem(fileMock);

        assertEquals(fileName, resultado.substring(resultado.lastIndexOf("_") + 1));
    }

    @Test
    public void shouldThrowExceptionWhenPerformNegativeBid() {
        MultipartFile fileMock = Mockito.mock(MultipartFile.class);

        IOException result = assertThrows(IOException.class, () -> subject.salvarContrato(fileMock));
        assertTrue(result.getMessage().contains("Arquivo inválido."));
    }
}
