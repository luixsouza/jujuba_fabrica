import axios from "axios"

const BASE_URL = 'http://localhost:8080/api/carrinho';

export const adicionarAoCarrinho = async (produto, quantidade = 1 ) => {
  try {
    // CORREÇÃO AQUI: produtoId enviado como variável de caminho
    const response = await axios.post(`${BASE_URL}/adicionar/${produto.id}`);

    // Após adicionar, o backend retorna um 200 OK sem corpo.
    // Para ter o estado atualizado do carrinho, precisamos listá-lo novamente.
    const updatedCart = await listarCarrinho();
    return updatedCart;

  } catch (error) {
    return tratarErro(error);
  }
};

export const removerDoCarrinho = async (produtoId) => {
  try {
    // URL correta para o backend
    await axios.delete(`${BASE_URL}/remover/${produtoId}`);

    // Após remover, o backend retorna um 200 OK sem corpo.
    // Para ter o estado atualizado do carrinho, precisamos listá-lo novamente.
    const updatedCart = await listarCarrinho();
    return updatedCart;

  } catch (error) {
    return tratarErro(error);
  }
};

export const listarCarrinho = async () => {
  try {
    // CORREÇÃO AQUI: A URL do backend para listar é apenas BASE_URL
    const response = await axios.get(BASE_URL);

    // O backend retorna diretamente uma List<Produto>.
    // Precisamos mapear isso para a estrutura de carrinho esperada no frontend.
    const produtosNoCarrinho = response.data; // Isso será um array de objetos Produto

    let valorTotal = 0;
    const itensFormatados = produtosNoCarrinho.map(p => {
      valorTotal += p.preco; // Soma o preço para o total
      return {
        produto: { // Mapeia as propriedades do Produto para a estrutura esperada
          id: p.id,
          descricao: p.descricao,
          preco: p.preco,
          marca: p.marca,
          tamanho: p.tamanho,
          estadoConservacao: p.estadoConservacao,
          imagemUrl: p.imagemUrl,
          fornecedoraId: p.fornecedoraId,
          genero: p.genero, // Adicionado gênero, se existir no seu modelo Produto
          lote: p.lote, // Adicionado lote, se existir no seu modelo Produto
          // Adicione outras propriedades do Produto que você usa no frontend
        },
        quantidade: 1, // O backend adiciona um produto por vez, então a quantidade é 1
        precoUnitario: p.preco,
        subtotal: p.preco,
      };
    });

    return {
      sucesso: true,
      carrinho: {
        id: "carrinho-unico", // ID fictício, pois o backend não gerencia um ID de carrinho
        itens: itensFormatados,
        totalItens: itensFormatados.length,
        valorTotal: valorTotal, // Total calculado
      }
    };
  } catch (error) {
    return tratarErro(error);
  }
};

export const limparCarrinho = async () => {
  try {
    // CORREÇÃO AQUI: Assumindo que você adicionará o endpoint /limpar no backend
    await axios.post(`${BASE_URL}/limpar`);

    // Após limpar, o backend retorna um 200 OK sem corpo.
    // Para ter o estado atualizado do carrinho, precisamos listá-lo novamente.
    const updatedCart = await listarCarrinho();
    return updatedCart;

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
