'use client';
import { useState, useEffect } from 'react';
import EditModal from '@/components/EditModal';
import WidgetStart from '@/components/WidgetStart';
import ProdutoService from '@/services/ProdutoService';

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  // Carrega os produtos
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoading(true);
        const data = await ProdutoService.listarTodos();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  // Filtra produtos pela busca
  const rows = products.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Calcula estatísticas
  const valorMedio = products.length > 0 
    ? (products.reduce((acc, p) => acc + parseFloat(p.preco), 0) / products.length).toFixed(2)
    : '0.00';

  const totalEstoque = products.reduce((acc, p) => acc + (p.estoque || 0), 0);

  // Manipulador para salvar produto
  const handleSave = async (updatedProduct) => {
    try {
      let produtoAtualizado;
      
      if (updatedProduct.id) {
        // Atualiza produto existente
        produtoAtualizado = await ProdutoService.atualizar(updatedProduct.id, updatedProduct);
        setProducts(prev => 
          prev.map(p => p.id === updatedProduct.id ? produtoAtualizado : p)
        );
      } else {
        // Cria novo produto
        produtoAtualizado = await ProdutoService.criar(updatedProduct);
        setProducts(prev => [...prev, produtoAtualizado]);
      }
      
      setEditing(null);
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      alert('Erro ao salvar produto');
    }
  };

  // Manipulador para deletar produto
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await ProdutoService.deletar(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error('Erro ao deletar produto:', err);
        alert('Erro ao deletar produto');
      }
    }
  };

  // Abre modal para adicionar novo produto
  const handleAddProduct = () => {
    setEditing({
      nome: '',
      preco: '',
      descricao: '',
      estoque: 0,
      destaque: false,
      ativo: true,
      categoria_id: 1,
    });
  };

  // Estados de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  // Estados de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-30 from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 px-10 py-10 shadow-lg">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Dashboard Admin</h1>
            <p className="text-green-100 text-xl">Gerencie seus produtos com facilidade</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <span className="text-white font-medium text-lg">{rows.length} produtos</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 max-w-8xl mx-auto">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <svg className="w-7 h-7 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <WidgetStart
            title="Total de Produtos"
            value={products.length}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />

          <WidgetStart
            title="Valor Médio"
            value={`R$ ${valorMedio}`}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />

          <WidgetStart
            title="Em Estoque"
            value={totalEstoque}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">Lista de Produtos</h3>
              <button 
                onClick={handleAddProduct}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                Adicionar Produto
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-6">
                          <div className="text-lg font-medium text-gray-900">{product.nome}</div>
                          <div className="text-base text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-base text-gray-500 line-clamp-2 max-w-xs">
                        {product.descricao}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-lg font-medium">{product.estoque}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">R$ {parseFloat(product.preco).toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        product.ativo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditing(product)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {rows.length === 0 && !loading && (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.535-2.854M15 17h3.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0022 13.586V6a1 1 0 00-1-1H3a1 1 0 00-1 1v7.586a1 1 0 00.293.707l2.414 2.414A1 1 0 005.414 17H9" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-2 text-base text-gray-500">Tente ajustar sua busca para encontrar produtos.</p>
          </div>
        )}
      </div>

      {/* Modal de Edição/Criação */}
      <EditModal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        product={editing}
      />
    </div>
  );
}