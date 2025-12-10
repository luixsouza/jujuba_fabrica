import api from "../../utils/api";

const ESTADOS_CONSERVACAO = {
  Ótimo: "OTIMO",
  Excelente: "EXCELENTE",
  Bom: "BOM",
  Ruim: "RUIM",
};

const GENEROS = {
  Masculino: "MASCULINO",
  Feminino: "FEMININO",
  Unisex: "UNISSEX",
};

const validarProduto = (produto, index) => {
  const erros = [];

  if (!produto.descricao || produto.descricao.trim() === "") {
    erros.push(`Produto ${index + 1}: Descrição é obrigatória`);
  }

  if (!produto.preco || isNaN(produto.preco) || produto.preco <= 0) {
    erros.push(`Produto ${index + 1}: Preço deve ser um número maior que 0`);
  }

  if (
    !produto.quantidade ||
    isNaN(produto.quantidade) ||
    produto.quantidade <= 0
  ) {
    erros.push(
      `Produto ${index + 1}: Quantidade deve ser um número maior que 0`
    );
  }

  if (
    produto.estadoConservacao &&
    !ESTADOS_CONSERVACAO[produto.estadoConservacao]
  ) {
    erros.push(
      `Produto ${
        index + 1
      }: Estado de conservação inválido. Valores aceitos: ${Object.keys(
        ESTADOS_CONSERVACAO
      ).join(", ")}`
    );
  }

  if (produto.genero && !GENEROS[produto.genero]) {
    erros.push(
      `Produto ${index + 1}: Gênero inválido. Valores aceitos: ${Object.keys(
        GENEROS
      ).join(", ")}`
    );
  }

  return erros;
};

const createLote = async (fornecedoraId, produtos) => {
  try {
    console.log("=== INÍCIO DEBUG LOTE ===");
    console.log("fornecedoraId recebido:", fornecedoraId);
    console.log("produtos recebidos:", produtos);

    if (!fornecedoraId) {
      throw new Error("fornecedoraId é obrigatório");
    }

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      throw new Error("produtos deve ser um array não vazio");
    }

    const todosErros = [];
    produtos.forEach((produto, index) => {
      const erros = validarProduto(produto, index);
      todosErros.push(...erros);
    });

    if (todosErros.length > 0) {
      throw new Error(`Erros de validação:\n${todosErros.join("\n")}`);
    }

    const produtosFormatados = produtos.map((produto, index) => {
      console.log(`Formatando produto ${index + 1}:`, produto);

      const estadoConservacao =
        ESTADOS_CONSERVACAO[produto.estadoConservacao] || "BOM";
      const genero = GENEROS[produto.genero] || "UNISSEX";

      const produtoFormatado = {
        descricao: produto.descricao?.trim(),
        preco: Number.parseFloat(produto.preco),
        quantidade: Number.parseInt(produto.quantidade),
        marca: produto.marca?.trim() || "",
        tamanho: produto.tamanho?.trim() || "",
        estadoConservacao: estadoConservacao,
        genero: genero,
      };

      console.log(`Produto ${index + 1} formatado:`, produtoFormatado);
      return produtoFormatado;
    });

    const loteData = {
      fornecedora: {
        id: Number.parseInt(fornecedoraId),
      },
      produtos: produtosFormatados,
    };

    console.log("=== DADOS FINAIS PARA ENVIO ===");
    console.log("Payload:", JSON.stringify(loteData, null, 2));

    const response = await api.post("/lotes", loteData);
    console.log(response)

    console.log("Status da resposta:", response.status);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Erro ao cadastrar lote:", error);
    throw error;
  }
};

