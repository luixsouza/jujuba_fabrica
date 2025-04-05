package com.jujuba.exception;

public class FornecedoraNotFoundException extends RuntimeException {
    
    public FornecedoraNotFoundException() {
        super("Fornecedora não encontrada!");
    }

    public FornecedoraNotFoundException(String message) {
        super(message);
    }
}