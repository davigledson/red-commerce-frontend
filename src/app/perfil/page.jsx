// app/perfil/page.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/ContextoAuth';
import { useRouter } from 'next/navigation'; // <-- Certifique-se de que useRouter está importado

// Importe os serviços necessários
import PedidoService from '@/services/PedidoService'; // Caminho corrigido
import {CarrinhoService} from '@/services/CarrinhoService';
import ItemCarrinhoService from '@/services/ItemCarrinhoService';
import FavoritoService from '@/services/FavoritoService';

// Importe os componentes das tabelas
import Infos from './Infos';
import EnderecoTable from './EnderecoTable';
import PedidosTable from './pedidosTable';
import CarrinhoTable from './carrinhoTable';
import FavoritosTable from './favoritosTable';
import Configuracoes from './Configuracoes';

export default function UserProfile() {
  const router = useRouter();
  const { loggedInUser, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  // Defina a aba inicial com base no query parameter ou 'personal' como padrão
  const initialTab = searchParams.get('tab') || 'personal';
  const [activeTab, setActiveTabState] = useState(initialTab); // Renomeado para evitar conflito

  // Estados para as estatísticas dinâmicas
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalGasto, setTotalGasto] = useState(0);
  const [totalItensCarrinho, setTotalItensCarrinho] = useState(0);
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Efeito para atualizar a aba se o query parameter mudar (navegação externa ou recarga)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!authLoading && !loggedInUser) {
      router.push('/login');
    }
  }, [loggedInUser, authLoading, router]);

  // Função para buscar as estatísticas (mantida como está)
  const fetchUserStats = useCallback(async () => {
    if (!loggedInUser || !loggedInUser.id) {
      setLoadingStats(false);
      return;
    }

    setLoadingStats(true);
    try {
      const pedidos = await PedidoService.listarPorUsuario(loggedInUser.id);
      setTotalPedidos(pedidos.length);
      const gasto = pedidos.reduce((sum, pedido) => sum + parseFloat(pedido.total || 0), 0);
      setTotalGasto(gasto);

      let cartId = null;
      try {
        const cart = await CarrinhoService.buscarPorUsuario(loggedInUser.id);
        cartId = cart.id;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
          cartId = null;
        } else {
          console.error("Erro ao buscar carrinho para stats:", err);
        }
      }
      if (cartId) {
        const itensCarrinho = await ItemCarrinhoService.listarPorCarrinho(cartId);
        const countItens = itensCarrinho.reduce((sum, item) => sum + item.quantidade, 0);
        setTotalItensCarrinho(countItens);
      } else {
        setTotalItensCarrinho(0);
      }

      const favoritos = await FavoritoService.listarPorUsuario(loggedInUser.id);
      setTotalFavoritos(favoritos.length);

    } catch (err) {
      console.error("Erro ao carregar estatísticas do usuário:", err);
    } finally {
      setLoadingStats(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // NOVA FUNÇÃO para definir a aba e atualizar a URL
  const handleTabChange = (tabName) => {
    setActiveTabState(tabName); // Atualiza o estado da aba
    // Cria um novo objeto URLSearchParams para manipular os parâmetros da URL
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tabName); // Define o parâmetro 'tab'
    // Atualiza a URL sem recarregar a página
    router.push(`perfil/?${newSearchParams.toString()}`, undefined, { shallow: true });
  };

  // Renderização de carregamento inicial
  if (authLoading || !loggedInUser || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-lg text-gray-700">Carregando perfil e estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-25 bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 px-10 py-10 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Meu Perfil</h1>
              <p className="text-green-100 text-lg">Gerencie suas informações pessoais</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 max-w-6xl mx-auto">
        {/* Stats Cards - AGORA DINÂMICOS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Itens no Carrinho</p>
                <p className="text-2xl font-bold text-gray-900">{totalItensCarrinho}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-gray-900">R$ {totalGasto.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{totalFavoritos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => handleTabChange('personal')} // Chama a nova função
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'personal'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Informações Pessoais
              </button>
              <button
                onClick={() => handleTabChange('orders')} // Chama a nova função
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meus Pedidos
              </button>
              <button
                onClick={() => handleTabChange('address')} // Chama a nova função
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'address'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meus Endereços
              </button>
              <button
                onClick={() => handleTabChange('cart')} // Chama a nova função
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cart'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meu Carrinho
              </button>
              <button
                onClick={() => handleTabChange('favorites')} // Chama a nova função
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Favoritos
              </button>
              <button
                onClick={() => handleTabChange('settings')} // Chama a nova função
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configurações
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'personal' && <Infos />}
            {activeTab === 'orders' && <PedidosTable />}
            {activeTab === 'address' && <EnderecoTable />}
            {activeTab === 'cart' && <CarrinhoTable />}
            {activeTab === 'favorites' && <FavoritosTable />}
            {activeTab === 'settings' && <Configuracoes />}
          </div>
        </div>
      </div>
    </div>
  );
}
