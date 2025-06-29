import BaseService from './BaseService';


interface ItemCarrinho {
  id?: number;
  carrinho_id: number;
  produto_id: number;
  quantidade?: number;
  created_at?: string;
  updated_at?: string;
}


export class ItemCarrinhoService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('itens_carrinho');

  static async listarPorCarrinho(carrinhoId: number): Promise<ItemCarrinho[]> {
    try {
      const response = await this.axiosInstance.get(`/carrinho/${carrinhoId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar itens do carrinho ${carrinhoId}`);
      throw error;
    }
  }

  static async adicionar(item: Omit<ItemCarrinho, 'id'>): Promise<ItemCarrinho> {
    try {
      const response = await this.axiosInstance.post('/', item);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao adicionar item ao carrinho');
      throw error;
    }
  }

  static async atualizarQuantidade(id: number, quantidade: number): Promise<ItemCarrinho> {
    try {
      const response = await this.axiosInstance.patch(`/${id}`, { quantidade });
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar quantidade do item ${id}`);
      throw error;
    }
  }

  static async remover(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/${id}`);
    } catch (error) {
      this.handleError(error, `Erro ao remover item ${id} do carrinho`);
      throw error;
    }
  }
}