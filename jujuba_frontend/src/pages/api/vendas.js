import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/vendas';

export const finalizarVendaSimples = async (produtos) => {
  return await axios.post(`${BASE_URL}/finalizar`, {
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

export const finalizarVendaFornecedora = async (fornecedoraId, produtos) => {
  return await axios.post(`${BASE_URL}/finalizar/fornecedora/${fornecedoraId}`, {
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

export const listarTodasVendas = async () => {
  return await axios.get(`${BASE_URL}`);
};

export const buscarVendaPorId = async (id) => {
  return await axios.get(`${BASE_URL}/${id}`);
};
