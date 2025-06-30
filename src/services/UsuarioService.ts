import BaseService from './BaseService';


interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha_digest?: string;
  papel?: 'cliente' | 'admin';
  created_at?: string;
  updated_at?: string;
}





export default class UsuarioService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('usuarios');

  static async listarTodos(): Promise<Usuario[]> {
    try {
      const response = await this.axiosInstance.get('/');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao buscar Usuarios');
      throw error;
    }
  }

  static async buscarPorId(id: string): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar Usuario ID ${id}`);
      throw error;
    }
  }

  static async criar(Usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.post('/', Usuario);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao criar Usuario');
      throw error;
    }
  }

  static async atualizar(id: string, Usuario: Usuario): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.put(`/${id}`, Usuario);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar Usuario ID ${id}`);
      throw error;
    }
  }

  static async atualizarParcial(id: string, updates: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.patch(`/${id}`, updates);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar parcialmente Usuario ID ${id}`);
      throw error;
    }
  }

  static async deletar(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/${id}`);
    } catch (error) {
      this.handleError(error, `Erro ao deletar Usuario ID ${id}`);
      throw error;
    }
  }
}