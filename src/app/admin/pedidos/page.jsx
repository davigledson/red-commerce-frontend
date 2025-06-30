// src/app/admin/pedidos/page.js
'use client';
import { useState, useEffect } from 'react';
import FormModal from '@/components/FormModal';
import WidgetStart from '@/components/WidgetStart';
import DataTable from '@/components/DataTable';
import { useToast } from '@/hooks/ContextoToast';

import PedidoService from '@/services/PedidoService';
import axios from 'axios';

export default function AdminPedidos() {
  const [search, setSearch] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  // Carrega os pedidos
  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await PedidoService.listarTodos();
      console.log("Dados recebidos do backend:", data);
      
      // Adapta os dados para o formato esperado pela UI
      const validPedidos = data.filter(p => 
        p && typeof p === 'object' && p.id != null
      ).map(p => {
        // Calcula informações dos itens
        const totalItens = p.itens_pedido?.length || 0;
        const produtosDescricao = p.itens_pedido?.map(item => 
          `${item.quantidade}x Produto #${item.produto_id}`
        ).join(', ') || 'Nenhum item';

        return {
          ...p,
          // Campos adaptados para a UI
          cliente_nome: p.usuario?.nome || p.usuario?.email || `Usuário #${p.usuario_id}`,
          cliente_email: p.usuario?.email || 'Email não informado',
          cliente_telefone: p.usuario?.telefone || 'N/A',
          endereco_entrega_completo: p.endereco_entrega ? 
            `${p.endereco_entrega.rua}, ${p.endereco_entrega.numero} - ${p.endereco_entrega.cidade || 'Cidade não informada'}/${p.endereco_entrega.estado || 'Estado não informado'}` :
            'Endereço não informado',
          valor_total: parseFloat(p.total || 0),
          total_itens: totalItens,
          produtos_descricao: produtosDescricao,
          data_pedido: p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : 'N/A',
          data_atualizacao: p.updated_at ? new Date(p.updated_at).toLocaleDateString('pt-BR') : 'N/A',
          metodo_pagamento: p.metodo_pagamento || 'Não informado',
          observacoes: p.observacoes || '',
        };
      });

      setPedidos(validPedidos);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      let errorMessage = 'Erro ao carregar pedidos.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.errors) {
          errorMessage = err.response.data.errors.join(', ');
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filtra pedidos pela busca
  const rows = pedidos.filter(p => 
    p.cliente_nome.toLowerCase().includes(search.toLowerCase()) ||
    p.cliente_email.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase()) ||
    p.endereco_entrega_completo.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toString().includes(search)
  );

  // Calcula estatísticas
  const valorTotal = pedidos.reduce((acc, p) => acc + p.valor_total, 0);
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente').length;
  const pedidosProcessando = pedidos.filter(p => p.status === 'processando').length;
  const pedidosEnviados = pedidos.filter(p => p.status === 'enviado').length;
  const pedidosEntregues = pedidos.filter(p => p.status === 'entregue').length;
  const pedidosCancelados = pedidos.filter(p => p.status === 'cancelado').length;

  // Configuração dos campos do formulário para edição de pedidos
  const pedidoFields = [
    {
      name: 'status',
      label: 'Status do Pedido',
      type: 'select',
      options: [
        { value: 'pendente', label: 'Pendente' },
        { value: 'processando', label: 'Processando' },
        { value: 'enviado', label: 'Enviado' },
        { value: 'entregue', label: 'Entregue' },
        { value: 'cancelado', label: 'Cancelado' }
      ],
      required: true
    },
    {
      name: 'metodo_pagamento',
      label: 'Método de Pagamento',
      type: 'select',
      options: [
        { value: 'pix', label: 'PIX' },
        { value: 'cartao_credito', label: 'Cartão de Crédito' },
        { value: 'cartao_debito', label: 'Cartão de Débito' },
        { value: 'boleto', label: 'Boleto' },
        { value: 'dinheiro', label: 'Dinheiro' }
      ],
      required: false
    },
    {
      name: 'observacoes',
      label: 'Observações',
      type: 'textarea',
      placeholder: 'Observações sobre o pedido...',
      required: false
    }
  ];

  // Manipulador para salvar pedido
  const handleSave = async (formData) => {
    try {
      if (editing && editing.id != null) { 
        const dataToUpdate = {
          status: formData.status,
          metodo_pagamento: formData.metodo_pagamento,
          observacoes: formData.observacoes,
        };
        
        await PedidoService.atualizar(editing.id, dataToUpdate);
        
        // Recarrega os dados para garantir sincronização
        await carregarPedidos();
        
        addToast("Pedido atualizado com sucesso!", "success");
      } else { 
        addToast("Criação de novos pedidos deve ser feita pelos clientes.", "info");
        return;
      }
      
      setEditing(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar pedido:', err);
      let errorMessage = "Erro ao salvar pedido.";
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMessage = err.response.data.errors.join(', ');
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      addToast(errorMessage, "error");
      throw err;
    }
  };

  // Manipulador para deletar pedido
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      try {
        await PedidoService.deletar(id);
        setPedidos(prev => prev.filter(p => p.id !== id));
        addToast("Pedido excluído com sucesso!", "success");
      } catch (err) {
        console.error('Erro ao deletar pedido:', err);
        let errorMessage = "Erro ao deletar pedido.";
        if (axios.isAxiosError(err) && err.response && err.response.data) {
          if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (err.response.data.errors) {
            errorMessage = err.response.data.errors.join(', ');
          }
        }
        addToast(errorMessage, "error");
      }
    }
  };

  // Não permite adicionar pedidos pelo admin
  const handleAddPedido = () => {
    addToast("Novos pedidos são criados pelos clientes durante o processo de compra.", "info");
  };

  // Abre modal para editar pedido existente
  const handleEditPedido = (pedido) => {
    setEditing({
      id: pedido.id,
      status: pedido.status,
      metodo_pagamento: pedido.metodo_pagamento,
      observacoes: pedido.observacoes,
    });
    setIsModalOpen(true);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setEditing(null);
    setIsModalOpen(false);
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'processando': 'bg-blue-100 text-blue-800',
      'enviado': 'bg-purple-100 text-purple-800',
      'entregue': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Função para obter label do status
  const getStatusLabel = (status) => {
    const labels = {
      'pendente': 'Pendente',
      'processando': 'Processando',
      'enviado': 'Enviado',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  };

  // Gera seções customizadas para o modal
  const getCustomSections = () => {
    if (!editing || !editing.id) return [];

    const pedidoCompleto = pedidos.find(p => p.id === editing.id);
    if (!pedidoCompleto) return [];

    return [
      {
        title: 'Informações do Pedido',
        className: 'bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100',
        gridClassName: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        content: [
          <div key="id" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">ID do Pedido</p>
            <p className="text-xl font-bold text-gray-900">#{pedidoCompleto.id}</p>
          </div>,
          <div key="valor" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-xl font-bold text-green-600">R$ {pedidoCompleto.valor_total.toFixed(2).replace('.', ',')}</p>
          </div>,
          <div key="itens" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total de Itens</p>
            <p className="text-xl font-bold text-blue-600">{pedidoCompleto.total_itens}</p>
          </div>
        ]
      },
      {
        title: 'Dados do Cliente',
        className: 'bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-gray-100',
        gridClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        content: [
          <div key="cliente" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Cliente</p>
            <p className="text-lg font-semibold text-gray-900">{pedidoCompleto.cliente_nome}</p>
            <p className="text-sm text-gray-500">{pedidoCompleto.cliente_email}</p>
          </div>,
          <div key="endereco" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Endereço de Entrega</p>
            <p className="text-sm text-gray-900">{pedidoCompleto.endereco_entrega_completo}</p>
          </div>
        ]
      },
      {
        title: 'Itens do Pedido',
        className: 'bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-100',
        gridClassName: 'grid grid-cols-1 gap-4',
        content: [
          <div key="produtos" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Produtos</p>
            <div className="space-y-2">
              {pedidoCompleto.itens_pedido?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-900">
                    Produto #{item.produto_id} x {item.quantidade}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )) || <p className="text-sm text-gray-500">Nenhum item encontrado</p>}
            </div>
          </div>
        ]
      }
    ];
  };

  // Definição das colunas para o DataTable
  const pedidoColumns = [
    { 
      header: 'Pedido', 
      render: (pedido) => (
        <div className="flex items-center">
          <div className="ml-2">
            <div className="text-lg font-bold text-gray-900">#{pedido.id}</div>
            <div className="text-sm text-gray-500">{pedido.data_pedido}</div>
            <div className="text-xs text-gray-400">{pedido.total_itens} {pedido.total_itens === 1 ? 'item' : 'itens'}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Cliente', 
      render: (pedido) => (
        <div>
          <div className="text-base font-medium text-gray-900">{pedido.cliente_nome}</div>
          <div className="text-sm text-gray-500">{pedido.cliente_email}</div>
          <div className="text-xs text-gray-400">ID: {pedido.usuario_id}</div>
        </div>
      )
    },
    { 
      header: 'Endereço', 
      render: (pedido) => (
        <div className="text-sm text-gray-600 max-w-xs">
          <div className="truncate">{pedido.endereco_entrega_completo}</div>
        </div>
      )
    },
    { 
      header: 'Valor Total', 
      render: (pedido) => (
        <div className="text-lg font-bold text-green-600">
          R$ {pedido.valor_total.toFixed(2).replace('.', ',')}
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (pedido) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
          {getStatusLabel(pedido.status)}
        </span>
      )
    },
  ];

  // Estados de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  // Estados de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={carregarPedidos}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-30 from-blue-50 to-green-50">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 px-10 py-10 shadow-lg">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Gerenciar Pedidos</h1>
            <p className="text-blue-100 text-xl">Controle todos os pedidos da sua loja</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <span className="text-white font-medium text-lg">{rows.length} pedidos</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-10 max-w-8xl mx-auto">
        {/* Barra de Busca */}
        <div className="mb-10">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Buscar por ID, cliente, email ou status..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <svg className="w-7 h-7 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Cartões de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <WidgetStart
            title="Total de Pedidos"
            value={pedidos.length}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          />

          <WidgetStart
            title="Valor Total"
            value={`R$ ${valorTotal.toFixed(2).replace('.', ',')}`}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            )}
          />

          <WidgetStart
            title="Pendentes"
            value={pedidosPendentes}
            bgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          />

          <WidgetStart
            title="Processando"
            value={pedidosProcessando}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          />

          <WidgetStart
            title="Entregues"
            value={pedidosEntregues}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          />
        </div>

        {/* Tabela de Pedidos */}
        <DataTable
          title="Lista de Pedidos"
          data={rows}
          columns={pedidoColumns}
          onEdit={handleEditPedido}
          onDelete={handleDelete}
          onAdd={handleAddPedido}
          addText="Novo Pedido"
          emptyMessage="Nenhum pedido encontrado. Os pedidos são criados pelos clientes durante o processo de compra."
        />
      </div>

      {/* Modal de Edição */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editing || {}}
        fields={pedidoFields}
        title={editing && editing.id ? 'Editar Pedido' : 'Visualizar Pedido'}
        subtitle={editing && editing.id ? 'Atualize as informações do pedido' : 'Detalhes do pedido'}
        saveButtonText="Salvar Alterações"
        customSections={getCustomSections()}
        modalSize="max-w-5xl"
        headerGradient="from-blue-500 to-green-500"
        iconSvg={(
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      />
    </div>
  );
}