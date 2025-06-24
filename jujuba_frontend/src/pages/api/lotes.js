const BASE_URL = "http://localhost:8080/api/lotes"

const ESTADOS_CONSERVACAO = {
  Ótimo: "OTIMO",
  Excelente: "EXCELENTE",
  Bom: "BOM",
  Ruim: "RUIM",
}

const GENEROS = {
  Masculino: "MASCULINO",
  Feminino: "FEMININO",
  Unisex: "UNISSEX",
}

const validarProduto = (produto, index) => {
  const erros = []

  if (!produto.descricao || produto.descricao.trim() === "") {
    erros.push(`Produto ${index + 1}: Descrição é obrigatória`)
  }

  if (!produto.preco || isNaN(produto.preco) || produto.preco <= 0) {
    erros.push(`Produto ${index + 1}: Preço deve ser um número maior que 0`)
  }

  if (!produto.quantidade || isNaN(produto.quantidade) || produto.quantidade <= 0) {
    erros.push(`Produto ${index + 1}: Quantidade deve ser um número maior que 0`)
  }

  if (produto.estadoConservacao && !ESTADOS_CONSERVACAO[produto.estadoConservacao]) {
    erros.push(
      `Produto ${index + 1}: Estado de conservação inválido. Valores aceitos: ${Object.keys(ESTADOS_CONSERVACAO).join(", ")}`,
    )
  }

  if (produto.genero && !GENEROS[produto.genero]) {
    erros.push(`Produto ${index + 1}: Gênero inválido. Valores aceitos: ${Object.keys(GENEROS).join(", ")}`)
  }

  return erros
}

