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

interface ItemPedido {
  id?: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}
export default class PedidoService extends BaseService {
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
static async listarTodos(): Promise<Pedido[]> {
    try {
      const response = await this.axiosInstance.get('/');
      return response.data;
    } catch (error) {
      BaseService.handleError(error, 'Erro ao buscar pedidos');
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

 
  static async criar(pedidoData: {
    endereco_entrega_id: number;
    // Adicione metodo_pagamento aqui se for obrigatório ou se quiser enviá-lo
    // metodo_pagamento?: string; 
    itens: Array<{ produto_id: number; quantidade: number; preco: number; desconto?: number }>; // Renomeado preco_unitario para preco, adicionado desconto
  }): Promise<Pedido> {
    try {
      const dataToSend = {
        pedido: {
          endereco_entrega_id: pedidoData.endereco_entrega_id,
          // metodo_pagamento: pedidoData.metodo_pagamento || 'cartao_credito', // Exemplo de valor padrão
          itens_pedido_attributes: pedidoData.itens.map(item => ({
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco: item.preco, // Renomeado para 'preco'
            desconto: item.desconto || 0 // Adicionado 'desconto' com valor padrão
          }))
        }
      };
      const response = await this.axiosInstance.post('/', dataToSend);
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

   // NOVAS FUNÇÕES PARA O DASHBOARD ADMIN

  static async contarPedidos(): Promise<number> {
    try {
      const response = await this.axiosInstance.get('/contar');
      return response.data.count;
    } catch (error) {
      this.handleError(error, 'Erro ao contar pedidos');
      throw error;
    }
  }

  static async contarPedidosPorStatus(status: string): Promise<number> {
    try {
      const response = await this.axiosInstance.get(`/contar_por_status?status=${status}`);
      return response.data.count;
    } catch (error) {
      this.handleError(error, `Erro ao contar pedidos com status ${status}`);
      throw error;
    }
  }

  static async faturamentoTotal(): Promise<number> {
    try {
      const response = await this.axiosInstance.get('/faturamento_total');
      return response.data.total_revenue;
    } catch (error) {
      this.handleError(error, 'Erro ao obter faturamento total');
      throw error;
    }
  }

  static async faturamentoMesAtual(): Promise<number> {
    try {
      const response = await this.axiosInstance.get('/faturamento_mes_atual');
      return response.data.monthly_revenue;
    } catch (error) {
      this.handleError(error, 'Erro ao obter faturamento do mês atual');
      throw error;
    }
  }

  static async produtosMaisVendidos(): Promise<Array<{ id: number; nome: string; total_vendido: number; categoria?: { nome: string } }>> {
    try {
      const response = await this.axiosInstance.get('/produtos_mais_vendidos');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao listar produtos mais vendidos');
      throw error;
    }
  }

  static async vendasRecentes(): Promise<Array<{ id: number; cliente: string; produto: string; valor: number; data: string }>> {
    try {
      const response = await this.axiosInstance.get('/vendas_recentes');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao listar vendas recentes');
      throw error;
    }
  }
}