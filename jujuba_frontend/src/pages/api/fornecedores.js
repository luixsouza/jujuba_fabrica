import axios from "axios"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

export const config = {
  api: {
    bodyParser: true, // habilitando bodyParser padrão
  },
}

export default async function handler(req, res) {
  const { method } = req

  try {
    if (method === "GET") {
      const response = await axios.get(BASE_URL)
      return res.status(200).json(response.data)
    } else if (method === "POST") {
      const response = await axios.post(BASE_URL, req.body)
      return res.status(201).json(response.data)
    } else if (method === "PUT") {
      const { id, ...data } = req.body

      if (!id) {
        return res.status(400).json({
          message: "ID da fornecedora é obrigatório para atualização",
          success: false,
        })
      }

      console.log("[v0] Updating fornecedora:", { id, data })
      const response = await axios.put(`${BASE_URL}/${id}`, data)
      return res.status(200).json(response.data)
    } else if (method === "DELETE") {
      const { id } = req.query
      await axios.delete(`${BASE_URL}/${id}`)
      return res.status(204).end()
    } else {
      return res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]).status(405).end()
    }
  } catch (error) {
    console.error("[v0] Erro na API de fornecedores:", error)
    console.error("[v0] Error details:", error.response?.data)
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message,
      success: false,
    })
  }
}

export const editarFornecedora = async (id, fornecedoraData) => {
  try {
    console.log("[v0] editarFornecedora called with:", { id, fornecedoraData })

    const response = await fetch(`/api/fornecedores`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        ...fornecedoraData,
      }),
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (!response.ok) {
      const errorData = await response.json()
      console.log("[v0] Error response data:", errorData)
      throw new Error(errorData.message || "Erro ao atualizar fornecedora.")
    }

    const data = await response.json()
    console.log("[v0] Success response data:", data)

    return {
      id: data.id,
      nome: data.nome,
      contato: data.contato,
      endereco: data.endereco,
      chavePix: data.chavePix,
      contratoUrl: data.contratoUrl,
      dataNascimento: data.dataNascimento,
      creditoLoja: data.creditoLoja,
    }
  } catch (error) {
    console.error("[v0] Erro ao editar fornecedora:", error)
    throw error
  }
}

export const buscarFornecedoras = async () => {
  try {
    const response = await axios.get(BASE_URL)
    return {
      sucesso: true,
      mensagem: "Fornecedoras buscadas com sucesso.",
      quantidade: response.data.length,
      fornecedoras: response.data.map((f) => ({
        id: f.id,
        nome: f.nome,
        contato: f.contato,
        endereco: f.endereco,
        chavePix: f.chavePix,
        contratoUrl: f.contratoUrl,
        dataNascimento: f.dataNascimento,
      })),
    }
  } catch (error) {
    return {
      sucesso: false,
      mensagem: "Erro ao buscar fornecedoras.",
      erro: error.response?.data || error.message,
    }
  }
}
