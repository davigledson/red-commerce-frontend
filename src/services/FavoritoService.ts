// services/FavoritoService.js
import BaseService from './BaseService';

interface Favorito {
  id?: number;
  usuario_id: number;
  produto_id: number;
  created_at?: string;
  updated_at?: string;
  produto?: any; // Para incluir os detalhes do produto
}

export default class FavoritoService extends BaseService {
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

  static async adicionar(favoritoData: { produto_id: number }): Promise<Favorito> {
    try {
      const response = await this.axiosInstance.post('/', { favorito: favoritoData }); // Envia aninhado
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao adicionar favorito');
      throw error;
    }
  }

  // CORREÇÃO AQUI: Aceita o ID do registro de favorito
  static async remover(favoritoId: number): Promise<void> {
    try {
      // Envia DELETE para /api/v1/favoritos/:id
      await this.axiosInstance.delete(`/${favoritoId}`);
    } catch (error) {
      this.handleError(error, `Erro ao remover favorito ID ${favoritoId}`);
      throw error;
    }
  }

  // Opcional: Verificar se um produto é favorito (se você tiver a rota no backend)
  // Se a rota for GET /api/v1/favoritos/usuario/:usuarioId/produto/:produtoId
  static async verificarFavorito(usuarioId: number, produtoId: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${usuarioId}/produto/${produtoId}`);
      return response.data.is_favorite; // Assumindo que o backend retorna { is_favorite: true/false }
    } catch (error) {
      // Se a rota não existir ou der erro, assume que não é favorito
      console.error("Erro ao verificar status de favorito:", error);
      return false;
    }
  }
}
