package com.jujuba.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.service.FornecedoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/fornecedoras")
public class FornecedoraController {

    @Autowired
    private FornecedoraService service;

    // Diretório para salvar os contratos
    private final String UPLOAD_DIR = "./uploads/contratos/";

    @GetMapping
    public List<Fornecedora> listarFornecedoras() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<String> cadastrarFornecedora(
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam("contrato") MultipartFile contrato) {
        try {
            // Converter o JSON recebido em um objeto Fornecedora
            ObjectMapper objectMapper = new ObjectMapper();
            Fornecedora fornecedora = objectMapper.readValue(fornecedoraJson, Fornecedora.class);

            // Salvar o arquivo do contrato, se existir
            if (!contrato.isEmpty()) {
                String caminhoContrato = UPLOAD_DIR + contrato.getOriginalFilename();
                Path caminhoArquivo = Paths.get(caminhoContrato);
                Files.createDirectories(caminhoArquivo.getParent());
                Files.write(caminhoArquivo, contrato.getBytes());
                fornecedora.setContratoUrl(caminhoContrato);
            }

            // Salvar a fornecedora no banco de dados
            service.salvar(fornecedora);

            return ResponseEntity.status(HttpStatus.CREATED).body("Fornecedora cadastrada com sucesso!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar fornecedora ou contrato: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarFornecedora(
            @PathVariable Long id,
            @RequestParam("fornecedora") String fornecedoraJson,  // Dados da fornecedora em formato JSON
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) {  // Arquivo de contrato opcional
    
        try {
            // Converter o JSON recebido em um objeto Fornecedora
            ObjectMapper objectMapper = new ObjectMapper();
            Fornecedora fornecedora = objectMapper.readValue(fornecedoraJson, Fornecedora.class);
    
            // Garantindo que o ID da fornecedora seja o ID da URL
            fornecedora.setId(id);
    
            // Se o contrato for enviado, salva-lo
            if (contrato != null && !contrato.isEmpty()) {
                String caminhoContrato = UPLOAD_DIR + contrato.getOriginalFilename(); // Caminho onde o contrato será salvo
                Path caminhoArquivo = Paths.get(caminhoContrato);
                Files.createDirectories(caminhoArquivo.getParent());
                Files.write(caminhoArquivo, contrato.getBytes());
                fornecedora.setContratoUrl(caminhoContrato);  // Atualiza a URL do contrato
            }
    
            // Atualizar os dados da fornecedora no banco de dados
            service.atualizar(id, fornecedora);  // Método no service para atualização
    
            return ResponseEntity.ok("Fornecedora atualizada com sucesso!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar fornecedora ou contrato: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirFornecedora(@PathVariable Long id) {
        Fornecedora fornecedora = service.buscarPorId(id);
        if (fornecedora == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fornecedora não encontrada.");
        }
        service.excluir(id);
        return ResponseEntity.ok("Fornecedora excluída com sucesso!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fornecedora> buscarFornecedora(@PathVariable Long id) {
        Fornecedora fornecedora = service.buscarPorId(id);
        if (fornecedora == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fornecedora);
    }
}
