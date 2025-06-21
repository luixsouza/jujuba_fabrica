import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/vendas';

// Função auxiliar para tratar erros da API
const tratarErro = (error ) => {
  if (error.response) {
    // O servidor respondeu com um status diferente de 2xx
    console.error("Erro na resposta da API:", error.response.data);
    return {
      sucesso: false,
      mensagem: error.response.data.message || 'Erro ao processar requisição.',
      status: error.response.status,
      detalhes: error.response.data,
    };
  } else if (error.request) {
    // A requisição foi feita, mas nenhuma resposta foi recebida
    console.error("Nenhuma resposta do servidor:", error.request);
    return {
      sucesso: false,
      mensagem: 'Servidor não respondeu. Verifique a conexão.',
      detalhes: error.request,
    };
  } else {
    // Algo aconteceu na configuração da requisição que disparou um erro
    console.error("Erro ao configurar requisição:", error.message);
    return {
      sucesso: false,
      mensagem: 'Erro desconhecido ao fazer requisição.',
      detalhes: error.message,
    };
  }
};

/**
 * Finaliza uma venda simples com os itens atualmente no carrinho.
 * @returns {Promise<{sucesso: boolean, venda?: object, mensagem?: string, status?: number, detalhes?: any}>}
 */
export const finalizarVendaSimples = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/finalizar/simples`);
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


/**
 * Finaliza uma venda com os itens atualmente no carrinho para uma fornecedora específica.
 * @param {number} fornecedoraId - O ID da fornecedora.
 * @returns {Promise<{sucesso: boolean, venda?: object, mensagem?: string, status?: number, detalhes?: any}>}
 */
export const finalizarVendaFornecedora = async (fornecedoraId) => {
  try {
    const response = await axios.post(`${BASE_URL}/finalizar/fornecedora/${fornecedoraId}`);
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


/**
 * Lista todas as vendas realizadas, formatando-as como uma lista de produtos vendidos.
 * Esta função "achata" a estrutura de vendas para que cada item vendido seja uma entrada na lista.
 * @returns {Promise<{sucesso: boolean, vendas?: Array<object>, mensagem?: string, status?: number, detalhes?: any}>}
 */
export const listarVendasRealizadas = async () => { // Renomeado de listarVendas para listarVendasRealizadas
  try {
    const response = await axios.get(`${BASE_URL}`);
    const vendas = response.data; // Isso é uma List<Venda> do backend

    const produtosVendidosFormatados = [];
    vendas.forEach(venda => {
      if (venda.itensVendidos && Array.isArray(venda.itensVendidos)) {
        venda.itensVendidos.forEach(item => {
          // Mapeia o item vendido para o formato esperado na tabela da VendasPage
          // Certifique-se de que 'item.produto' contém todos os campos necessários (marca, tamanho, genero, estadoConservacao)
          // Se o backend não retornar esses campos diretamente no 'item.produto', eles aparecerão como '-'
          produtosVendidosFormatados.push({
            id: item.produto.id, // ID do produto
            descricao: item.produto.descricao,
            marca: item.produto.marca || '-', // Adicionado marca
            tamanho: item.produto.tamanho || '-', // Adicionado tamanho
            genero: item.produto.genero || '-', // Adicionado genero
            estadoConservacao: item.produto.estadoConservacao,
            quantidade: item.quantidade, // Quantidade vendida (do item da venda)
            preco: item.produto.preco, // Preço do produto no momento da venda
            vendaId: venda.id, // ID da venda a que este produto pertence
            dataVenda: venda.dataVenda, // Data da venda
          });
        });
      }
    });

    return {
      sucesso: true,
      vendas: produtosVendidosFormatados,
      mensagem: "Histórico de vendas carregado com sucesso."
    };
  } catch (error) {
    return tratarErro(error);
  }
};


/**
 * Busca uma venda específica por ID.
 * @param {number} id - O ID da venda.
 * @returns {Promise<{sucesso: boolean, venda?: object, mensagem?: string, status?: number, detalhes?: any}>}
 */
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