// src/app/admin/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import FormModal from '@/components/FormModal';
import WidgetStart from '@/components/WidgetStart';
import DataTable from '@/components/DataTable';

import ProdutoService from '@/services/ProdutoService';

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carrega os produtos
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoading(true);
        const data = await ProdutoService.listarTodos();
        
        // Filtro para garantir que apenas produtos válidos sejam adicionados ao estado
        const validProducts = data.filter(p => 
          p && typeof p === 'object' && p.id != null && typeof p.nome === 'string'
        );
        setProducts(validProducts);
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
    ? (products.reduce((acc, p) => acc + parseFloat(p.preco || 0), 0) / products.length).toFixed(2)
    : '0.00';

  const totalEstoque = products.reduce((acc, p) => acc + (p.estoque || 0), 0);

  // Configuração dos campos do formulário para o FormModal
  const productFields = [
    {
      name: 'nome',
      label: 'Nome do Produto',
      type: 'text',
      placeholder: 'Digite o nome do produto',
      required: true
    },
    {
      name: 'preco',
      label: 'Preço (R$)',
      type: 'number',
      step: '0.01',
      min: '0',
      placeholder: '0.00',
      required: true
    },
    {
      name: 'estoque',
      label: 'Estoque',
      type: 'number',
      min: '0',
      placeholder: 'Quantidade em estoque',
      required: true
    },
    {
      name: 'categoria_id',
      label: 'Categoria',
      type: 'select',
      options: [
        { value: 1, label: 'Plantas de Interior' },
        { value: 2, label: 'Plantas Ornamentais' },
        { value: 3, label: 'Plantas Medicinais' },
        { value: 4, label: 'Plantas Aromáticas' }
      ],
      required: true
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      rows: 5,
      placeholder: 'Descreva as características e cuidados do produto...',
      fullWidth: true
    },
    {
      name: 'destaque',
      label: 'Produto em Destaque',
      type: 'checkbox'
    },
    {
      name: 'ativo',
      label: 'Produto Ativo',
      type: 'checkbox'
    }
  ];

  // Manipulador para salvar produto
  const handleSave = async (formData) => {
    try {
      // Converte os tipos de dados necessários
      const updatedProduct = {
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque),
        categoria_id: parseInt(formData.categoria_id)
      };

      let produtoAtualizado;
      
      // Se editing.id existe e não é null/undefined, é uma atualização
      if (editing && editing.id != null) { 
        updatedProduct.id = editing.id; // Garante que o ID seja incluído
        produtoAtualizado = await ProdutoService.atualizar(editing.id, updatedProduct);
        setProducts(prev => 
          prev.map(p => p.id === editing.id ? produtoAtualizado : p)
        );
      } else { // Se editing.id NÃO existe (é null ou undefined), é um novo produto
        produtoAtualizado = await ProdutoService.criar(updatedProduct);
        // Adiciona o produto SOMENTE se ele tiver um ID válido retornado pelo backend
        if (produtoAtualizado && produtoAtualizado.id != null) {
          setProducts(prev => [...prev, produtoAtualizado]); 
        } else {
          console.error("Erro: Produto criado não retornou um ID válido.", produtoAtualizado);
          alert("Erro ao criar produto: ID não retornado. Verifique o console.");
        }
      }
      
      setEditing(null);
      setIsModalOpen(false);
      window.location.reload(); // Recarrega a página após o sucesso
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      throw err; // Re-throw para que o FormModal possa capturar e exibir o erro
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
    setIsModalOpen(true);
  };

  // Abre modal para editar produto existente
  const handleEditProduct = (product) => {
    setEditing(product);
    setIsModalOpen(true);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setEditing(null);
    setIsModalOpen(false);
  };

  // Gera seções customizadas para o modal (estatísticas do produto)
  const getCustomSections = () => {
    if (!editing || !editing.id) return [];

    return [
      {
        title: 'Informações do Produto',
        className: 'bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-6 border border-gray-100',
        gridClassName: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        content: [
          <div key="id" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">ID do Produto</p>
            <p className="text-xl font-bold text-gray-900">#{editing.id}</p>
          </div>,
          <div key="preco" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Valor Atual</p>
            <p className="text-xl font-bold text-green-600">R$ {parseFloat(editing.preco || 0).toFixed(2)}</p>
          </div>,
          <div key="status" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-xl font-bold ${editing.ativo ? 'text-green-600' : 'text-red-600'}`}>
              {editing.ativo ? 'Ativo' : 'Inativo'}
            </p>
          </div>
        ]
      }
    ];
  };

  // Definição das colunas para o DataTable
  const productColumns = [
    { 
      header: 'Produto', 
      render: (product) => (
        <div className="flex items-center">
          <div className="ml-6">
            <div className="text-lg font-medium text-gray-900">{product?.nome ?? 'Nome Indefinido'}</div>
            <div className="text-base text-gray-500">ID: {product?.id ?? 'N/A'}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Descrição', 
      render: (product) => (
        <div className="text-base text-gray-500 line-clamp-2 max-w-xs">
          {product?.descricao ?? 'Sem descrição'}
        </div>
      )
    },
    { 
      header: 'Estoque', 
      render: (product) => (
        <div className="text-lg font-medium">{product?.estoque ?? 0}</div>
      )
    },
    { 
      header: 'Preço', 
      render: (product) => (
        <div className="text-lg font-bold text-green-600">R$ {parseFloat(product?.preco ?? 0).toFixed(2)}</div>
      )
    },
    { 
      header: 'Status', 
      render: (product) => (
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          product?.ativo 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product?.ativo ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
  ];

  // Estados de carregamento (loading)
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
      {/* Cabeçalho (Header) */}
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

      {/* Conteúdo (Content) */}
      <div className="p-10 max-w-8xl mx-auto">
        {/* Barra de Busca (Search Bar) */}
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

        {/* Cartões de Estatísticas (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          <WidgetStart
            title="Total de Produtos"
            value={products.length}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            )}
          />

          <WidgetStart
            title="Valor Médio"
            value={`R$ ${valorMedio}`}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            )}
          />

          <WidgetStart
            title="Em Estoque"
            value={totalEstoque}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          />
        </div>

        {/* Tabela de Produtos usando o DataTable genérico */}
        <DataTable
          title="Lista de Produtos"
          data={rows}
          columns={productColumns}
          onEdit={handleEditProduct}
          onDelete={handleDelete}
          onAdd={handleAddProduct}
          addText="Adicionar Produto"
          emptyMessage="Nenhum produto encontrado. Clique em 'Adicionar Produto' para começar."
        />
      </div>

      {/* Modal Genérico de Edição/Criação */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editing || {}}
        fields={productFields}
        title={editing && editing.id ? 'Editar Produto' : 'Adicionar Produto'}
        subtitle={editing && editing.id ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}
        saveButtonText={editing && editing.id ? 'Salvar Alterações' : 'Adicionar Produto'}
        customSections={getCustomSections()}
        modalSize="max-w-4xl"
        headerGradient="from-green-500 to-blue-500"
        iconSvg={(
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
      />
    </div>
  );
}

