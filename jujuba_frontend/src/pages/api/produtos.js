import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/produtos'; // url base para produtos

export default async function handler(req, res) {
  const { method, body, query } = req;

  try {
    if (method === 'GET') {
     
      const response = await axios.get(BASE_URL);
      return res.status(200).json(response.data); 

    } else if (method === 'POST') {
 
      const response = await axios.post(BASE_URL, body);
      return res.status(201).json(response.data); 

    } else if (method === 'PUT') {
     
      const { id, ...data } = body; 
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return res.status(200).json(response.data); 

    } else if (method === 'DELETE') {
      
      const { id } = query; 
      await axios.delete(`${BASE_URL}/${id}`);
      return res.status(204).end(); 

    } else {
    
      return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).end();
    }
  } catch (error) {
   
    console.error(error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}


export const listarProdutos = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return {
      sucesso: true,
      mensagem: 'produtos listados com sucesso.',
      quantidade: response.data.length,
      produtos: response.data.map(p => ({
        id: p.id,
        descricao: p.descricao,
        marca: p.marca,
        tamanho: p.tamanho,
        estadoConservacao: p.estadoConservacao,
        preco: p.preco,
        imagemUrl: p.imagemUrl, // supondo que o backend retorne isso
        fornecedoraId: p.fornecedoraId
      }))
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao listar produtos.',
      erro: error.response?.data || error.message
    };
  }
};

export const buscarProdutoPorId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    const p = response.data;///
    return {
      sucesso: true,
      mensagem: `Produto com ID ${id} encontrado.`,
      produto: {
        id: p.id,
        descricao: p.descricao,
        marca: p.marca,
        tamanho: p.tamanho,
        estadoConservacao: p.estadoConservacao,
        preco: p.preco,
        imagemUrl: p.imagemUrl,
        fornecedoraId: p.fornecedoraId
      }
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: `Erro ao buscar produto com ID ${id}.`,
      erro: error.response?.data || error.message
    };
  }
};

export const excluirProduto = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return {
      sucesso: true,
      mensagem: `Produto com ID ${id} excluído com sucesso.`
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: `Erro ao excluir produto com ID ${id}.`,
      erro: error.response?.data || error.message
    };
  }
};