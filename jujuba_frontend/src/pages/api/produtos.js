import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/produtos'; // url base para produtos

export default async function handler(req, res) {
  const { method, body, query } = req;

  try {
    if (method === 'GET') {
     
      const response = await axios.get(BASE_URL);
      return res.status(200).json(response.data); 

    } else if (method === 'POST') {
 
      const response = await axios.post(BASE_URL, body);
      return res.status(201).json(response.data); 

    } else if (method === 'PUT') {
     
      const { id, ...data } = body; 
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return res.status(200).json(response.data); 

    } else if (method === 'DELETE') {
      
      const { id } = query; 
      await axios.delete(`${BASE_URL}/${id}`);
      return res.status(204).end(); 

    } else {
    
      return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).end();
    }
  } catch (error) {
   
    console.error(error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}
