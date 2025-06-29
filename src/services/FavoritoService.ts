import BaseService from './BaseService';

interface Favorito {
  id?: number;
  usuario_id: number;
  produto_id: number;
  created_at?: string;
  updated_at?: string;
}

export class FavoritoService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('favoritos');

  static async listarPorUsuario(usuarioId: number): Promise<Favorito[]> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar favoritos do usuário ${usuarioId}`);
      throw error;
    }
  }

  static async adicionar(favorito: Omit<Favorito, 'id'>): Promise<Favorito> {
    try {
      const response = await this.axiosInstance.post('/', favorito);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao adicionar favorito');
      throw error;
    }
  }

  static async remover(usuarioId: number, produtoId: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/usuario/${usuarioId}/produto/${produtoId}`);
    } catch (error) {
      this.handleError(error, `Erro ao remover favorito do usuário ${usuarioId} e produto ${produtoId}`);
      throw error;
    }
  }

  static async verificarFavorito(usuarioId: number, produtoId: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${usuarioId}/produto/${produtoId}`);
      return response.data.favorito;
    } catch (error) {
      this.handleError(error, `Erro ao verificar favorito do usuário ${usuarioId} e produto ${produtoId}`);
      throw error;
    }
  }
}
