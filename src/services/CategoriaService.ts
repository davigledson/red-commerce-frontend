import BaseService from './BaseService';


interface Categoria {
  id?: string;
  nome: string;
  descricao: string;
 
  created_at?: string;
  updated_at?: string;
}

export default class categoriaService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('categorias');

 
  static async listarTodos(): Promise<Categoria[]> {
    try {
      const response = await this.axiosInstance.get('/');
      return response.data;
    } catch (error) {
      BaseService.handleError(error, 'Erro ao buscar categorias');
      throw error;
    }
  }

  static async buscarPorId(id: number): Promise<Categoria> {
    try {
      const response = await this.axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      BaseService.handleError(error, `Erro ao buscar categoria ID ${id}`);
      throw error;
    }
  }

  static async criar(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    try {
      const response = await this.axiosInstance.post('/', categoria);
      return response.data;
    } catch (error) {
      BaseService.handleError(error, 'Erro ao criar categoria');
      throw error;
    }
  }

  static async atualizar(id: number, categoria: Categoria): Promise<Categoria> {
    try {
      const response = await this.axiosInstance.put(`/${id}`, categoria);
      return response.data;
    } catch (error) {
      BaseService.handleError(error, `Erro ao atualizar categoria ID ${id}`);
      throw error;
    }
  }

  static async atualizarParcial(id: number, updates: Partial<Categoria>): Promise<Categoria> {
    try {
      const response = await this.axiosInstance.patch(`/${id}`, updates);
      return response.data;
    } catch (error) {
      BaseService.handleError(error, `Erro ao atualizar parcialmente categoria ID ${id}`);
      throw error;
    }
  }

  static async deletar(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/${id}`);
    } catch (error) {
      BaseService.handleError(error, `Erro ao deletar categoria ID ${id}`);
      throw error;
    }
  }
  
}
