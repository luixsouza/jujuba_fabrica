// Define a URL base para a API do carrinho no seu backend.
const BASE_URL = "http://localhost:8080/api/carrinho";

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
      fetch(BASE_URL, { method: "GET" }),
      fetch(`${BASE_URL}/total`, { method: "GET" }),
    ]);

    // Processa a resposta dos itens do carrinho
    let itens = [];
    // O status 204 significa "No Content" (carrinho vazio), então a resposta não tem corpo
    if (itensResponse.status !== 204) {
      if (!itensResponse.ok)
        throw new Error(`Erro ao buscar itens: ${itensResponse.status}`);
      itens = await itensResponse.json();
    }

    // Processa a resposta do valor total
    let valorTotal = 0;
    if (totalResponse.status !== 204) {
      if (!totalResponse.ok)
        throw new Error(`Erro ao buscar total: ${totalResponse.status}`);
      valorTotal = await totalResponse.json();
    }

    // Monta o objeto de carrinho unificado que o resto do frontend espera
    const carrinhoCompleto = {
      itens: itens || [], // Garante que seja sempre um array
      valorTotal: Number(valorTotal) || 0, // Garante que seja sempre um número
      totalItens: (itens || []).length, // Conta produtos únicos, não quantidades
    };

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
      const url = `${BASE_URL}/adicionar/${produto.id}/${qty}`;
      console.debug(`[carrinho] POST ${url} (atomic)`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        // Fallback para chamadas unitárias caso o endpoint não exista ou falhe
        console.warn(
          `[carrinho] atomic add failed, falling back to unit loop (${response.status})`
        );
        // fallback: try looping single adds
        for (let i = 0; i < qty; i++) {
          const urlSingle = `${BASE_URL}/adicionar/${produto.id}`;
          console.debug(
            `[carrinho] POST ${urlSingle} (attempt ${i + 1}/${qty})`
          );
          const resSingle = await fetch(urlSingle, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!resSingle.ok) {
            let mensagemErro = `Erro no servidor (status: ${resSingle.status} ${resSingle.statusText})`;
            try {
              const erroData = await resSingle.json().catch(() => null);
              if (erroData)
                mensagemErro =
                  erroData.mensagem ||
                  erroData.message ||
                  JSON.stringify(erroData);
            } catch (e) {
              try {
                mensagemErro = await resSingle.text();
              } catch (e2) {}
            }
            throw new Error(mensagemErro);
          }
        }
      }
    } else {
      // Single unit — chama endpoint tradicional
      const url = `${BASE_URL}/adicionar/${produto.id}`;
      console.debug(`[carrinho] POST ${url} (single)`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        let mensagemErro = `Erro no servidor (status: ${response.status} ${response.statusText})`;
        try {
          const erroData = await response.json().catch(() => null);
          if (erroData)
            mensagemErro =
              erroData.mensagem || erroData.message || JSON.stringify(erroData);
        } catch (e) {
          try {
            mensagemErro = await response.text();
          } catch (e2) {}
        }
        throw new Error(mensagemErro);
      }
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
    const response = await fetch(`${BASE_URL}/remover/${produtoId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Erro ao remover item: ${response.status}`);
    }

    // A resposta de remoção também é vazia, então buscamos o carrinho novamente
    // para que a interface do usuário seja atualizada corretamente.
    return await listarCarrinho();
  } catch (error) {
    console.error("Erro ao remover produto do carrinho:", error);
    return tratarErro(error);
  }
};
