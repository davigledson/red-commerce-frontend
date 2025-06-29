import BaseService from './BaseService';


interface ItemCarrinho {
  id?: number;
  carrinho_id: number;
  produto_id: number;
  quantidade?: number;
  created_at?: string;
  updated_at?: string;
}


export default class ItemCarrinhoService extends BaseService {
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

   // CORREÇÃO AQUI: Ajuste o formato dos dados enviados
  static async adicionar(item: Omit<ItemCarrinho, 'id' | 'carrinho_id'>): Promise<ItemCarrinho> {
    try {
      // O Rails espera { item_carrinho: { produto_id: ..., quantidade: ... } }
      // O carrinho_id é derivado do usuário logado no backend, então não o enviamos aqui.
      const dataToSend = {
        item_carrinho: {
          produto_id: item.produto_id,
          quantidade: item.quantidade || 1 // Garante que a quantidade seja pelo menos 1
        }
      };
      const response = await this.axiosInstance.post('/', dataToSend);
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