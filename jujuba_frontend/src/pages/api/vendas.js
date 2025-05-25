import axios from '../config/axios';

const BASE_URL = 'http://localhost:8080/api/vendas';


export const finalizarVendaSimples = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/simples`);
    const venda = response.data;

    return {
      sucesso: true,
      venda: {
        id: venda.id,
        dataVenda: venda.dataVenda,
        tipoVenda: venda.tipoVenda,
        total: venda.total,
        valorBrecho: venda.valorBrecho,
        valorFornecedora: venda.valorFornecedora,
        itens: venda.itens.map(item => ({
          produto: {
            id: item.produto.id,
            descricao: item.produto.descricao,
            preco: item.produto.preco,
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        }))
      }
    };
  } catch (error) {
    return tratarErro(error);
  }
};


export const finalizarVendaFornecedora = async (fornecedoraId) => {
  try {
    const response = await axios.post(`${BASE_URL}/fornecedora/${fornecedoraId}`);
    const venda = response.data;

    return {
      sucesso: true,
      venda: {
        id: venda.id,
        dataVenda: venda.dataVenda,
        tipoVenda: venda.tipoVenda,
        total: venda.total,
        valorBrecho: venda.valorBrecho,
        valorFornecedora: venda.valorFornecedora,
        fornecedora: {
          id: venda.fornecedora.id,
          nome: venda.fornecedora.nome,
          cnpj: venda.fornecedora.cnpj
        },
        itens: venda.itens.map(item => ({
          produto: {
            id: item.produto.id,
            descricao: item.produto.descricao,
            preco: item.produto.preco,
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        }))
      }
    };
  } catch (error) {
    return tratarErro(error);
  }
};


export const listarVendas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    const vendas = response.data;

    return {
      sucesso: true,
      vendas: vendas.map(venda => ({
        id: venda.id,
        dataVenda: venda.dataVenda,
        tipoVenda: venda.tipoVenda,
        total: venda.total,
        valorBrecho: venda.valorBrecho,
        valorFornecedora: venda.valorFornecedora,
        fornecedora: venda.fornecedora ? {
          id: venda.fornecedora.id,
          nome: venda.fornecedora.nome,
          cnpj: venda.fornecedora.cnpj
        } : null,
        itens: venda.itens.map(item => ({
          produto: {
            id: item.produto.id,
            descricao: item.produto.descricao,
            preco: item.produto.preco,
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        }))
      }))
    };
  } catch (error) {
    return tratarErro(error);
  }
};


export const buscarVendaPorId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    const venda = response.data;

    return {
      sucesso: true,
      venda: {
        id: venda.id,
        dataVenda: venda.dataVenda,
        tipoVenda: venda.tipoVenda,
        total: venda.total,
        valorBrecho: venda.valorBrecho,
        valorFornecedora: venda.valorFornecedora,
        fornecedora: venda.fornecedora ? {
          id: venda.fornecedora.id,
          nome: venda.fornecedora.nome,
          cnpj: venda.fornecedora.cnpj
        } : null,
        itens: venda.itens.map(item => ({
          produto: {
            id: item.produto.id,
            descricao: item.produto.descricao,
            preco: item.produto.preco,
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        }))
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
      mensagem: error.response.data.message || 'erro ao processar requisicao.',
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
