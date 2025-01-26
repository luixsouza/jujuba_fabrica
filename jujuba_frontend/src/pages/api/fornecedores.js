import formidable from 'formidable';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/fornecedoras'; // URL base

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
