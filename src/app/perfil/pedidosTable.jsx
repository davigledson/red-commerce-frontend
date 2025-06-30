// perfil/pedidosTable.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import PedidoService from '@/services/PedidoService'; // Ajuste o caminho
import { useAuth } from '@/hooks/ContextoAuth'; // Ajuste o caminho
import MineDataTable from '@/components/MineDataTable'; // Certifique-se de que este caminho está correto
import Link from 'next/link'; // Mantido, pois é usado no JSX

export default function PedidosTable() {
  const { loggedInUser, loading: authLoading } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState(null);

  const fetchPedidos = useCallback(async () => {
    if (authLoading || !loggedInUser || !loggedInUser.id) {
      setLoadingPedidos(false);
      setPedidos([]);
      return;
    }

    setLoadingPedidos(true);
    setErrorPedidos(null);
    try {
      const data = await PedidoService.listarPorUsuario(loggedInUser.id); 
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      // Simplificado o tratamento de erro para uma mensagem genérica
      setErrorPedidos('Erro ao carregar seus pedidos. Tente novamente.');
    } finally {
      setLoadingPedidos(false);
    }
  }, [loggedInUser, authLoading]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const pedidoColumns = [
    { key: 'id', title: 'Pedido #', render: (value) => `#${value}` },
    { 
      key: 'created_at', 
      title: 'Data', 
      render: (value) => new Date(value).toLocaleDateString('pt-BR') 
    },
    { 
      key: 'itens_pedido', 
      title: 'Itens', 
      whitespace: 'whitespace-normal',
      render: (itens) => {
        if (!itens || itens.length === 0) return 'N/A';
        return itens.map(item => `${item.produto?.nome || 'Produto'} (x${item.quantidade})`).join(', ');
      }
    },
    { 
      key: 'total', 
      title: 'Total', 
      render: (value) => `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}` 
    },
    { 
      key: 'status', 
      title: 'Status', 
      render: (value) => {
        let statusColor = 'bg-gray-100 text-gray-800';
        if (value === 'pendente') statusColor = 'bg-yellow-100 text-yellow-800';
        if (value === 'processando') statusColor = 'bg-blue-100 text-blue-800';
        if (value === 'entregue') statusColor = 'bg-green-100 text-green-800';
        if (value === 'cancelado') statusColor = 'bg-red-100 text-red-800';
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
  ];

  if (loadingPedidos) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-700">Carregando pedidos...</p>
      </div>
    );
  }

  if (errorPedidos) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-lg">{errorPedidos}</p>
        <button onClick={fetchPedidos} className="mt-4 text-blue-600 hover:underline">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-gray-900">Meus Pedidos</h3>

      {pedidos.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-lg">
          Nenhum pedido encontrado.
          <p className="mt-2">
            <Link href="/produtos" className="text-green-600 hover:underline">
              Comece a comprar agora!
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <MineDataTable
            columns={pedidoColumns}
            data={pedidos}
            rowActions={(row) => (
              <Link href={`/pedidos/${row.id}`} className="text-blue-600 hover:text-blue-900">
                Ver Detalhes
              </Link>
            )}
          />
        </div>
      )}
    </div>
  );
}
