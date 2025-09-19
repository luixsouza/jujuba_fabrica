package com.jujuba.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.dto.FornecedoraResponseDTO;
import com.jujuba.exception.FornecedoraNotFoundException;
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

    @Operation(summary = "Cadastra uma nova fornecedora")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Fornecedora cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição")
    })
    @PostMapping
    public ResponseEntity<FornecedoraResponseDTO> cadastrarFornecedora(
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) {
        try {
            FornecedoraCreateDTO dto = objectMapper.readValue(fornecedoraJson, FornecedoraCreateDTO.class);
            Fornecedora fornecedora = FornecedoraMapper.toFornecedora(dto);

            if (contrato != null && !contrato.isEmpty()) {
                String contratoUrl = arquivoService.salvarContrato(contrato);
                fornecedora.setContratoUrl(contratoUrl);
            }

            Fornecedora fornecedoraSalva = fornecedoraService.salvar(fornecedora);
            return ResponseEntity.status(HttpStatus.CREATED).body(FornecedoraMapper.toDTO(fornecedoraSalva));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Operation(summary = "Atualiza uma fornecedora")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fornecedora atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Fornecedora não encontrada"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição")
    })
    @PutMapping("/{id}")
    public ResponseEntity<FornecedoraResponseDTO> atualizarFornecedora(
            @PathVariable Long id,
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) {
        try {
            Fornecedora fornecedoraExistente = fornecedoraService.buscarPorId(id);
            FornecedoraCreateDTO dto = objectMapper.readValue(fornecedoraJson, FornecedoraCreateDTO.class);

            String contratoUrl = fornecedoraExistente.getContratoUrl();
            if (contrato != null && !contrato.isEmpty()) {
                contratoUrl = arquivoService.salvarContrato(contrato);
            }

            Fornecedora fornecedoraAtualizada = fornecedoraService.atualizar(id, dto, contratoUrl);
            return ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedoraAtualizada));
        } catch (FornecedoraNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Operation(summary = "Lista todas as fornecedoras")
    @GetMapping
    public ResponseEntity<List<FornecedoraResponseDTO>> listarFornecedoras() {
        List<FornecedoraResponseDTO> lista = fornecedoraService.listarTodas().stream()
                .map(FornecedoraMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @Operation(summary = "Busca fornecedora por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fornecedora encontrada"),
            @ApiResponse(responseCode = "404", description = "Fornecedora não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<FornecedoraResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            Fornecedora fornecedora = fornecedoraService.buscarPorId(id);
            return ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedora));
        } catch (FornecedoraNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Exclui uma fornecedora")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Fornecedora excluída com sucesso"),
            @ApiResponse(responseCode = "404", description = "Fornecedora não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirFornecedora(@PathVariable Long id) {
        try {
            fornecedoraService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (FornecedoraNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}