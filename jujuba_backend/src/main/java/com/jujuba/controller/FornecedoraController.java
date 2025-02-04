package com.jujuba.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.dto.FornecedoraResponseDTO;
import com.jujuba.mapper.FornecedoraMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.service.ArquivoService;
import com.jujuba.service.FornecedoraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/fornecedoras")
public class FornecedoraController {
    
    private FornecedoraService fornecedoraService;
    private ArquivoService arquivoService;
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<FornecedoraResponseDTO> cadastrarFornecedora(
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) {
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<FornecedoraResponseDTO>> listarFornecedoras() {
        List<FornecedoraResponseDTO> lista = fornecedoraService.listarTodas().stream()
                .map(FornecedoraMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedoraResponseDTO> buscarPorId(@PathVariable Long id) {
        Fornecedora fornecedora = fornecedoraService.buscarPorId(id);
        return fornecedora != null
                ? ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedora))
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedoraResponseDTO> atualizarFornecedora(
            @PathVariable Long id,
            @Valid @RequestBody FornecedoraCreateDTO dto) {
        Fornecedora fornecedora = FornecedoraMapper.toFornecedora(dto);
        Fornecedora fornecedoraAtualizada = fornecedoraService.atualizar(id, fornecedora);
        return fornecedoraAtualizada != null
                ? ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedoraAtualizada))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirFornecedora(@PathVariable Long id) {
        fornecedoraService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
