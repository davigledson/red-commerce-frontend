import BaseService from './BaseService';

interface Endereco {
  id?: number;
  usuario_id: number;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  cidade: string;
  estado: string;
  principal?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default class EnderecoService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('enderecos');

  static async listarPorUsuario(usuarioId: number): Promise<Endereco[]> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar endereços do usuário ${usuarioId}`);
      throw error;
    }
  }

  static async buscarPorId(id: number): Promise<Endereco> {
    try {
      const response = await this.axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar endereço ID ${id}`);
      throw error;
    }
  }

  static async buscarPrincipal(usuarioId: number): Promise<Endereco> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${usuarioId}/principal`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar endereço principal do usuário ${usuarioId}`);
      throw error;
    }
  }

  static async criar(endereco: Omit<Endereco, 'id'>): Promise<Endereco> {
    try {
      const response = await this.axiosInstance.post('/', endereco);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao criar endereço');
      throw error;
    }
  }

  static async atualizar(id: number, endereco: Endereco): Promise<Endereco> {
    try {
      const response = await this.axiosInstance.put(`/${id}`, endereco);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar endereço ID ${id}`);
      throw error;
    }
  }

  static async atualizarParcial(id: number, updates: Partial<Endereco>): Promise<Endereco> {
    try {
      const response = await this.axiosInstance.patch(`/${id}`, updates);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar parcialmente endereço ID ${id}`);
      throw error;
    }
  }

  static async deletar(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/${id}`);
    } catch (error) {
      this.handleError(error, `Erro ao deletar endereço ID ${id}`);
      throw error;
    }
  }

  static async definirPrincipal(id: number): Promise<Endereco> {
    try {
      const response = await this.axiosInstance.patch(`/${id}/principal`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao definir endereço ${id} como principal`);
      throw error;
    }
  }
}