package com.jujuba.controller;

import com.jujuba.model.Produto;
import com.jujuba.service.CarrinhoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/carrinho")
@Tag(name = "Carrinho", description = "API para gerenciamento do carrinho de compras")
@RequiredArgsConstructor
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    @PostMapping("/adicionar/{produtoId}")
    @Operation(
        summary = "Adicionar produto ao carrinho",
        description = "Adiciona um produto existente no banco de dados ao carrinho de compras."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Produto adicionado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado"),
        @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    public ResponseEntity<Void> adicionarProduto(
        @Parameter(description = "ID do produto a ser adicionado", required = true)
        @PathVariable Long produtoId
    ) {
        carrinhoService.adicionarProduto(produtoId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/adicionar/{produtoId}/{quantidade}")
    @Operation(
        summary = "Adicionar N unidades ao carrinho",
        description = "Adiciona N unidades de um produto ao carrinho de forma atômica."
    )
    public ResponseEntity<Void> adicionarProdutoQuantidade(
        @Parameter(description = "ID do produto a ser adicionado", required = true)
        @PathVariable Long produtoId,
        @Parameter(description = "Quantidade a adicionar", required = true)
        @PathVariable int quantidade
    ) {
        carrinhoService.adicionarProduto(produtoId, quantidade);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remover/{id}")
    @Operation(
        summary = "Remover produto do carrinho",
        description = "Remove um produto do carrinho com base no seu ID."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Produto removido com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado no carrinho"),
        @ApiResponse(responseCode = "400", description = "ID inválido")
    })
    public ResponseEntity<Void> removerProduto(
        @Parameter(description = "ID do produto no carrinho a ser removido", required = true)
        @PathVariable Long id
    ) {
        carrinhoService.removerProduto(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(
        summary = "Listar produtos no carrinho",
        description = "Retorna todos os produtos atualmente adicionados ao carrinho."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de produtos retornada com sucesso"),
        @ApiResponse(responseCode = "204", description = "Carrinho vazio")
    })
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = carrinhoService.listarProdutos();
        if (produtos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/total")
    @Operation(
        summary = "Calcular valor total",
        description = "Calcula e retorna o valor total de todos os produtos no carrinho."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Total calculado com sucesso"),
        @ApiResponse(responseCode = "204", description = "Carrinho vazio")
    })
    public ResponseEntity<BigDecimal> calcularTotal() {
        BigDecimal total = carrinhoService.calcularTotal();
        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(total);
    }

    @DeleteMapping("/limpar")
    @Operation(
        summary = "Limpar carrinho",
        description = "Remove todos os produtos do carrinho."
    )
    public ResponseEntity<Void> limparCarrinho() {
        carrinhoService.limparCarrinho();
        return ResponseEntity.ok().build();
    }
}