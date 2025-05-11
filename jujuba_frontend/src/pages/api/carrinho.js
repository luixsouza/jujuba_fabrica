import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/carrinho'; 

export const adicionarProdutoAoCarrinho = async (produtoId) => {
  return await axios.post(`${BASE_URL}/adicionar/${produtoId}`);
};

export const removerProdutoDoCarrinho = async (produtoId) => {
  return await axios.delete(`${BASE_URL}/remover/${produtoId}`);
};

export const listarProdutosDoCarrinho = async () => {
  const response = await axios.get(`${BASE_URL}/produtos`);
  return response.data;
};

export const calcularTotalCarrinho = async () => {
  const response = await axios.get(`${BASE_URL}/total`);
  return response.data; 
};

export const limparCarrinho = async () => {
  return await axios.delete(`${BASE_URL}/limpar`);
};
