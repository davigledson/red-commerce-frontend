// src/app/admin/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import WidgetStart from '@/components/WidgetStart';
import Header from '@/components/dashboard/Header';

// Simulando serviços - você pode substituir pelos seus serviços reais
import CategoriaService from '@/services/CategoriaService';
// import ProdutoService from '@/services/ProdutoService';
// import UsuarioService from '@/services/UsuarioService';
// import VendaService from '@/services/VendaService';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    categorias: 0,
    produtos: 0,
    usuarios: 0,
    vendas: 0,
    vendasHoje: 0,
    faturamentoMes: 0,
    produtosMaisVendidos: [],
    vendasRecentes: []
  });

  // Carrega os dados do dashboard
  useEffect(() => {
    const carregarDadosDashboard = async () => {
      try {
        setLoading(true);
        
        // Carrega categorias (exemplo real)
        const categorias = await CategoriaService.listarTodos();
        
        // Simula outros dados - substitua pelas chamadas reais dos seus serviços
        const produtos = 150; // await ProdutoService.contar();
        const usuarios = 89; // await UsuarioService.contar();
        const vendas = 234; // await VendaService.contar();
        const vendasHoje = 12; // await VendaService.contarHoje();
        const faturamentoMes = 45678.90; // await VendaService.faturamentoMes();
        
        // Dados mockados para produtos mais vendidos
        const produtosMaisVendidos = [
          { id: 1, nome: 'Produto A', vendas: 45, categoria: 'Eletrônicos' },
          { id: 2, nome: 'Produto B', vendas: 38, categoria: 'Roupas' },
          { id: 3, nome: 'Produto C', vendas: 29, categoria: 'Casa' },
          { id: 4, nome: 'Produto D', vendas: 25, categoria: 'Esportes' },
          { id: 5, nome: 'Produto E', vendas: 22, categoria: 'Livros' }
        ];

        // Dados mockados para vendas recentes
        const vendasRecentes = [
          { id: 1, cliente: 'João Silva', produto: 'Smartphone XYZ', valor: 899.90, data: new Date() },
          { id: 2, cliente: 'Maria Santos', produto: 'Notebook ABC', valor: 2499.00, data: new Date(Date.now() - 3600000) },
          { id: 3, cliente: 'Pedro Costa', produto: 'Fone Bluetooth', valor: 199.90, data: new Date(Date.now() - 7200000) },
          { id: 4, cliente: 'Ana Lima', produto: 'Camiseta Premium', valor: 79.90, data: new Date(Date.now() - 10800000) },
          { id: 5, cliente: 'Carlos Oliveira', produto: 'Livro Técnico', valor: 59.90, data: new Date(Date.now() - 14400000) }
        ];

        setDashboardData({
          categorias: categorias.length,
          produtos,
          usuarios,
          vendas,
          vendasHoje,
          faturamentoMes,
          produtosMaisVendidos,
          vendasRecentes
        });
        
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDashboard();
  }, []);

  // Função para formatar moeda
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para formatar data/hora
  const formatarDataHora = (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  // Estados de carregamento (loading)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Estados de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-30 from-purple-50 to-blue-50">
      {/* Cabeçalho (Header) */}
      <Header
        title="Dashboard Administrativo"
        subtitle="Visão geral do seu negócio"
        count={dashboardData.vendasHoje}
        countLabel="vendas hoje"
        gradientFrom="from-indigo-500"
        gradientTo="to-purple-500"
        subtitleColor="text-indigo-100"
        icon={
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
      
      {/* Conteúdo (Content) */}
      <div className="p-10 max-w-8xl mx-auto">
        
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          <WidgetStart
            title="Total de Produtos"
            value={dashboardData.produtos}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            )}
          />

          <WidgetStart
            title="Categorias"
            value={dashboardData.categorias}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          />

          <WidgetStart
            title="Usuários Ativos"
            value={dashboardData.usuarios}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            )}
          />

          <WidgetStart
            title="Total de Vendas"
            value={dashboardData.vendas}
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
          />
        </div>

        {/* Métricas Financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          <WidgetStart
            title="Faturamento do Mês"
            value={formatarMoeda(dashboardData.faturamentoMes)}
            bgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            )}
          />

          <WidgetStart
            title="Vendas Hoje"
            value={dashboardData.vendasHoje}
            bgColor="bg-cyan-100"
            iconColor="text-cyan-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            )}
          />

          <WidgetStart
            title="Taxa de Conversão"
            value="12.5%"
            bgColor="bg-indigo-100"
            iconColor="text-indigo-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
          />
        </div>

        {/* Seções de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Produtos Mais Vendidos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Produtos Mais Vendidos</h3>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="space-y-4">
              {dashboardData.produtosMaisVendidos.map((produto, index) => (
                <div key={produto.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{produto.nome}</p>
                      <p className="text-sm text-gray-500">{produto.categoria}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{produto.vendas}</p>
                    <p className="text-xs text-gray-500">vendas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendas Recentes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Vendas Recentes</h3>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-4">
              {dashboardData.vendasRecentes.map((venda) => (
                <div key={venda.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{venda.cliente}</p>
                    <p className="text-sm text-gray-500">{venda.produto}</p>
                    <p className="text-xs text-gray-400">{formatarDataHora(venda.data)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatarMoeda(venda.valor)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <button className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="font-medium">Novo Produto</p>
            </button>

            <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-medium">Nova Categoria</p>
            </button>

            <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="font-medium">Ver Relatórios</p>
            </button>

            <button className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-medium">Configurações</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}