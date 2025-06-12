package com.jujuba.controller;

import com.jujuba.dto.UsuarioCreateDTO;
import com.jujuba.dto.UsuarioResponseDTO;
import com.jujuba.dto.UsuarioSenhaDTO;
import com.jujuba.utils.enums.*;
import com.jujuba.model.Usuario;
import com.jujuba.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioControllerTest {

    @InjectMocks
    private UsuarioController controller;

    @Mock
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setUsername("teste@teste.com");
        usuario.setPassword("a".repeat(50));
        usuario.setRole(Role.ROLE_USER);
    }

    @Test
    void deveCriarUsuarioComSucesso() {
        UsuarioCreateDTO dto = new UsuarioCreateDTO("teste@teste.com", "a".repeat(50));
        when(usuarioService.salvar(any(Usuario.class))).thenReturn(usuario);

        ResponseEntity<UsuarioResponseDTO> response = controller.create(dto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(dto.getUsername(), response.getBody().getUsername());
        assertEquals("USER", response.getBody().getRole());
    }

    @Test
    void deveRetornarUsuarioPorIdComSucesso() {
        when(usuarioService.buscarPorId(1L)).thenReturn(usuario);

        ResponseEntity<UsuarioResponseDTO> response = controller.getById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(usuario.getUsername(), response.getBody().getUsername());
        assertEquals("USER", response.getBody().getRole());
    }

    @Test
    void deveLancarExcecaoAoBuscarUsuarioInexistente() {
        when(usuarioService.buscarPorId(99L)).thenThrow(new RuntimeException("Usuário não encontrado"));

        Exception exception = assertThrows(RuntimeException.class, () -> controller.getById(99L));

        assertEquals("Usuário não encontrado", exception.getMessage());
    }

    @Test
    void deveAlterarSenhaComSucesso() {
        UsuarioSenhaDTO senhaDTO = new UsuarioSenhaDTO("a".repeat(50), "b".repeat(50), "b".repeat(50));
        when(usuarioService.editarSenha(1L, senhaDTO.getSenhaAtual(), senhaDTO.getNovaSenha(),
                senhaDTO.getConfirmaSenha()))
                .thenReturn(usuario);

        ResponseEntity<Void> response = controller.updatePassword(1L, senhaDTO);

        assertEquals(204, response.getStatusCodeValue());
        assertNull(response.getBody());
    }

    @Test
    void deveLancarExcecaoQuandoSenhasNaoConferem() {
        UsuarioSenhaDTO senhaDTO = new UsuarioSenhaDTO("a".repeat(50), "nova1", "nova2");

        when(usuarioService.editarSenha(1L, senhaDTO.getSenhaAtual(), senhaDTO.getNovaSenha(),
                senhaDTO.getConfirmaSenha()))
                .thenThrow(new IllegalArgumentException("Senhas não conferem"));

        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> controller.updatePassword(1L, senhaDTO));

        assertEquals("Senhas não conferem", exception.getMessage());
    }

    @Test
    void deveListarTodosUsuariosComSucesso() {
        when(usuarioService.buscarTodos()).thenReturn(List.of(usuario));

        ResponseEntity<List<UsuarioResponseDTO>> response = controller.getAll();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals("teste@teste.com", response.getBody().get(0).getUsername());
    }
}