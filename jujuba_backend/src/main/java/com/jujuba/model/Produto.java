package com.jujuba.model;

import com.jujuba.utils.enums.EstadoConservacao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "descricao", nullable = false, length = 300)
    private String descricao;
    
    @Column(name = "marca", nullable = false, length = 100)
    private String marca;
    
    @Column(name = "tamanho", nullable = false, length = 50)
    private String tamanho;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_conservacao", nullable = false, length = 20)
    private EstadoConservacao estadoConservacao;
    
    @Column(name = "preco", nullable = false)
    private Double preco;
    
    @Column(name = "imagem_url", length = 300)
    private String imagemUrl;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "fornecedora_id", nullable = false)
    private Fornecedora fornecedora;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Produto other = (Produto) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Produto [id=" + id + "]";
    }
}
