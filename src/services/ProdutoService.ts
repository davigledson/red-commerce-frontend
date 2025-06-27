import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/produtos';

interface Produto {
  id?: string;
  nome: string;
  descricao: string;
  preco: number | string;
  estoque: number;
  destaque: boolean;
  ativo: boolean;
  categoria_id: number;
  created_at?: string;
  updated_at?: string;
}

export default class ProdutoService {
  private static axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  static async listarTodos(): Promise<Produto[]> {
    try {
      const response = await this.axiosInstance.get('/');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao buscar produtos');
      throw error;
    }
  }

  static async buscarPorId(id: string): Promise<Produto> {
    try {
      const response = await this.axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar produto ID ${id}`);
      throw error;
    }
  }

  static async criar(produto: Omit<Produto, 'id'>): Promise<Produto> {
    try {
      const response = await this.axiosInstance.post('/', produto);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao criar produto');
      throw error;
    }
  }

  static async atualizar(id: string, produto: Produto): Promise<Produto> {
    try {
      const response = await this.axiosInstance.put(`/${id}`, produto);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar produto ID ${id}`);
      throw error;
    }
  }

  static async atualizarParcial(id: string, updates: Partial<Produto>): Promise<Produto> {
    try {
      const response = await this.axiosInstance.patch(`/${id}`, updates);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar parcialmente produto ID ${id}`);
      throw error;
    }
  }

  static async deletar(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/${id}`);
    } catch (error) {
      this.handleError(error, `Erro ao deletar produto ID ${id}`);
      throw error;
    }
  }

  private static handleError(error: unknown, message: string): void {
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
