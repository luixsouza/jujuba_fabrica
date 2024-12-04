import axios from "axios";

// Configuração da instância Axios
const api = axios.create({
  baseURL: "http://localhost:8080/api/fornecedoras",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptadores para tratamento de erros e requisições
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na resposta da API:", error.response || error);
    return Promise.reject(error);
  }
);

export default api;
