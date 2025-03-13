import axios from "axios"

const BASE_URL = "http://localhost:8080/api/produtos"


const FORNECEDORAS_MOCK = [
  { id: 1, nome: "Ana",  endereco: "Rua A, 123" },
  { id: 2, nome: "Bet",  endereco: "Av. B, 456" },
  { id: 3, nome: "Carla",  endereco: "Praça C, 789" },
  { id: 4, nome: "Arnalda",endereco: "Rua D, 1011" },
  { id: 5, nome: "Fabiana",  endereco: "Av. E, 1213" },
]


const FORMAS_PAGAMENTO_MOCK = [
  { id: 1, nome: "Cartão de Crédito", },
  { id: 2, nome: "Cartão de Débito", },
  { id: 3, nome: "Pix",},
  { id: 4, nome: "Dinheiro", },
]


const DESCRICOES_DETALHADAS_MOCK = new Map()


const gerarDescricaoDetalhada = (produtoId, descricaoBasica) => {
  if (DESCRICOES_DETALHADAS_MOCK.has(produtoId)) {
    return DESCRICOES_DETALHADAS_MOCK.get(produtoId)
  }

  const descricoes = [
    `${descricaoBasica || "Produto"} com características premium. 
Este item apresenta excelente qualidade e acabamento. Fabricado com materiais de primeira linha, 
oferece durabilidade e conforto. Ideal para uso diário e ocasiões especiais.
Disponível em estoque para entrega imediata.`,

    `${descricaoBasica || "Item"} exclusivo com design moderno e funcional.
Produzido com tecnologia avançada e materiais selecionados, este produto 
garante satisfação e durabilidade. Perfeito para complementar seu estilo pessoal.
Produto com garantia de qualidade.`,

    `${descricaoBasica || "Produto"} versátil e elegante para diversas ocasiões.
Com acabamento refinado e atenção aos detalhes, este item se destaca pela 
qualidade e praticidade. Desenvolvido para atender às necessidades mais exigentes.
Compre agora e receba em casa com rapidez.`,
  ]

  
  const descricaoIndex = produtoId ? produtoId % descricoes.length : 0
  const descricaoDetalhada = descricoes[descricaoIndex]

  DESCRICOES_DETALHADAS_MOCK.set(produtoId, descricaoDetalhada)
  return descricaoDetalhada
}

export const ProdutoService = {
  /**
   * 
   * @returns 
   */
  getProdutos: async () => {
    try {
      const response = await axios.get(BASE_URL)

      
      const produtosAjustados = response.data.map((produto) => ({
        ...produto,
        descricao: produto.descricao || "N/A",
        marca: produto.marca || "N/A",
        tamanho: produto.tamanho || "N/A",
        estadoConservacao: produto.estadoConservacao || "N/A",
        genero: produto.genero || "N/A",
        preco: produto.preco || 0,
        data: produto.data || produto.dataCriacao,
        fornecedora: produto.fornecedora || "N/A",
        forma_pagamento: produto.forma_pagamento || "N/A",
        descricaoDetalhada: gerarDescricaoDetalhada(produto.id, produto.descricao),
      }))

      return produtosAjustados
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
      return [] 
    }
  },

 
  getProdutoById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`)

    
      const descricaoDetalhada = gerarDescricaoDetalhada(id, response.data.descricao)


      const produtoComDescricao = {
        ...response.data,
        descricaoDetalhada: descricaoDetalhada,
      }

      console.log(`Produto ${id} carregado com descrição detalhada mockada`)

      return produtoComDescricao
    } catch (error) {
      console.error(`Erro ao buscar produto com ID ${id}:`, error)
      return null
    }
  },

  /**
   * 
   * @param {Object} produto 
   * @returns 
   */
  createProduto: async (produto) => {
    try {
      
      const { fornecedora, forma_pagamento, descricaoDetalhada, ...produtoParaEnviar } = produto

      const response = await axios.post(BASE_URL, produtoParaEnviar)

      
      if (response.data && response.data.id) {
        if (descricaoDetalhada) {
          DESCRICOES_DETALHADAS_MOCK.set(response.data.id, descricaoDetalhada)
        }

        console.log(`Produto ${response.data.id} criado com:
          - Descrição detalhada: ${descricaoDetalhada ? "Personalizada" : "Padrão"}
          - Fornecedora ID: ${fornecedora || "N/A"}
          - Forma de pagamento: ${forma_pagamento || "N/A"}`)
      }

      return response.data
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      return null
    }
  },

  /**
   *
   * @param {number} id 
   * @param {Object} produto 
   * @returns 
   */
  updateProduto: async (id, produto) => {
    try {
       const { fornecedora, forma_pagamento, descricaoDetalhada, ...produtoParaEnviar } = produto

      const response = await axios.put(`${BASE_URL}/${id}`, produtoParaEnviar)

     
      if (response.data) {
        if (descricaoDetalhada) {
          DESCRICOES_DETALHADAS_MOCK.set(id, descricaoDetalhada)
        }

        console.log(`Produto ${id} atualizado com:
          - Descrição detalhada: ${descricaoDetalhada ? "Atualizada" : "Mantida"}
          - Fornecedora ID: ${fornecedora || "N/A"}
          - Forma de pagamento: ${forma_pagamento || "N/A"}`)
      }

      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar produto com ID ${id}:`, error)
      return null
    }
  },

  /**
   * 
   * @param {number} id 
   * @returns {boolean} 
   */
  deleteProduto: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`)

     
      DESCRICOES_DETALHADAS_MOCK.delete(id)

      return true
    } catch (error) {
      console.error(`Erro ao excluir produto com ID ${id}:`, error)
      return false
    }
  },

  /**
   *
   * @returns Lista de fornecedoras mockadas
   */
  getFornecedoras: async () => {

    await new Promise((resolve) => setTimeout(resolve, 500))

    
    return [...FORNECEDORAS_MOCK]
  },

  /**
   * 
   * @param {number} id 
   * @returns
   */
  getFornecedoraById: async (id) => {
   
    await new Promise((resolve) => setTimeout(resolve, 300))

    return FORNECEDORAS_MOCK.find((f) => f.id === Number(id)) || null
  },

  /**
   *
   * @returns 
   */
  getFormasPagamento: async () => {
    
    await new Promise((resolve) => setTimeout(resolve, 300))


    return [...FORMAS_PAGAMENTO_MOCK]
  },

  /**
   * 
   * @param {number} id 
   * @returns 
   */
  getFormaPagamentoById: async (id) => {
   
    await new Promise((resolve) => setTimeout(resolve, 200))

    return FORMAS_PAGAMENTO_MOCK.find((f) => f.id === Number(id)) || null
  },
}

