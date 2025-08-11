const BASE_URL = "http://localhost:8080/api/vendas"

const tratarErro = (error ) => {
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      sucesso: false,
      mensagem: "Erro de conexão com o servidor.",
      detalhes: error.message,
    }
  } else if (error.message.includes("HTTP error")) {
    return {
      sucesso: false,
      mensagem: "Erro ao processar requisição.",
      status: error.message.match(/\d+/)?.[0],
      detalhes: error.message,
    }
  } else {
    return {
      sucesso: false,
      mensagem: "Erro desconhecido.",
      detalhes: error.message,
    }
  }
}

export const listarVendasRealizadas = async () => {
  try {
    // ATENÇÃO: Seu VendaController não parece ter a rota "/realizadas".
    // O endpoint para listar todas as vendas é GET /api/vendas.
    // Se "/realizadas" for um alias ou filtro, mantenha. Senão, remova.
    const response = await fetch(`${BASE_URL}`, { // Ajustado para o endpoint principal
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      sucesso: true,
      vendas: data,
      mensagem: "Vendas carregadas com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao listar vendas realizadas:", error)
    return {
      sucesso: false,
      vendas: [],
      mensagem: "Erro ao carregar vendas",
    }
  }
}

export const buscarVendaPorId = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      sucesso: true,
      venda: data,
      mensagem: "Venda encontrada com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao buscar venda por ID:", error)
    return {
      sucesso: false,
      venda: null,
      mensagem: "Erro ao buscar venda",
    }
  }
}

export const finalizarVendaFornecedora = async (fornecedoraId) => {
  try {
    // Ajustado para o endpoint correto do seu VendaController
    const response = await fetch(`${BASE_URL}/finalizar/fornecedora/${fornecedoraId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // O corpo foi removido pois o backend não espera um para esta ação
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      sucesso: true,
      venda: data,
      mensagem: "Venda finalizada com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao finalizar venda:", error)
    return {
      sucesso: false,
      mensagem: "Erro ao finalizar venda",
    }
  }
}

export const criarVenda = async (dadosVenda) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosVenda),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      sucesso: true,
      venda: data,
      mensagem: "Venda criada com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao criar venda:", error)
    return {
      sucesso: false,
      mensagem: "Erro ao criar venda",
    }
  }
}

export const atualizarVenda = async (id, dadosVenda) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosVenda),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      sucesso: true,
      venda: data,
      mensagem: "Venda atualizada com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao atualizar venda:", error)
    return {
      sucesso: false,
      mensagem: "Erro ao atualizar venda",
    }
  }
}

export const excluirVenda = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return {
      sucesso: true,
      mensagem: "Venda excluída com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao excluir venda:", error)
    return {
      sucesso: false,
      mensagem: "Erro ao excluir venda",
    }
  }
}

// ==================================================================
// **INÍCIO DA CORREÇÃO: Função que estava faltando**
// ==================================================================

/**
 * Finaliza a venda atual do carrinho (venda simples).
 * Esta função chama o endpoint POST /api/vendas/finalizar/simples.
 */
export const finalizarVendaSimples = async () => {
  try {
    // A URL correta, de acordo com o seu VendaController.java
    const response = await fetch(`${BASE_URL}/finalizar/simples`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Não precisa de corpo, pois o backend já sabe qual é o carrinho da sessão.
    });

    if (!response.ok) {
      const erroData = await response.json().catch(() => null);
      const mensagemErro = erroData?.mensagem || `Erro no servidor (status: ${response.status})`;
      throw new Error(mensagemErro);
    }

    // O backend retorna a venda criada, então podemos processá-la.
    const data = await response.json();

    return {
      sucesso: true,
      venda: data,
      mensagem: "Venda finalizada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao finalizar venda simples:", error);
    return {
      sucesso: false,
      mensagem: error.message || "Não foi possível finalizar a venda.",
    };
  }
};