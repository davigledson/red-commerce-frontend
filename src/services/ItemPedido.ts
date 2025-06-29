import BaseService from './BaseService';

interface ItemPedido {
  id?: number;
  pedido_id: number;
  produto_id: number;
  quantidade?: number;
  preco: number;
  desconto?: number;
  created_at?: string;
  updated_at?: string;
}

