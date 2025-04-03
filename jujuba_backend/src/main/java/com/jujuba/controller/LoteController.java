package com.jujuba.controller;

import com.jujuba.model.Lote;
import com.jujuba.service.LoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/lotes")
@RequiredArgsConstructor
@Tag(name = "Lotes", description = "API para gerenciamento de lotes")
public class LoteController {

    private final LoteService loteService;

    @Operation(summary = "Cria um novo lote", description = "Cadastra um novo lote no sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lote criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro na requisição - dados inválidos"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @PostMapping
    public ResponseEntity<Lote> criar(@RequestBody Lote lote) {
        try {
            Lote novoLote = loteService.salvar(lote);
            return ResponseEntity.ok(novoLote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Operation(summary = "Lista todos os lotes", description = "Retorna uma lista de todos os lotes cadastrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @GetMapping
    public ResponseEntity<List<Lote>> listarTodos() {
        try {
            List<Lote> lotes = loteService.listarTodos();
            return ResponseEntity.ok(lotes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Busca um lote por ID", description = "Retorna os detalhes de um lote específico com base no ID informado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lote encontrado"),
        @ApiResponse(responseCode = "404", description = "Lote não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Lote> buscarPorId(@PathVariable Long id) {
        try {
            Lote lote = loteService.buscarPorId(id);
            return ResponseEntity.ok(lote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Atualiza um lote", description = "Atualiza os dados de um lote existente com base no ID informado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lote atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro na requisição - dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Lote não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Lote> atualizar(@PathVariable Long id, @RequestBody Lote lote) {
        try {
            Lote loteAtualizado = loteService.atualizar(id, lote);
            return ResponseEntity.ok(loteAtualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Operation(summary = "Deleta um lote", description = "Remove um lote do sistema com base no ID informado.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Lote excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Lote não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            loteService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}