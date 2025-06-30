// perfil/infos.jsx
"use client";
import { useState, useEffect, useCallback } from 'react'; // Adicione useCallback
import { useAuth } from '@/hooks/ContextoAuth';
import UsuarioService from '@/services/UsuarioService'; // Importe o UsuarioService
import axios from 'axios'; // Para tratamento de erros do Axios

export default function Infos() {
  const { loggedInUser, loading: authLoading, login: updateAuthUser } = useAuth(); // Obtenha a função 'login' do contexto para atualizar o usuário
  
  const [formData, setFormData] = useState({
    nome: '', // Corrigido para 'nome' conforme seu schema
    email: '',
    telefone: '', // Adicione estes campos se existirem no seu modelo de usuário
    cidade: '',
    estado: '', // Adicione este campo se existir no seu modelo de usuário
    bio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false); // Estado para indicar que está salvando

  // Função para preencher o formData com os dados do usuário logado
  const fillFormData = useCallback(() => {
    if (loggedInUser) {
      setFormData({
        nome: loggedInUser.nome || '',
        email: loggedInUser.email || '',
        telefone: loggedInUser.telefone || '', // Adapte conforme seu modelo
        cidade: loggedInUser.cidade || '',     // Adapte conforme seu modelo
        estado: loggedInUser.estado || '',     // Adapte conforme seu modelo
        bio: loggedInUser.bio || '',           // Adapte conforme seu modelo
      });
    }
  }, [loggedInUser]);

  // useEffect para preencher o formData quando o usuário logado for carregado
  useEffect(() => {
    if (!authLoading && loggedInUser) {
      fillFormData();
    }
  }, [loggedInUser, authLoading, fillFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' }); // Limpa mensagens anteriores

    if (!loggedInUser || !loggedInUser.id) {
      setMessage({ type: 'error', text: 'Usuário não logado. Não é possível salvar.' });
      setSaving(false);
      return;
    }

    try {
      // Prepara os dados para enviar ao backend
      const updates = {
        nome: formData.nome,
        // email: formData.email, // Geralmente não se permite alterar email diretamente aqui
        telefone: formData.telefone,
        cidade: formData.cidade,
        estado: formData.estado,
        bio: formData.bio,
      };

      const updatedUser = await UsuarioService.atualizar(loggedInUser.id, updates);
      
      // Atualiza o contexto de autenticação com os novos dados do usuário
      // A função 'login' do contexto pode ser usada para isso, pois ela atualiza o loggedInUser
      updateAuthUser(updatedUser, localStorage.getItem('authToken')); // Passa o token existente

      setMessage({ type: 'success', text: 'Informações atualizadas com sucesso!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      let errorMessage = 'Erro ao atualizar informações. Tente novamente.';
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (error.response.data.errors) {
          errorMessage = error.response.data.errors.join(', ');
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ type: '', text: '' }); // Limpa mensagem ao cancelar
    fillFormData(); // Restaura os dados originais do usuário logado
  };

  // Renderiza um estado de carregamento se o usuário ainda não foi carregado
  if (authLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-700">Carregando informações do usuário...</p>
      </div>
    );
  }

  // Renderiza uma mensagem se não houver usuário logado (embora o UserProfile já redirecione)
  if (!loggedInUser) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-lg">Você precisa estar logado para ver suas informações.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-900">Informações Pessoais</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
          <input
            type="text"
            name="nome" // Corrigido para 'nome'
            value={formData.nome}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={true} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <input
            type="text"
            name="telefone" // Corrigido para 'telefone'
            value={formData.telefone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <input
            type="text"
            name="cidade" // Corrigido para 'cidade'
            value={formData.cidade}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sobre Mim</label>
        <textarea
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
        />
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel} // Chama a nova função handleCancel
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
            disabled={saving} // Desabilita o botão enquanto salva
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      )}
    </div>
  );
}
