import formidable from 'formidable';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/fornecedoras';

export const config = {
  api: {
    bodyParser: false, // desabilita o body parser para aceitar multipart/form-data
  },
};

export default async function handler(req, res) {
  const { method } = req;

  
  const form = new formidable.IncomingForm();

 
  form.uploadDir = './tmp';
  form.keepExtensions = true; 
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar os dados do formulário:', err);
      return res.status(500).json({ message: 'Erro ao processar os dados' });
    }

    try {
      
      if (method === 'GET') {
        const response = await axios.get(BASE_URL);
        return res.status(200).json(response.data);

      
      } else if (method === 'POST') {
        const fornecedorData = JSON.parse(fields.fornecedora[0]); 
        const contratoUrl = files.contratoUrl ? files.contratoUrl[0].filepath : null;

        
        const data = {
          ...fornecedorData,
          contratoUrl, // aqui você pode usar o caminho ou URL do arquivo
        };

        const response = await axios.post(BASE_URL, data);
        return res.status(201).json(response.data); 

      } else if (method === 'PUT') {
        const { id, ...data } = fields; 
        const response = await axios.put(`${BASE_URL}/${id}`, data);
        return res.status(200).json(response.data); 

      } else if (method === 'DELETE') {
        const { id } = req.query; 
        await axios.delete(`${BASE_URL}/${id}`);
        return res.status(204).end(); 

      } else {
       
        return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).end();
      }
    } catch (error) {
      
      console.error(error);
      return res.status(error.response?.status || 500).json({ message: error.message });
    }
  });
}
export const editarFornecedora = async (id, fornecedoraData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {   //// aqui pode mudar, depende do nome da rota
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fornecedoraData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar fornecedora.');
    }

    const data = await response.json();

    return {
      id: data.id,
      nome: data.nome,
      contato: data.contato,
      endereco: data.endereco,
      chavePix: data.chavePix,
      contratoUrl: data.contratoUrl,
      dataNascimento: data.dataNascimento,
    };
  } catch (error) {
    console.error('Erro ao editar fornecedora:', error);
    throw error;
  }
};

export const buscarFornecedoras = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return {
      sucesso: true,
      mensagem: 'Fornecedoras buscadas com sucesso.',
      quantidade: response.data.length,
      fornecedoras: response.data.map(f => ({
        id: f.id,
        nome: f.nome,
        contato: f.contato,
        endereco: f.endereco,
        chavePix: f.chavePix,
        contratoUrl: f.contratoUrl,
        dataNascimento: f.dataNascimento
      }))
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao buscar fornecedoras.',
      erro: error.response?.data || error.message
    };
  }
};