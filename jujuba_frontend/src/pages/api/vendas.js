import api from "../../utils/api";

const tratarErro = (error) => {
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      sucesso: false,
      mensagem: "Erro de conexão com o servidor.",
      detalhes: error.message,
    };
  } else if (error.message.includes("HTTP error")) {
    return {
      sucesso: false,
      mensagem: "Erro ao processar requisição.",
      status: error.message.match(/\d+/)?.[0],
      detalhes: error.message,
    };
  } else {
    return {
      sucesso: false,
      mensagem: "Erro desconhecido.",
      detalhes: error.message,
    };
  }
};

export const listarVendasRealizadas = async () => {
  try {
    // ATENÇÃO: Seu VendaController não parece ter a rota "/realizadas".
    // O endpoint para listar todas as vendas é GET /api/vendas.
    // Se "/realizadas" for um alias ou filtro, mantenha. Senão, remova.
    const response = await api.get("/vendas");

    return {
      sucesso: true,
      vendas: response.data,
      mensagem: "Vendas carregadas com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao listar vendas realizadas:", error);
    return {
      sucesso: false,
      vendas: [],
      mensagem: "Erro ao carregar vendas",
    };
  }
};

export const buscarVendaPorId = async (id) => {
  try {
    const response = await api.get(`/vendas/${id}`);

    return {
      sucesso: true,
      venda: response.data,
      mensagem: "Venda encontrada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao buscar venda por ID:", error);
    return {
      sucesso: false,
      venda: null,
      mensagem: "Erro ao buscar venda",
    };
  }
};

export const finalizarVendaFornecedora = async (
  fornecedoraId,
  payments = { dinheiro: 0, cartao: 0, pix: 0 }
) => {
  try {
    // Body includes optional payments breakdown when supplier tops up
    const body = {
      fornecedoraId,
      pagamentos: {
        dinheiro: Number(payments.dinheiro) || 0,
        cartao: Number(payments.cartao) || 0,
        pix: Number(payments.pix) || 0,
      },
    };

    const response = await api.post(
      `/vendas/finalizar/fornecedora/${fornecedoraId}`,
      body
    );

    return {
      sucesso: true,
      venda: response.data,
      mensagem: "Venda finalizada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao finalizar venda:", error);
    return {
      sucesso: false,
      mensagem: error.message || "Erro ao finalizar venda",
    };
  }
};

export const criarVenda = async (dadosVenda) => {
  try {
    const response = await api.post("/vendas", dadosVenda);

    return {
      sucesso: true,
      venda: response.data,
      mensagem: "Venda criada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    return {
      sucesso: false,
      mensagem: "Erro ao criar venda",
    };
  }
};

export const atualizarVenda = async (id, dadosVenda) => {
  try {
    const response = await api.put(`/vendas/${id}`, dadosVenda);

    return {
      sucesso: true,
      venda: response.data,
      mensagem: "Venda atualizada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar venda:", error);
    return {
      sucesso: false,
      mensagem: "Erro ao atualizar venda",
    };
  }
};

export const excluirVenda = async (id) => {
  try {
    await api.delete(`/vendas/${id}`);

    return {
      sucesso: true,
      mensagem: "Venda excluída com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao excluir venda:", error);
    return {
      sucesso: false,
      mensagem: "Erro ao excluir venda",
    };
  }
};

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
    const response = await api.post("/vendas/finalizar/simples");

    // O backend retorna a venda criada, então podemos processá-la.
    return {
      sucesso: true,
      venda: response.data,
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
