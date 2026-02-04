import api from "../../utils/api";

/**
 * Trata erros de requisição de forma padronizada para fornecer feedback claro.
 * @param {Error} error - O objeto de erro capturado.
 * @returns {object} - Um objeto de resposta de erro padronizado.
 */
const tratarErro = (error) => {
  // Erro de rede ou conexão (ex: backend desligado)
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      sucesso: false,
      mensagem:
        "Erro de conexão com o servidor. Verifique se o backend está rodando.",
      detalhes: error.message,
    };
  }
  // Erro de resposta HTTP (ex: 404, 500)
  if (error.message.includes("HTTP error")) {
    const status = error.message.match(/\d+/)?.[0] || "desconhecido";
    return {
      sucesso: false,
      mensagem: `Erro no servidor (status ${status}).`,
      detalhes: error.message,
    };
  }
  // Outros erros
  return {
    sucesso: false,
    mensagem: error.message || "Ocorreu um erro desconhecido.",
    detalhes: String(error),
  };
};

/**
 * Busca o estado completo do carrinho.
 * Esta função foi adaptada para funcionar com o backend existente,
 * que possui endpoints separados para itens e valor total.
 */
export const listarCarrinho = async () => {
  try {
    // Faz duas chamadas em paralelo para os endpoints de itens e total
    const [itensResponse, totalResponse] = await Promise.all([
      api.get("/carrinho"),
      api.get("/carrinho/total"),
    ]);

    // Processa a resposta dos itens do carrinho
    let itens = [];
    // O status 204 significa "No Content" (carrinho vazio), então a resposta não tem corpo
    if (itensResponse.status !== 204) {
      itens = itensResponse.data;
    }

    // Processa a resposta do valor total
    let valorTotal = 0;
    if (totalResponse.status !== 204) {
      valorTotal = totalResponse.data;
    }

    // Monta o objeto de carrinho unificado que o resto do frontend espera
    const carrinhoCompleto = {
      itens: itens || [], // Garante que seja sempre um array
      valorTotal: Number(valorTotal) || 0, // Garante que seja sempre um número
      totalItens: (itens || []).reduce((total, item) => total + Number(item.quantidade || 1), 0), // Soma as quantidades
    };
    console.log(carrinhoCompleto)

    return {
      sucesso: true,
      carrinho: carrinhoCompleto,
      mensagem: "Carrinho carregado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao listar o carrinho:", error);
    return tratarErro(error);
  }
};

/**
 * Adiciona um produto ao carrinho.
 * Adaptado para chamar o endpoint do backend da forma correta (ID na URL, sem corpo).
 * @param {object} produto - O objeto do produto a ser adicionado.
 * @param {number} quantidade - A quantidade (atualmente ignorada pelo backend).
 */
export const adicionarAoCarrinho = async (produto, quantidade = 1) => {
  try {
    // Validações rápidas no cliente
    if (!produto || !produto.id) {
      return {
        sucesso: false,
        mensagem:
          "Produto inválido ou sem ID. Não é possível adicionar ao carrinho.",
      };
    }

    // Não adiciona produto sem estoque
    if (typeof produto.quantidade === "number" && produto.quantidade <= 0) {
      return {
        sucesso: false,
        mensagem: "Não é possível adicionar ao carrinho: produto sem estoque.",
      };
    }

    const qty = Number(quantidade) || 1;
    if (qty <= 0) {
      return {
        sucesso: false,
        mensagem: "Quantidade inválida.",
      };
    }

    // Preferir chamar endpoint atômico de quantidade quando disponível
    if (qty > 1) {
      const url = `/carrinho/adicionar/${produto.id}/${qty}`;
      console.debug(`[carrinho] POST ${url} (atomic)`);
      
      try {
        await api.post(url);
      } catch (error) {
        // Fallback para chamadas unitárias caso o endpoint não exista ou falhe
        console.warn(
          `[carrinho] atomic add failed, falling back to unit loop (${error.response?.status})`
        );
        // fallback: try looping single adds
        for (let i = 0; i < qty; i++) {
          const urlSingle = `/carrinho/adicionar/${produto.id}`;
          console.debug(
            `[carrinho] POST ${urlSingle} (attempt ${i + 1}/${qty})`
          );
          await api.post(urlSingle);
        }
      }
    } else {
      // Single unit — chama endpoint tradicional
      const url = `/carrinho/adicionar/${produto.id}`;
      console.debug(`[carrinho] POST ${url} (single)`);
      await api.post(url);
    }

    // Depois de executar as chamadas, buscamos o estado atualizado do carrinho
    return await listarCarrinho();
  } catch (error) {
    console.error("Erro ao adicionar produto ao carrinho:", error);
    return tratarErro(error);
  }
};

/**
 * Remove um produto do carrinho pelo seu ID.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
export const removerDoCarrinho = async (produtoId) => {
  try {
    await api.delete(`/carrinho/remover/${produtoId}`);

    // A resposta de remoção também é vazia, então buscamos o carrinho novamente
    // para que a interface do usuário seja atualizada corretamente.
    return await listarCarrinho();
  } catch (error) {
    console.error("Erro ao remover produto do carrinho:", error);
    return tratarErro(error);
  }
};

/**
 * Incrementa a quantidade de um produto no carrinho (+1).
 * @param {number} produtoId - O ID do produto.
 */
export const incrementarQuantidade = async (produtoId) => {
  try {
    await api.post(`/carrinho/adicionar/${produtoId}`);
    return await listarCarrinho();
  } catch (error) {
    console.error("Erro ao incrementar quantidade:", error);
    return tratarErro(error);
  }
};

/**
 * Decrementa a quantidade de um produto no carrinho (-1).
 * Se a quantidade for 1, remove o item completamente.
 * @param {number} produtoId - O ID do produto.
 * @param {number} quantidadeAtual - A quantidade atual do item.
 */
export const decrementarQuantidade = async (produtoId, quantidadeAtual) => {
  try {
    if (quantidadeAtual <= 1) {
      // Se quantidade é 1, remover o item
      return await removerDoCarrinho(produtoId);
    }

    // Remover item e re-adicionar com quantidade-1
    await api.delete(`/carrinho/remover/${produtoId}`);
    await api.post(`/carrinho/adicionar/${produtoId}/${quantidadeAtual - 1}`);

    return await listarCarrinho();
  } catch (error) {
    console.error("Erro ao decrementar quantidade:", error);
    return tratarErro(error);
  }
};
