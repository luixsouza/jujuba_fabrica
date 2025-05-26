import axios from '../config/axios';

const BASE_URL = 'http://localhost:8080/api/carrinho';

export const adicionarAoCarrinho = async (produto, quantidade = 1) => {
  try {
    const response = await axios.post(`${BASE_URL}/adicionar`, {
      produtoId: produto.id,
      quantidade
    });

    const carrinho = response.data;

    return {
      sucesso: true,
      carrinho: {
        id: carrinho.id,
        itens: carrinho.itens.map(item => ({
          produto: {
            id: item.produto.id,
            descricao: item.produto.descricao,
            preco: item.produto.preco,
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        })),
        totalItens: carrinho.totalItens,
        valorTotal: carrinho.valorTotal,
      }
    };
  } catch (error) {
    return tratarErro(error);
  }
};

export const removerDoCarrinho = async (produtoId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/remover/${produtoId}`);
    const carrinho = response.data;

    return {
      sucesso: true,
      carrinho: {
        id: carrinho.id,
        itens: carrinho.itens.map(item => ({
          produto: {
            id: item.produto.id,
            descricao: item.produto.descricao,
            preco: item.produto.preco,
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        })),
        totalItens: carrinho.totalItens,
        valorTotal: carrinho.valorTotal,
      }
    };
  } catch (error) {
    return tratarErro(error);
  }
};

export const listarCarrinho = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/listar`);
    const carrinho = response.data;

    return {
      sucesso: true,
      carrinho: {
        id: carrinho.id,
        itens: carrinho.itens.map(item => ({
          produto: {
            id: item.produto.id,
            descricao: item.produto.descricao,
            preco: item.produto.preco,
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        })),
        totalItens: carrinho.totalItens,
        valorTotal: carrinho.valorTotal,
      }
    };
  } catch (error) {
    return tratarErro(error);
  }
};

export const limparCarrinho = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/limpar`);
    const carrinho = response.data;

    return {
      sucesso: true,
      carrinho: {
        id: carrinho.id,
        itens: [],
        totalItens: 0,
        valorTotal: 0,
      }
    };
  } catch (error) {
    return tratarErro(error);
  }
};

const tratarErro = (error) => {
  if (error.response) {
    return {
      sucesso: false,
      mensagem: error.response.data.message || 'Erro ao processar requisição.',
      status: error.response.status,
      detalhes: error.response.data,
    };
  } else if (error.request) {
    return {
      sucesso: false,
      mensagem: 'Servidor não respondeu.',
      detalhes: error.request,
    };
  } else {
    return {
      sucesso: false,
      mensagem: 'Erro desconhecido.',
      detalhes: error.message,
    };
  }
};
