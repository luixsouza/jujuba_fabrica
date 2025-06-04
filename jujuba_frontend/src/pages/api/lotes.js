const BASE_URL = 'http://localhost:8080/api/lotes';



const ESTADOS_CONSERVACAO = {
  Ótimo: "OTIMO",
  Excelente: "EXCELENTE",
  Bom: "BOM",
  Ruim: "RUIM",
}

// Valores exatos aceitos pelo backend para Gênero
const GENEROS = {
  Masculino: "MASCULINO",
  Feminino: "FEMININO",
  Unisex: "UNISSEX",
}



// Função para validar um produto
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

export const createLote = async (fornecedoraId, produtos) => {
  try {
    console.log("=== INÍCIO DEBUG LOTE ===")
    console.log("fornecedoraId recebido:", fornecedoraId)
    console.log("produtos recebidos:", produtos)

    // Validações básicas
    if (!fornecedoraId) {
      throw new Error("fornecedoraId é obrigatório")
    }

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      throw new Error("produtos deve ser um array não vazio")
    }

    // Validar cada produto
    const todosErros = []
    produtos.forEach((produto, index) => {
      const erros = validarProduto(produto, index)
      todosErros.push(...erros)
    })

    if (todosErros.length > 0) {
      throw new Error(`Erros de validação:\n${todosErros.join("\n")}`)
    }

    // Converter produtos para o formato esperado pelo backend
    const produtosFormatados = produtos.map((produto, index) => {
      console.log(`Formatando produto ${index + 1}:`, produto)

      const estadoConservacao = ESTADOS_CONSERVACAO[produto.estadoConservacao] || "BOM"
      const genero = GENEROS[produto.genero] || "UNISSEX"

      const produtoFormatado = {
        // Remover o campo nome que não é esperado pelo backend
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
    console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

    // Ler a resposta como texto primeiro
    const responseText = await response.text()
    console.log("Resposta completa (texto):", responseText)

    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`

      if (responseText) {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
          console.log("Erro parseado:", errorData)
        } catch (parseError) {
          errorMessage = responseText
          console.log("Erro não é JSON válido:", responseText)
        }
      }

      throw new Error(errorMessage)
    }

    // Tentar fazer parse da resposta de sucesso
    if (!responseText) {
      console.log("Resposta vazia - assumindo sucesso")
      return {
        success: true,
        data: { message: "Lote criado com sucesso" },
      }
    }

    try {
      const data = JSON.parse(responseText)
      console.log("Resposta de sucesso parseada:", data)
      return {
        success: true,
        data: data,
      }
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta de sucesso:", parseError)
      // Se não conseguir fazer parse, mas a resposta foi 200, assumir sucesso
      return {
        success: true,
        data: { message: "Lote criado com sucesso", raw: responseText },
      }
    }
  } catch (error) {
    console.error("=== ERRO FINAL ===")
    console.error("Erro ao cadastrar lote:", error)
    console.error("Stack trace:", error.stack)
    throw error
  }
}

// Handler para Next.js API routes
export default async function handler(req, res) {
  // Adicionar CORS se necessário
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Apenas POST é permitido",
    })
  }

  try {
    console.log("=== API ROUTE DEBUG ===")
    console.log("Body recebido:", req.body)
    console.log("Headers:", req.headers)

    const { fornecedoraId, produtos } = req.body

    if (!fornecedoraId || !produtos || !Array.isArray(produtos)) {
      return res.status(400).json({
        error: "Dados inválidos",
        message: "fornecedoraId e produtos (array) são obrigatórios",
        received: { fornecedoraId, produtos: produtos ? "array" : typeof produtos },
      })
    }

    const result = await createLote(fornecedoraId, produtos)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Erro na API route:", error)
    return res.status(500).json({
      error: "Erro interno",
      message: error.message,
    })
  }
}

export const getAllLotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar os lotes.');
    }

    const data = await response.json();

    return data.map((lote) => ({
      id: lote.id,
      fornecedora: {
        id: lote.fornecedora.id,
        nome: lote.fornecedora.nome,
      },
      produtos: lote.produtos.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
      })),
    }));
  } catch (error) {
    console.error('Erro ao listar lotes:', error);
    throw error;
  }
};


export const getLoteById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Lote não encontrado.');
    }

    const data = await response.json();

    return {
      id: data.id,
      fornecedora: {
        id: data.fornecedora.id,
        nome: data.fornecedora.nome,
        contato: data.fornecedora.contato,
        endereco: data.fornecedora.endereco,
        chavePix: data.fornecedora.chavePix,
        contratoUrl: data.fornecedora.contratoUrl,
        dataNascimento: data.fornecedora.dataNascimento,
      },
      produtos: data.produtos.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade: produto.quantidade,
      })),
    };
  } catch (error) {
    console.error('Erro ao buscar lote:', error);
    throw error;
  }
};


export const editLote = async (id, loteData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao editar o lote.');
    }

    const data = await response.json();

    return {
      id: data.id,
      fornecedora: {
        id: data.fornecedora.id,
        nome: data.fornecedora.nome,
        contato: data.fornecedora.contato,
        endereco: data.fornecedora.endereco,
        chavePix: data.fornecedora.chavePix,
        contratoUrl: data.fornecedora.contratoUrl,
        dataNascimento: data.fornecedora.dataNascimento,
      },
      produtos: data.produtos.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade: produto.quantidade,
      })),
    };
  } catch (error) {
    console.error('Erro ao editar lote:', error);
    throw error;
  }
};

export const deleteLote = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao deletar o lote.');
    }
    const data = await response.json();

    return {
      sucesso: true,
      mensagem: data.message || 'Lote deletado com sucesso.',
      idDeletado: id,
    };
  } catch (error) {
    console.error('Erro ao deletar lote:', error);
    throw error;
  }
};
export const getFornecedoras = async () => {
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