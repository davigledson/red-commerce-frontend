import BaseService from './BaseService';

interface Carrinho {
  id?: number;
  usuario_id: number;
  created_at?: string;
  updated_at?: string;
}


export class CarrinhoService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('carrinhos');

  static async buscarPorUsuario(usuarioId: number): Promise<Carrinho> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar carrinho do usuário ${usuarioId}`);
      throw error;
    }
  }

  static async criar(carrinho: Omit<Carrinho, 'id'>): Promise<Carrinho> {
    try {
      const response = await this.axiosInstance.post('/', carrinho);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao criar carrinho');
      throw error;
    }
  }

  static async limpar(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/${id}/limpar`);
    } catch (error) {
      this.handleError(error, `Erro ao limpar carrinho ID ${id}`);
      throw error;
    }
  }
}