const getAllLotes = async () => {
  try {
    console.log("=== INÍCIO DEBUG GET ALL LOTES ===");

    const response = await api.get("/lotes");
    console.log("getAllLotes: Status da resposta:", response.status);

    const data = response.data;
    console.log(
      "getAllLotes: Dados recebidos do backend (antes da validação):",
      JSON.stringify(data, null, 2)
    );

    if (!Array.isArray(data)) {
      console.error("getAllLotes: Resposta não é um array:", data);
      throw new Error("Formato de resposta inválido - esperado um array");
    }

    const lotesFormatados = data
      .map((lote, index) => {
        console.log(`Processando lote ${index + 1}:`, lote);

        if (!lote || typeof lote !== "object") {
          console.warn(`Lote ${index + 1} tem estrutura inválida:`, lote);
          return null;
        }

        const loteFormatado = {
          id: lote.id,
          fornecedora: {
            id: lote.fornecedora?.id || null,
            nome: lote.fornecedora?.nome || "Nome não informado",
          },
          produtos: Array.isArray(lote.produtos)
            ? lote.produtos.map((produto, produtoIndex) => {
                console.log(
                  `Processando produto ${produtoIndex + 1} do lote ${
                    index + 1
                  }:`,
                  produto
                );

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
                };
              })
            : [],
          dataCriacao: lote.dataCriacao || lote.createdAt,
          status: lote.status || "ATIVO",
          totalProdutos: Array.isArray(lote.produtos)
            ? lote.produtos.length
            : 0,
        };

        console.log(`Lote ${index + 1} formatado:`, loteFormatado);
        return loteFormatado;
      })
      .filter((lote) => lote !== null);

    console.log("=== LOTES FORMATADOS FINAIS ===");
    console.log("Total de lotes:", lotesFormatados.length);

    return lotesFormatados;
  } catch (error) {
    console.error("Erro ao listar lotes:", error);
    throw error;
  }
};

const getLoteById = async (id) => {
  try {
    console.log(`Buscando lote com ID: ${id}`);

    const response = await api.get(`/lotes/${id}`);

    const lote = response.data;
    console.log("Lote encontrado:", lote);

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
    };
  } catch (error) {
    console.error(`Erro ao buscar lote ${id}:`, error);
    throw error;
  }
};

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
    };

    const response = await api.put(`/lotes/${id}`, formattedLoteData);

    const data = response.data;

    return {
      id: data.id || id,
      fornecedora: {
        id: data.fornecedora?.id || formattedLoteData.fornecedora.id,
        nome: data.fornecedora?.nome || "Nome não disponível",
      },
      produtos: Array.isArray(data.produtos)
        ? data.produtos
        : formattedLoteData.produtos,
    };
  } catch (error) {
    console.error("Erro ao editar lote:", error);
    throw error;
  }
};

const deletarLote = async (id) => {
  try {
    const response = await api.delete(`/lotes/${id}`);

    return {
      sucesso: true,
      mensagem: response.data?.message || "Lote deletado com sucesso.",
      idDeletado: id,
    };
  } catch (error) {
    console.error("Erro ao deletar lote:", error);
    throw error;
  }
};

const getFornecedoras = async () => {
  try {
    const response = await api.get("/fornecedoras");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar fornecedoras:", error);
    return [];
  }
};

const testApiConnection = async () => {
  try {
    console.log("Testando conexão com a API...");

    const response = await api.get("/lotes");

    if (response.status === 200) {
      console.log("Conexão com API estabelecida com sucesso");
      return {
        success: true,
        status: response.status,
        message: "Conexão estabelecida com sucesso",
      };
    } else {
      console.warn(`API respondeu com status ${response.status}`);
      return {
        success: false,
        status: response.status,
        message: `API respondeu com status ${response.status}`,
      };
    }
  } catch (error) {
    console.error("Erro ao testar conexão com API:", error);
    return {
      success: false,
      status: null,
      message: error.message || "Erro de conectividade",
    };
  }
};

// Exportar usando ES named exports
export const deleteLote = deletarLote;

export {
  createLote,
  getAllLotes,
  getLoteById,
  editLote,
  deletarLote,
  testApiConnection,
  getFornecedoras,
  ESTADOS_CONSERVACAO,
  GENEROS,
};
