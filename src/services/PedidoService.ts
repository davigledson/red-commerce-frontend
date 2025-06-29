import BaseService from './BaseService';

interface Pedido {
  id?: number;
  usuario_id: number;
  endereco_id: number;
  status?: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  metodo_pagamento?: string;
  total: number;
  created_at?: string;
  updated_at?: string;
}


export class PedidoService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('pedidos');

  static async listarPorUsuario(usuarioId: number): Promise<Pedido[]> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar pedidos do usuário ${usuarioId}`);
      throw error;
    }
  }

  static async buscarPorId(id: number): Promise<Pedido> {
    try {
      const response = await this.axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao buscar pedido ID ${id}`);
      throw error;
    }
  }

  static async criar(pedido: Omit<Pedido, 'id'>): Promise<Pedido> {
    try {
      const response = await this.axiosInstance.post('/', pedido);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao criar pedido');
      throw error;
    }
  }

  static async atualizarStatus(id: number, status: string): Promise<Pedido> {
    try {
      const response = await this.axiosInstance.patch(`/${id}/status`, { status });
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao atualizar status do pedido ${id}`);
      throw error;
    }
  }

  static async cancelar(id: number): Promise<Pedido> {
    try {
      const response = await this.axiosInstance.patch(`/${id}/cancelar`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erro ao cancelar pedido ${id}`);
      throw error;
    }
  }
}