package com.jujuba.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.jujuba.exception.PasswordInvalidException;
import com.jujuba.exception.UsernameUniqueViolationException;
import com.jujuba.model.Usuario;
import com.jujuba.repository.UsuarioRepository;
import com.jujuba.utils.enums.Role;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @InjectMocks
    private UsuarioService usuarioService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private Usuario usuario;

    @BeforeEach
    void setup() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setUsername("testeuser");
        usuario.setPassword("senha123");
    }

    @Test
    void salvar_DeveSalvarUsuarioComSenhaCriptografada() {
        when(passwordEncoder.encode("senha123")).thenReturn("senhaCriptografada");
        when(usuarioRepository.save(usuario)).thenReturn(usuario);

        Usuario salvo = usuarioService.salvar(usuario);

        assertEquals(usuario, salvo);
        verify(passwordEncoder).encode("senha123");
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void salvar_DeveLancarExcessaoQuandoUsernameDuplicado() {
        when(passwordEncoder.encode("senha123")).thenReturn("senhaCriptografada");
        when(usuarioRepository.save(usuario)).thenThrow(DataIntegrityViolationException.class);

        UsernameUniqueViolationException ex = assertThrows(
                UsernameUniqueViolationException.class, () -> usuarioService.salvar(usuario));

        assertTrue(ex.getMessage().contains("Username 'testeuser' já cadastrado"));
    }

    @Test
    void buscarPorId_DeveRetornarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario encontrado = usuarioService.buscarPorId(1L);

        assertEquals(usuario, encontrado);
    }

    @Test
    void buscarPorId_DeveLacarExcecaoSeNaoEncontro() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> usuarioService.buscarPorId(1L));
    }

    @Test
    void editarSenha_DeveAlterarSenhaComSucesso() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha123", "senha123")).thenReturn(true);
        when(passwordEncoder.encode("novaSenha")).thenReturn("novaSenhaCriptografada");

        Usuario atualizado = usuarioService.editarSenha(1L, "senha123", "novaSenha", "novaSenha");

        assertEquals("novaSenhaCriptografada", atualizado.getPassword());
    }

    @Test
    void editarSenha_DeveLancharExcecaoSeConfirmacaoDiferente() {
        assertThrows(PasswordInvalidException.class,
                () -> usuarioService.editarSenha(1L, "senha123", "novaSenha", "SenhaErrada"));
    }

    @Test
    void editarSenha_DeveLancharExcecaoSeSenhaAtualErrada() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtualErrada", "senha123")).thenReturn(false);

        assertThrows(PasswordInvalidException.class,
                () -> usuarioService.editarSenha(1L, "senhaAtualErrada", "novaSenha", "novaSenha"));
    }

    @Test
    void buscarTodos_DeveRetornarListaUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Collections.singletonList(usuario));

        List<Usuario> usuarios = usuarioService.buscarTodos();

        assertEquals(1, usuarios.size());
        assertEquals(usuario, usuarios.get(0));
    }

    @Test
    void buscarPorUsername_DeveRetornarUsuario() {
        when(usuarioRepository.findByUsername("testeuser")).thenReturn(Optional.of(usuario));

        Usuario encotrado = usuarioService.buscarPorUsername("testeuser");

        assertEquals(usuario, encotrado);
    }

    @Test
    void buscarPorUsername_DeveLancarExcecaoSeNaoEncontrado() {
        when(usuarioRepository.findByUsername("testeuser")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> usuarioService.buscarPorUsername("testeuser"));
    }

    @Test
    void buscarPorRoleUsername_DeveRetornarRole() {
        when(usuarioRepository.findRoleByUsername("testeuser")).thenReturn(Role.ROLE_ADMIN);

        Role role = usuarioService.buscarRolePorUsername("testeuser");

        assertEquals(Role.ROLE_ADMIN, role);
    }
}
