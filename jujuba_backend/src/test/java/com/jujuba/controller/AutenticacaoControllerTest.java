package com.jujuba.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.jujuba.dto.UsuarioLoginDTO;
import com.jujuba.exception.ErrorMessageException;
import com.jujuba.jwt.JwtToken;
import com.jujuba.jwt.JwtUserDetailsService;

import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
public class AutenticacaoControllerTest {

    @InjectMocks
    private AutenticacaoController controller;

    @Mock
    private JwtUserDetailsService detailsService;

    @Mock
    private AuthenticationManager authenticationManager;

     @Mock
    private HttpServletRequest httpServletRequest;

    private UsuarioLoginDTO validLoginDTO;
    private JwtToken mockToken;
    
    @BeforeEach
    void setup() {
        validLoginDTO = new UsuarioLoginDTO("usuario", "senha123");
        mockToken = new JwtToken("test-jwt-token");
    }

    @Test
    void autenticar_ComCredenciaisValidas_DeveRetornarToken() {
        when(detailsService.getTokenAuthenticated(validLoginDTO.getUsername()))
                .thenReturn(mockToken);

        ResponseEntity<?> response = controller.autenticar(validLoginDTO, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockToken, response.getBody());
    }

    @Test
    void autenticar_ComCredenciaisInvalidas_DeveRetornarBadRequest() {
        doThrow(new BadCredentialsException("Credenciais inválidas"))
                .when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        ResponseEntity<?> response = controller.autenticar(validLoginDTO, httpServletRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertInstanceOf(ErrorMessageException.class, response.getBody());
        ErrorMessageException error = (ErrorMessageException) response.getBody();
        assertEquals("Credenciais Inválidas", error.getMessage());
    }
}
