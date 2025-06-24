const BASE_URL = "http://localhost:8080/api/vendas"

const tratarErro = (error) => {
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
    const response = await fetch(`${BASE_URL}/realizadas`, {
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

export const finalizarVendaFornecedora = async (fornecedoraId, itens) => {
  try {
    const response = await fetch(`${BASE_URL}/finalizar-fornecedora`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fornecedoraId,
        itens,
      }),
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
