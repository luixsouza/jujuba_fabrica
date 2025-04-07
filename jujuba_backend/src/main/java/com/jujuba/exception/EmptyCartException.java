package com.jujuba.exception;

public class EmptyCartException extends RuntimeException {
    public EmptyCartException() {
        super("O carrinho está vazio.");
    }

    public EmptyCartException(String message) {
        super(message);
    }
}