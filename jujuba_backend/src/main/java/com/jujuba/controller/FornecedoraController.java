package com.jujuba.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.dto.FornecedoraResponseDTO;
import com.jujuba.mapper.FornecedoraMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.service.ArquivoService;
import com.jujuba.service.FornecedoraService;
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
public class FornecedoraController {

    private final ObjectMapper objectMapper;
    private final FornecedoraService fornecedoraService;
    private final ArquivoService arquivoService;

    @PostMapping
    public ResponseEntity<FornecedoraResponseDTO> cadastrarFornecedora(
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) throws IOException {
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
        return ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedora));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedoraResponseDTO> atualizarFornecedora(
            @PathVariable Long id,
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) throws IOException {
        FornecedoraCreateDTO dto = objectMapper.readValue(fornecedoraJson, FornecedoraCreateDTO.class);
        Fornecedora fornecedora = FornecedoraMapper.toFornecedora(dto);
        Fornecedora fornecedoraAtualizada = fornecedoraService.atualizar(id, fornecedora);

        if (contrato != null && !contrato.isEmpty()) {
            String contratoUrl = arquivoService.salvarContrato(contrato);
            fornecedoraAtualizada.setContratoUrl(contratoUrl);
            fornecedoraAtualizada = fornecedoraService.salvar(fornecedoraAtualizada);
        }

        return ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedoraAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirFornecedora(@PathVariable Long id) {
        fornecedoraService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}