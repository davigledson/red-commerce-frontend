// src/app/admin/categorias/page.js
'use client';
import { useState, useEffect } from 'react';
import FormModal from '@/components/FormModal';
import WidgetStart from '@/components/WidgetStart';
import DataTable from '@/components/DataTable';
import Header from '@/components/dashboard/Header';

import CategoriaService from '@/services/CategoriaService';

export default function AdminCategorias() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carrega as categorias
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        setLoading(true);
        const data = await CategoriaService.listarTodos();
        
        // Filtro para garantir que apenas categorias válidas sejam adicionadas ao estado
        const validCategories = data.filter(c => 
          c && typeof c === 'object' && c.id != null && typeof c.nome === 'string'
        );
        setCategories(validCategories);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar categorias:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarCategorias();
  }, []);

  // Filtra categorias pela busca
  const rows = categories.filter(c => 
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Configuração dos campos do formulário para o FormModal
  const categoryFields = [
    {
      name: 'nome',
      label: 'Nome da Categoria',
      type: 'text',
      placeholder: 'Digite o nome da categoria',
      required: true
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      rows: 5,
      placeholder: 'Descreva a categoria e que tipos de produtos ela inclui...',
      fullWidth: true
    }
  ];

  // Manipulador para salvar categoria
  const handleSave = async (formData) => {
    try {
      let categoriaAtualizada;
      
      // Se editing.id existe e não é null/undefined, é uma atualização
      if (editing && editing.id != null) { 
        formData.id = editing.id; // Garante que o ID seja incluído
        categoriaAtualizada = await CategoriaService.atualizar(editing.id, formData);
        setCategories(prev => 
          prev.map(c => c.id === editing.id ? categoriaAtualizada : c)
        );
      } else { // Se editing.id NÃO existe (é null ou undefined), é uma nova categoria
        categoriaAtualizada = await CategoriaService.criar(formData);
        // Adiciona a categoria SOMENTE se ela tiver um ID válido retornado pelo backend
        if (categoriaAtualizada && categoriaAtualizada.id != null) {
          setCategories(prev => [...prev, categoriaAtualizada]); 
        } else {
          console.error("Erro: Categoria criada não retornou um ID válido.", categoriaAtualizada);
          alert("Erro ao criar categoria: ID não retornado. Verifique o console.");
        }
      }
      
      setEditing(null);
      setIsModalOpen(false);
      window.location.reload(); // Recarrega a página após o sucesso
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      throw err; // Re-throw para que o FormModal possa capturar e exibir o erro
    }
  };

  // Manipulador para deletar categoria
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await CategoriaService.deletar(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('Erro ao deletar categoria:', err);
        alert('Erro ao deletar categoria');
      }
    }
  };

  // Abre modal para adicionar nova categoria
  const handleAddCategory = () => {
    setEditing({
      nome: '',
      descricao: ''
    });
    setIsModalOpen(true);
  };

  // Abre modal para editar categoria existente
  const handleEditCategory = (category) => {
    setEditing(category);
    setIsModalOpen(true);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setEditing(null);
    setIsModalOpen(false);
  };

  // Gera seções customizadas para o modal (informações da categoria)
  const getCustomSections = () => {
    if (!editing || !editing.id) return [];

    return [
      {
        title: 'Informações da Categoria',
        className: 'bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 border border-gray-100',
        gridClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        content: [
          <div key="id" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">ID da Categoria</p>
            <p className="text-xl font-bold text-gray-900">#{editing.id}</p>
          </div>,
          <div key="created" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Data de Criação</p>
            <p className="text-lg font-medium text-purple-600">
              {editing.created_at ? new Date(editing.created_at).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
          </div>
        ]
      }
    ];
  };

  // Definição das colunas para o DataTable
  const categoryColumns = [
    { 
      header: 'Categoria', 
      render: (category) => (
        <div className="flex items-center">
          <div className="ml-6">
            <div className="text-lg font-medium text-gray-900">{category?.nome ?? 'Nome Indefinido'}</div>
            <div className="text-base text-gray-500">ID: {category?.id ?? 'N/A'}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Descrição', 
      render: (category) => (
        <div className="text-base text-gray-500 line-clamp-3 max-w-md">
          {category?.descricao ?? 'Sem descrição'}
        </div>
      )
    },
    { 
      header: 'Data de Criação', 
      render: (category) => (
        <div className="text-sm text-gray-600">
          {category?.created_at ? new Date(category.created_at).toLocaleDateString('pt-BR') : 'N/A'}
        </div>
      )
    },
    { 
      header: 'Última Atualização', 
      render: (category) => (
        <div className="text-sm text-gray-600">
          {category?.updated_at ? new Date(category.updated_at).toLocaleDateString('pt-BR') : 'N/A'}
        </div>
      )
    }
  ];

  // Estados de carregamento (loading)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando categorias...</p>
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
        title="Gerenciar Categorias"
        subtitle="Organize suas categorias de produtos"
        count={rows.length}
        countLabel="categorias"
        gradientFrom="from-purple-500"
        gradientTo="to-blue-500"
        subtitleColor="text-purple-100"
        icon={
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
      
      {/* Conteúdo (Content) */}
      <div className="p-10 max-w-8xl mx-auto">
        {/* Barra de Busca (Search Bar) */}
        <div className="mb-10">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Buscar categorias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <svg className="w-7 h-7 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Cartões de Estatísticas (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          <WidgetStart
            title="Total de Categorias"
            value={categories.length}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          />

          <WidgetStart
            title="Categorias Ativas"
            value={categories.length}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          />

          <WidgetStart
            title="Última Atualização"
            value={categories.length > 0 ? "Hoje" : "N/A"}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          />
        </div>

        {/* Tabela de Categorias usando o DataTable genérico */}
        <DataTable
          title="Lista de Categorias"
          data={rows}
          columns={categoryColumns}
          onEdit={handleEditCategory}
          onDelete={handleDelete}
          onAdd={handleAddCategory}
          addText="Adicionar Categoria"
          emptyMessage="Nenhuma categoria encontrada. Clique em 'Adicionar Categoria' para começar."
        />
      </div>

      {/* Modal Genérico de Edição/Criação */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editing || {}}
        fields={categoryFields}
        title={editing && editing.id ? 'Editar Categoria' : 'Adicionar Categoria'}
        subtitle={editing && editing.id ? 'Atualize as informações da categoria' : 'Preencha os dados da nova categoria'}
        saveButtonText={editing && editing.id ? 'Salvar Alterações' : 'Adicionar Categoria'}
        customSections={getCustomSections()}
        modalSize="max-w-3xl"
        headerGradient="from-purple-500 to-blue-500"
        iconSvg={(
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}
      />
    </div>
  );
}