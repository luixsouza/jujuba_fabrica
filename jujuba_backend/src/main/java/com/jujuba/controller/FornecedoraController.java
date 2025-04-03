package com.jujuba.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.dto.FornecedoraResponseDTO;
import com.jujuba.mapper.FornecedoraMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.service.ArquivoService;
import com.jujuba.service.FornecedoraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/fornecedoras")
@RequiredArgsConstructor
@Tag(name = "Fornecedoras", description = "API para gerenciamento de fornecedoras")
public class FornecedoraController {

    private final ObjectMapper objectMapper;
    private final FornecedoraService fornecedoraService;
    private final ArquivoService arquivoService;

    @Operation(summary = "Cadastra uma nova fornecedora", description = "Permite cadastrar uma nova fornecedora e opcionalmente enviar um contrato.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Fornecedora cadastrada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro na requisição - dados inválidos"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @PostMapping
    public ResponseEntity<FornecedoraResponseDTO> cadastrarFornecedora(
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) throws IOException {
        try {
            FornecedoraCreateDTO dto = objectMapper.readValue(fornecedoraJson, FornecedoraCreateDTO.class);
            Fornecedora fornecedora = FornecedoraMapper.toFornecedora(dto);
            Fornecedora fornecedoraSalva = fornecedoraService.salvar(fornecedora);

            if (contrato != null && !contrato.isEmpty()) {
                String contratoUrl = arquivoService.salvarContrato(contrato);
                fornecedoraSalva.setContratoUrl(contratoUrl);
                fornecedoraSalva = fornecedoraService.salvar(fornecedoraSalva);
            }
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(FornecedoraMapper.toDTO(fornecedoraSalva));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Lista todas as fornecedoras", description = "Retorna uma lista de todas as fornecedoras cadastradas.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @GetMapping
    public ResponseEntity<List<FornecedoraResponseDTO>> listarFornecedoras() {
        try {
            List<FornecedoraResponseDTO> lista = fornecedoraService.listarTodas().stream()
                    .map(FornecedoraMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Busca fornecedora por ID", description = "Retorna os dados de uma fornecedora específica com base no ID informado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Fornecedora encontrada"),
        @ApiResponse(responseCode = "404", description = "Fornecedora não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<FornecedoraResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            Fornecedora fornecedora = fornecedoraService.buscarPorId(id);
            return ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedora));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Exclui uma fornecedora", description = "Remove uma fornecedora do sistema com base no ID informado.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Fornecedora excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Fornecedora não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirFornecedora(@PathVariable Long id) {
        try {
            fornecedoraService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}