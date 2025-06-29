// services/BaseService.js
import axios from 'axios';

// Certifique-se de que esta URL base está correta para o seu backend
const BASE_API_URL = 'http://localhost:3000/api/v1';

export default abstract class BaseService {
  protected static createAxiosInstance(endpoint: string ) {
    const instance = axios.create({
      baseURL: `${BASE_API_URL}/${endpoint}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    // Adiciona um interceptor para incluir o token JWT em cada requisição
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken'); // Pega o token do localStorage
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
  }

  protected static handleError(error: unknown, message: string) {
    if (axios.isAxiosError(error)) {
      console.error(`${message}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error(`${message}:`, error);
    }
  }
}
