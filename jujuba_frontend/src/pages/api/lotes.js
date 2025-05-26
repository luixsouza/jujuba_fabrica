const BASE_URL = 'http://localhost:8080/api/lotes';

export const createLote = async (loteData) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao cadastrar o lote.');
    }

    const data = await response.json();

    return {
      id: data.id,
      fornecedora: {
        id: data.fornecedora.id,
        nome: data.fornecedora.nome,
        contato: data.fornecedora.contato,
        endereco: data.fornecedora.endereco,
        chavePix: data.fornecedora.chavePix,
        contratoUrl: data.fornecedora.contratoUrl,
        dataNascimento: data.fornecedora.dataNascimento,
      },
      produtos: data.produtos.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade: produto.quantidade,
      })),
    };
  } catch (error) {
    console.error('Erro ao cadastrar lote:', error);
    throw error;
  }
};


export const getAllLotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar os lotes.');
    }

    const data = await response.json();

    return data.map((lote) => ({
      id: lote.id,
      fornecedora: {
        id: lote.fornecedora.id,
        nome: lote.fornecedora.nome,
      },
      produtos: lote.produtos.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
      })),
    }));
  } catch (error) {
    console.error('Erro ao listar lotes:', error);
    throw error;
  }
};


export const getLoteById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Lote não encontrado.');
    }

    const data = await response.json();

    return {
      id: data.id,
      fornecedora: {
        id: data.fornecedora.id,
        nome: data.fornecedora.nome,
        contato: data.fornecedora.contato,
        endereco: data.fornecedora.endereco,
        chavePix: data.fornecedora.chavePix,
        contratoUrl: data.fornecedora.contratoUrl,
        dataNascimento: data.fornecedora.dataNascimento,
      },
      produtos: data.produtos.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade: produto.quantidade,
      })),
    };
  } catch (error) {
    console.error('Erro ao buscar lote:', error);
    throw error;
  }
};


export const editLote = async (id, loteData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao editar o lote.');
    }

    const data = await response.json();

    return {
      id: data.id,
      fornecedora: {
        id: data.fornecedora.id,
        nome: data.fornecedora.nome,
        contato: data.fornecedora.contato,
        endereco: data.fornecedora.endereco,
        chavePix: data.fornecedora.chavePix,
        contratoUrl: data.fornecedora.contratoUrl,
        dataNascimento: data.fornecedora.dataNascimento,
      },
      produtos: data.produtos.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade: produto.quantidade,
      })),
    };
  } catch (error) {
    console.error('Erro ao editar lote:', error);
    throw error;
  }
};

export const deleteLote = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao deletar o lote.');
    }
    const data = await response.json();

    return {
      sucesso: true,
      mensagem: data.message || 'Lote deletado com sucesso.',
      idDeletado: id,
    };
  } catch (error) {
    console.error('Erro ao deletar lote:', error);
    throw error;
  }
};