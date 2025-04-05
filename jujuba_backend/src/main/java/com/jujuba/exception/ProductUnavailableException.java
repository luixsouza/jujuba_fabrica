package com.jujuba.exception;

public class ProductUnavailableException extends RuntimeException {
    public ProductUnavailableException(String descricaoProduto) {
        super("Produto '" + descricaoProduto + "' está indisponível no estoque!");
    }
}