import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/fornecedoras'; // URL base

export default async function handler(req, res) {
  const { method, body, query } = req;

  try {
    if (method === 'GET') {
      // GET: Buscar todos os fornecedores
      const response = await axios.get(BASE_URL);
      return res.status(200).json(response.data); // Retorna todos os fornecedores

    } else if (method === 'POST') {
      // POST: Criar novo fornecedor
      const response = await axios.post(BASE_URL, body);
      return res.status(201).json(response.data); // Retorna o fornecedor criado

    } else if (method === 'PUT') {
      // PUT: Atualizar fornecedor
      const { id, ...data } = body; // Certifique-se de enviar o ID no corpo da requisição
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return res.status(200).json(response.data); // Retorna o fornecedor atualizado

    } else if (method === 'DELETE') {
      // DELETE: Excluir fornecedor
      const { id } = query; // Certifique-se de enviar o ID na query (como parâmetro na URL)
      await axios.delete(`${BASE_URL}/${id}`);
      return res.status(204).end(); // Retorna status 204 (sem conteúdo), indicando sucesso na exclusão

    } else {
      // Método não permitido
      return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).end();
    }
  } catch (error) {
    // Erro na execução
    console.error(error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}
