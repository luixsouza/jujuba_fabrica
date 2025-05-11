import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/lotes';

export const salvarLote = async (fornecedoraId, produtos) => {
  return await axios.post(`${BASE_URL}`, {
    fornecedora: {
      id: fornecedoraId
    },
    produtos: produtos.map((produto) => ({
      descricao: produto.descricao,
      marca: produto.marca,
      tamanho: produto.tamanho,
      estadoConservacao: produto.estadoConservacao,
      genero: produto.genero,
      preco: produto.preco,
      quantidade: produto.quantidade
    }))
  });
};

export const listarLotes = async () => {
  return await axios.get(`${BASE_URL}`);
};

export const buscarLotePorId = async (id) => {
  return await axios.get(`${BASE_URL}/${id}`);
};

export const atualizarLote = async (id, fornecedoraId, produtos) => {
  return await axios.put(`${BASE_URL}/${id}`, {
    fornecedora: {
      id: fornecedoraId
    },
    produtos: produtos.map((produto) => ({
      id: produto.id,
      descricao: produto.descricao,
      marca: produto.marca,
      tamanho: produto.tamanho,
      estadoConservacao: produto.estadoConservacao,
      genero: produto.genero,
      preco: produto.preco,
      quantidade: produto.quantidade
    }))
  });
};

export const deletarLote = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
