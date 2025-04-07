package com.jujuba.exception;

public class SaleNotFoundException extends RuntimeException {
    public SaleNotFoundException() {
        super("Venda não encontrada!");
    }

    public SaleNotFoundException(String message) {
        super(message);
    }
}