const createLote = async (fornecedoraId, produtos) => {
  try {
    console.log("=== INÍCIO DEBUG LOTE ===")
    console.log("fornecedoraId recebido:", fornecedoraId)
    console.log("produtos recebidos:", produtos)

    if (!fornecedoraId) {
      throw new Error("fornecedoraId é obrigatório")
    }

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      throw new Error("produtos deve ser um array não vazio")
    }

    const todosErros = []
    produtos.forEach((produto, index) => {
      const erros = validarProduto(produto, index)
      todosErros.push(...erros)
    })

    if (todosErros.length > 0) {
      throw new Error(`Erros de validação:\n${todosErros.join("\n")}`)
    }

    const produtosFormatados = produtos.map((produto, index) => {
      console.log(`Formatando produto ${index + 1}:`, produto)

      const estadoConservacao = ESTADOS_CONSERVACAO[produto.estadoConservacao] || "BOM"
      const genero = GENEROS[produto.genero] || "UNISSEX"

      const produtoFormatado = {
        descricao: produto.descricao?.trim(),
        preco: Number.parseFloat(produto.preco),
        quantidade: Number.parseInt(produto.quantidade),
        marca: produto.marca?.trim() || "",
        tamanho: produto.tamanho?.trim() || "",
        estadoConservacao: estadoConservacao,
        genero: genero,
      }

      console.log(`Produto ${index + 1} formatado:`, produtoFormatado)
      return produtoFormatado
    })

    const loteData = {
      fornecedora: {
        id: Number.parseInt(fornecedoraId),
      },
      produtos: produtosFormatados,
    }

    console.log("=== DADOS FINAIS PARA ENVIO ===")
    console.log("URL:", BASE_URL)
    console.log("Payload:", JSON.stringify(loteData, null, 2))

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(loteData),
    })

    console.log("Status da resposta:", response.status)

    const responseText = await response.text()
    console.log("Resposta completa (texto):", responseText)

    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`

      if (responseText) {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          errorMessage = responseText
        }
      }

      throw new Error(errorMessage)
    }

    if (!responseText) {
      return {
        success: true,
        data: { message: "Lote criado com sucesso" },
      }
    }

    try {
      const data = JSON.parse(responseText)
      return {
        success: true,
        data: data,
      }
    } catch (parseError) {
      return {
        success: true,
        data: { message: "Lote criado com sucesso", raw: responseText },
      }
    }
  } catch (error) {
    console.error("Erro ao cadastrar lote:", error)
    throw error
  }
}

const getAllLotes = async () => {
  try {
    console.log("=== INÍCIO DEBUG GET ALL LOTES ===")
    console.log("URL:", BASE_URL)

    const response = await fetch(`${BASE_URL}`)
    console.log("getAllLotes: Status da resposta:", response.status)

    if (!response.ok) {
      throw new Error(`Erro ao buscar os lotes. Status: ${response.status}`)
    }

    const data = await response.json()
    console.log("getAllLotes: Dados recebidos do backend (antes da validação):", JSON.stringify(data, null, 2))

    if (!Array.isArray(data)) {
      console.error("getAllLotes: Resposta não é um array:", data)
      throw new Error("Formato de resposta inválido - esperado um array")
    }

    const lotesFormatados = data
      .map((lote, index) => {
        console.log(`Processando lote ${index + 1}:`, lote)

        if (!lote || typeof lote !== "object") {
          console.warn(`Lote ${index + 1} tem estrutura inválida:`, lote)
          return null
        }

        const loteFormatado = {
          id: lote.id,
          fornecedora: {
            id: lote.fornecedora?.id || null,
            nome: lote.fornecedora?.nome || "Nome não informado",
          },
          produtos: Array.isArray(lote.produtos)
            ? lote.produtos.map((produto, produtoIndex) => {
                console.log(`Processando produto ${produtoIndex + 1} do lote ${index + 1}:`, produto)

                return {
                  id: produto.id,
                  nome: produto.descricao || produto.nome || "Produto sem nome",
                  descricao: produto.descricao || "",
                  preco: produto.preco || 0,
                  quantidade: produto.quantidade || 0,
                  marca: produto.marca || "",
                  tamanho: produto.tamanho || "",
                  estadoConservacao: produto.estadoConservacao || "",
                  genero: produto.genero || "",
                }
              })
            : [],
          dataCriacao: lote.dataCriacao || lote.createdAt,
          status: lote.status || "ATIVO",
          totalProdutos: Array.isArray(lote.produtos) ? lote.produtos.length : 0,
        }

        console.log(`Lote ${index + 1} formatado:`, loteFormatado)
        return loteFormatado
      })
      .filter((lote) => lote !== null)

    console.log("=== LOTES FORMATADOS FINAIS ===")
    console.log("Total de lotes:", lotesFormatados.length)

    return lotesFormatados
  } catch (error) {
    console.error("Erro ao listar lotes:", error)
    throw error
  }
}

const getLoteById = async (id) => {
  try {
    console.log(`Buscando lote com ID: ${id}`)

    const response = await fetch(`${BASE_URL}/${id}`)

    if (!response.ok) {
      throw new Error(`Erro ao buscar lote ${id}. Status: ${response.status}`)
    }

    const lote = await response.json()
    console.log("Lote encontrado:", lote)

    return {
      id: lote.id,
      fornecedora: {
        id: lote.fornecedora?.id || null,
        nome: lote.fornecedora?.nome || "Nome não informado",
      },
      produtos: Array.isArray(lote.produtos)
        ? lote.produtos.map((produto) => ({
            id: produto.id,
            nome: produto.descricao || produto.nome || "Produto sem nome",
            descricao: produto.descricao || "",
            preco: produto.preco || 0,
            quantidade: produto.quantidade || 0,
            marca: produto.marca || "",
            tamanho: produto.tamanho || "",
            estadoConservacao: produto.estadoConservacao || "",
            genero: produto.genero || "",
          }))
        : [],
      dataCriacao: lote.dataCriacao || lote.createdAt,
      status: lote.status || "ATIVO",
      totalProdutos: Array.isArray(lote.produtos) ? lote.produtos.length : 0,
    }
  } catch (error) {
    console.error(`Erro ao buscar lote ${id}:`, error)
    throw error
  }
}

const editLote = async (id, loteData) => {
  try {
    const formattedLoteData = {
      fornecedora: {
        id: loteData.fornecedora?.id || loteData.fornecedoraId,
      },
      produtos: Array.isArray(loteData.produtos)
        ? loteData.produtos.map((produto) => ({
            id: produto.id,
            descricao: produto.descricao || produto.nome,
            preco: Number.parseFloat(produto.preco),
            quantidade: Number.parseInt(produto.quantidade),
            marca: produto.marca || "",
            tamanho: produto.tamanho || "",
            estadoConservacao: produto.estadoConservacao || "BOM",
            genero: produto.genero || "UNISSEX",
          }))
        : [],
    }

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formattedLoteData),
    })

    const responseText = await response.text()

    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          errorMessage = responseText
        }
      }
      throw new Error(errorMessage)
    }

    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      data = { message: "Lote editado com sucesso" }
    }

    return {
      id: data.id || id,
      fornecedora: {
        id: data.fornecedora?.id || formattedLoteData.fornecedora.id,
        nome: data.fornecedora?.nome || "Nome não disponível",
      },
      produtos: Array.isArray(data.produtos) ? data.produtos : formattedLoteData.produtos,
    }
  } catch (error) {
    console.error("Erro ao editar lote:", error)
    throw error
  }
}

const deletarLote = async (id) => {///
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    })

    const responseText = await response.text()

    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          errorMessage = responseText
        }
      }
      throw new Error(errorMessage)
    }

    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      data = { message: "Lote deletado com sucesso" }
    }

    return {
      sucesso: true,
      mensagem: data.message || "Lote deletado com sucesso.",
      idDeletado: id,
    }
  } catch (error) {
    console.error("Erro ao deletar lote:", error)
    throw error
  }
}

const getFornecedoras = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/fornecedoras")

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    const responseText = await response.text()

    if (!responseText) {
      return []
    }

    try {
      const data = JSON.parse(responseText)
      return Array.isArray(data) ? data : []
    } catch (parseError) {
      console.error("Erro ao fazer parse das fornecedoras:", responseText)
      return []
    }
  } catch (error) {
    console.error("Erro ao buscar fornecedoras:", error)
    return []
  }
}

// Exportar usando CommonJS para compatibilidade
module.exports = {
  createLote,
  getAllLotes,
  getLoteById,
  editLote,
  deletarLote,
  getFornecedoras,
  ESTADOS_CONSERVACAO,
  GENEROS,
}