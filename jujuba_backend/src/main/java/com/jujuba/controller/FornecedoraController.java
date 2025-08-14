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
import org.springframework.transaction.annotation.Transactional; // Importante: Adicione esta importação

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
    @Transactional // <--- Adicionada a anotação @Transactional para garantir atomicidade
    public ResponseEntity<FornecedoraResponseDTO> cadastrarFornecedora(
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) { // 'throws IOException' removido da assinatura

        try {
            // 1. Deserializar o JSON da fornecedora
            FornecedoraCreateDTO dto = objectMapper.readValue(fornecedoraJson, FornecedoraCreateDTO.class);
            Fornecedora fornecedora = FornecedoraMapper.toFornecedora(dto);

            // 2. Salvar o contrato primeiro (se houver e não estiver vazio)
            // Se houver um erro ao salvar o arquivo, uma exceção será lançada aqui.
            // O @Transactional garantirá o rollback do fornecedor caso ele já tivesse sido salvo.
            String contratoUrl = null;
            if (contrato != null && !contrato.isEmpty()) {
                try {
                    contratoUrl = arquivoService.salvarContrato(contrato);
                } catch (IOException e) {
                    System.err.println("Erro de I/O ao salvar contrato: " + e.getMessage());
                    // Se o problema é no servidor (ex: disco, permissão), retorne 500.
                    // Se fosse uma validação de arquivo do lado do servidor que falhou por dados do cliente, 400.
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            } else {
                // Opcional: Se o contrato for obrigatório para o backend, descomente e ajuste:
                // throw new IllegalArgumentException("O arquivo do contrato é obrigatório e não foi enviado.");
            }

            // 3. Associar o URL do contrato (se houver) e salvar a fornecedora (apenas uma vez)
            fornecedora.setContratoUrl(contratoUrl);
            Fornecedora fornecedoraSalva = fornecedoraService.salvar(fornecedora);

            // 4. Retornar sucesso 201 Created com a FornecedoraResponseDTO no corpo
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(FornecedoraMapper.toDTO(fornecedoraSalva));

        } catch (IOException e) {
            // Este catch agora é principalmente para erros na desserialização do JSON (fornecedoraJson)
            // JSON malformado é um erro do cliente, então 400 Bad Request é apropriado.
            System.err.println("Erro ao processar JSON da fornecedora: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (IllegalArgumentException e) { // Catch para validações como a de contrato obrigatório (se implementada acima)
            System.err.println("Erro de validação: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            // Este é o catch-all para qualquer outra exceção não esperada
            // (ex: do service layer, como problemas de banco de dados, validações genéricas)
            System.err.println("Erro inesperado ao cadastrar fornecedora: " + e.getMessage());
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
            // Este catch deve ser mais específico se FornecedoraNotFoundException é lançada pelo service
            // Para ser consistente com o status 404 da API Responses
            if (e instanceof FornecedoraNotFoundException) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Atualiza uma fornecedora", description = "Permite atualizar os dados de uma fornecedora existente e, opcionalmente, enviar um novo contrato.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fornecedora atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição - dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Fornecedora não encontrada"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @PutMapping("/{id}")
    @Transactional // <--- Adicionada a anotação @Transactional também no PUT
    public ResponseEntity<FornecedoraResponseDTO> atualizarFornecedora(
            @PathVariable Long id,
            @RequestParam("fornecedora") String fornecedoraJson,
            @RequestParam(value = "contrato", required = false) MultipartFile contrato) {

        try {
            FornecedoraCreateDTO dto = objectMapper.readValue(fornecedoraJson, FornecedoraCreateDTO.class);
            Fornecedora fornecedora = FornecedoraMapper.toFornecedora(dto);

            // Tenta obter a fornecedora existente antes de qualquer operação de atualização
            Fornecedora fornecedoraExistente = fornecedoraService.buscarPorId(id);

            String contratoUrl = fornecedoraExistente.getContratoUrl(); // Mantém o URL existente por padrão
            if (contrato != null && !contrato.isEmpty()) {
                try {
                    contratoUrl = arquivoService.salvarContrato(contrato);
                } catch (IOException e) {
                    System.err.println("Erro de I/O ao salvar contrato na atualização: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            fornecedora.setId(id); // Garante que o ID correto seja usado para a atualização
            fornecedora.setContratoUrl(contratoUrl); // Define o URL do contrato (novo ou existente)

            Fornecedora fornecedoraAtualizada = fornecedoraService.atualizar(id, fornecedora);


            return ResponseEntity.ok(FornecedoraMapper.toDTO(fornecedoraAtualizada));

        } catch (FornecedoraNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            // Erro ao processar JSON da fornecedora
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            // Catch-all para outros erros inesperados
            System.err.println("Erro inesperado ao atualizar fornecedora: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Exclui uma fornecedora", description = "Remove uma fornecedora do sistema com base no ID informado.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Fornecedora excluída com sucesso"),
            @ApiResponse(responseCode = "404", description = "Fornecedora não encontrada"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    })
    @DeleteMapping("/{id}")
    @Transactional // <--- Adicionada a anotação @Transactional também no DELETE
    public ResponseEntity<Void> excluirFornecedora(@PathVariable Long id) {
        try {
            // Antes de excluir, se houver um contrato associado, você pode querer excluí-lo também.
            // Isso dependerá da sua lógica de negócio e da implementação do ArquivoService.
            // Exemplo:
            // Fornecedora fornecedora = fornecedoraService.buscarPorId(id);
            // if (fornecedora.getContratoUrl() != null && !fornecedora.getContratoUrl().isEmpty()) {
            //     arquivoService.excluirArquivo(fornecedora.getContratoUrl());
            // }

            fornecedoraService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (FornecedoraNotFoundException e) { // Específico para a exceção de não encontrada
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("Erro inesperado ao excluir fornecedora: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}