package com.jujuba.utils.enums;

public enum TipoVenda {
    VENDA_SIMPLES("Venda Simples"),
    VENDA_FORNECEDOR("Venda Fornecedor");

    private final String descricao;

    TipoVenda(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return this.descricao;
    }
}
