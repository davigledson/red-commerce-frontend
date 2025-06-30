// src/app/admin/usuarios/page.js
'use client';
import { useState, useEffect } from 'react';
import FormModal from '@/components/FormModal';
import WidgetStart from '@/components/WidgetStart';
import DataTable from '@/components/DataTable';

import UsuarioService from '@/services/UsuarioService';

export default function AdminUsuarios() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carrega os usuários
  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        setLoading(true);
        const data = await UsuarioService.listarTodos();
        
        // Filtro para garantir que apenas usuários válidos sejam adicionados ao estado
        const validUsers = data.filter(u => 
          u && typeof u === 'object' && u.id != null && typeof u.email === 'string'
        );
        setUsers(validUsers);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar usuários:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuarios();
  }, []);

  // Filtra usuários pela busca
  const rows = users.filter(u => 
    (u.nome && u.nome.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Calcula estatísticas
  const totalAdmins = users.filter(u => u.papel === 'admin').length;
  const totalClientes = users.filter(u => u.papel === 'cliente').length;
  const usuariosComNome = users.filter(u => u.nome && u.nome.trim() !== '').length;

  // Configuração dos campos do formulário para o FormModal
  const userFields = [
    {
      name: 'nome',
      label: 'Nome Completo',
      type: 'text',
      placeholder: 'Digite o nome completo do usuário',
      required: false
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      placeholder: 'usuario@exemplo.com',
      required: true
    },
    {
      name: 'senha',
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite a senha (deixe em branco para manter)',
      required: false,
      note: editing && editing.id ? 'Deixe em branco para manter a senha atual' : 'Obrigatório para novos usuários'
    },
    {
      name: 'papel',
      label: 'Papel/Função',
      type: 'select',
      options: [
        { value: 'cliente', label: 'Cliente' },
        { value: 'admin', label: 'Administrador' }
      ],
      required: true
    }
  ];

  // Manipulador para salvar usuário
  const handleSave = async (formData) => {
    try {
      // Remove campos vazios de senha para edição
      const updatedUser = { ...formData };
      if (editing && editing.id && (!formData.senha || formData.senha.trim() === '')) {
        delete updatedUser.senha;
      }

      let usuarioAtualizado;
      
      // Se editing.id existe e não é null/undefined, é uma atualização
      if (editing && editing.id != null) { 
        updatedUser.id = editing.id; // Garante que o ID seja incluído
        usuarioAtualizado = await UsuarioService.atualizar(editing.id, updatedUser);
        setUsers(prev => 
          prev.map(u => u.id === editing.id ? usuarioAtualizado : u)
        );
      } else { // Se editing.id NÃO existe (é null ou undefined), é um novo usuário
        usuarioAtualizado = await UsuarioService.criar(updatedUser);
        // Adiciona o usuário SOMENTE se ele tiver um ID válido retornado pelo backend
        if (usuarioAtualizado && usuarioAtualizado.id != null) {
          setUsers(prev => [...prev, usuarioAtualizado]); 
        } else {
          console.error("Erro: Usuário criado não retornou um ID válido.", usuarioAtualizado);
          alert("Erro ao criar usuário: ID não retornado. Verifique o console.");
        }
      }
      
      setEditing(null);
      setIsModalOpen(false);
      window.location.reload(); // Recarrega a página após o sucesso
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      throw err; // Re-throw para que o FormModal possa capturar e exibir o erro
    }
  };

  // Manipulador para deletar usuário
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await UsuarioService.deletar(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        alert('Erro ao deletar usuário');
      }
    }
  };

  // Abre modal para adicionar novo usuário
  const handleAddUser = () => {
    setEditing({
      nome: '',
      email: '',
      senha: '',
      papel: 'cliente'
    });
    setIsModalOpen(true);
  };

  // Abre modal para editar usuário existente
  const handleEditUser = (user) => {
    setEditing({
      ...user,
      senha: '' // Não pré-preenche a senha por segurança
    });
    setIsModalOpen(true);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setEditing(null);
    setIsModalOpen(false);
  };

  // Gera seções customizadas para o modal (informações do usuário)
  const getCustomSections = () => {
    if (!editing || !editing.id) return [];

    const createdDate = editing.created_at ? new Date(editing.created_at).toLocaleDateString('pt-BR') : 'N/A';
    const updatedDate = editing.updated_at ? new Date(editing.updated_at).toLocaleDateString('pt-BR') : 'N/A';

    return [
      {
        title: 'Informações do Usuário',
        className: 'bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100',
        gridClassName: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        content: [
          <div key="id" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">ID do Usuário</p>
            <p className="text-xl font-bold text-gray-900">#{editing.id}</p>
          </div>,
          <div key="created" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Criado em</p>
            <p className="text-xl font-bold text-blue-600">{createdDate}</p>
          </div>,
          <div key="papel" className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Função</p>
            <p className={`text-xl font-bold ${editing.papel === 'admin' ? 'text-purple-600' : 'text-green-600'}`}>
              {editing.papel === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        ]
      }
    ];
  };

  // Definição das colunas para o DataTable
  const userColumns = [
    { 
      header: 'Usuário', 
      render: (user) => (
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold text-lg">
              {user?.nome ? user.nome.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div>
            <div className="text-lg font-medium text-gray-900">
              {user?.nome || 'Nome não informado'}
            </div>
            <div className="text-base text-gray-500">{user?.email ?? 'Email não informado'}</div>
            <div className="text-sm text-gray-400">ID: {user?.id ?? 'N/A'}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Papel', 
      render: (user) => (
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          user?.papel === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {user?.papel === 'admin' ? 'Administrador' : 'Cliente'}
        </span>
      )
    },
    { 
      header: 'Criado em', 
      render: (user) => (
        <div className="text-base text-gray-600">
          {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
        </div>
      )
    },
    { 
      header: 'Atualizado em', 
      render: (user) => (
        <div className="text-base text-gray-600">
          {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('pt-BR') : 'N/A'}
        </div>
      )
    }
  ];

  // Estados de carregamento (loading)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  // Estados de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-30 from-blue-50 to-purple-50">
      {/* Cabeçalho (Header) */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-10 py-10 shadow-lg">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Gerenciar Usuários</h1>
            <p className="text-blue-100 text-xl">Administre os usuários do sistema</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <span className="text-white font-medium text-lg">{rows.length} usuários</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
              placeholder="Buscar usuários por nome ou email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <svg className="w-7 h-7 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Cartões de Estatísticas (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          <WidgetStart
            title="Total de Usuários"
            value={users.length}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            )}
          />

          <WidgetStart
            title="Administradores"
            value={totalAdmins}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
          />

          <WidgetStart
            title="Clientes"
            value={totalClientes}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            icon={(
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          />
        </div>

        {/* Tabela de Usuários usando o DataTable genérico */}
        <DataTable
          title="Lista de Usuários"
          data={rows}
          columns={userColumns}
          onEdit={handleEditUser}
          onDelete={handleDelete}
          onAdd={handleAddUser}
          addText="Adicionar Usuário"
          emptyMessage="Nenhum usuário encontrado. Clique em 'Adicionar Usuário' para começar."
        />
      </div>

      {/* Modal Genérico de Edição/Criação */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editing || {}}
        fields={userFields}
        title={editing && editing.id ? 'Editar Usuário' : 'Adicionar Usuário'}
        subtitle={editing && editing.id ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
        saveButtonText={editing && editing.id ? 'Salvar Alterações' : 'Adicionar Usuário'}
        customSections={getCustomSections()}
        modalSize="max-w-4xl"
        headerGradient="from-blue-500 to-purple-500"
        iconSvg={(
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        )}
      />
    </div>
  );
}