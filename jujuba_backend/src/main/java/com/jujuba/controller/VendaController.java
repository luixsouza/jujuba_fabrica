package com.jujuba.controller;

import com.jujuba.model.Venda;
import com.jujuba.service.VendaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
@RequiredArgsConstructor
@Tag(name = "Vendas", description = "API para gerenciamento de Vendas")
public class VendaController {

    private final VendaService vendaService;

    @Operation(summary = "Finaliza uma venda simples")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Venda finalizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou produto indisponível"),
        @ApiResponse(responseCode = "404", description = "Produto ou venda não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @PostMapping("/finalizar/simples")
    public ResponseEntity<Venda> finalizarVendaSimples(
            @RequestParam(required = false) String nomeCliente) {
        return ResponseEntity.ok(vendaService.finalizarVendaSimples(nomeCliente));
    }

    // Método overloaded para compatibilidade com testes
    public ResponseEntity<Venda> finalizarVendaSimples() {
        return finalizarVendaSimples(null);
    }

    @Operation(summary = "Finaliza uma venda com fornecedora")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Venda com fornecedora finalizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou produto indisponível"),
        @ApiResponse(responseCode = "404", description = "Fornecedora ou produto não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @PostMapping("/finalizar/fornecedora/{fornecedoraId}")
    public ResponseEntity<Venda> finalizarVendaFornecedora(@PathVariable Long fornecedoraId) {
        return ResponseEntity.ok(vendaService.finalizarVendaFornecedora(fornecedoraId));
    }

    @Operation(summary = "Lista todas as vendas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de vendas recuperada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @GetMapping
    public ResponseEntity<List<Venda>> listarTodasVendas() {
        return ResponseEntity.ok(vendaService.listarTodas());
    }

    @Operation(summary = "Busca uma venda por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Venda encontrada"),
        @ApiResponse(responseCode = "404", description = "Venda não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Venda> buscarVendaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vendaService.buscarPorId(id));
    }
}