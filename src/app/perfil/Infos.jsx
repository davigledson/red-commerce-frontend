// perfil/infos.jsx
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/ContextoAuth'; // Ajuste o caminho conforme a localização do seu AuthContext

export default function Infos() {
  const { loggedInUser, loading } = useAuth(); // Obtenha o usuário logado e o estado de carregamento do contexto

  const [formData, setFormData] = useState({
    name: '', // Será preenchido pelo useEffect
    email: '', // Será preenchido pelo useEffect
    phone: '', // Exemplo: adicione estes campos ao seu modelo de usuário no Rails se precisar salvá-los
    city: '',
    state: '',
    bio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // Para mensagens de sucesso/erro

  // useEffect para preencher o formData com os dados do usuário logado
  useEffect(() => {
    if (!loading && loggedInUser) {
      setFormData(prev => ({
        ...prev,
        name: loggedInUser.nome || '', // Use o nome do usuário, ou vazio se null
        email: loggedInUser.email || '', // Use o email do usuário
        // Se você tiver outros campos no seu modelo de usuário (ex: phone, city, bio),
        // você os preencheria aqui:
        // phone: loggedInUser.phone || '',
        // city: loggedInUser.city || '',
        // bio: loggedInUser.bio || '',
      }));
    }
  }, [loggedInUser, loading]); // Depende de loggedInUser e loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Dados salvos:', formData);
    // TODO: Implementar a lógica para enviar os dados atualizados para o backend
    // Exemplo:
    // try {
    //   await UsuarioService.atualizar(loggedInUser.id, { nome: formData.name, email: formData.email, ...outrosCampos });
    //   setMessage({ type: 'success', text: 'Informações atualizadas com sucesso!' });
    //   setIsEditing(false);
    //   // Opcional: Atualizar o contexto de autenticação com os novos dados do usuário
    //   // updateLoggedInUser({ ...loggedInUser, nome: formData.name, email: formData.email });
    // } catch (error) {
    //   setMessage({ type: 'error', text: 'Erro ao atualizar informações. Tente novamente.' });
    //   console.error('Erro ao salvar perfil:', error);
    // }
    setMessage({ type: 'success', text: 'Informações salvas (simulado)!' }); // Simulação
    setIsEditing(false);
  };

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
            name="name"
            value={formData.name}
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
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <input
            type="text"
            name="city"
            value={formData.city}
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
            onClick={() => {
              setIsEditing(false);
              setMessage({ type: '', text: '' }); // Limpa mensagem ao cancelar
              // Opcional: Resetar formData para os valores originais do loggedInUser
              if (loggedInUser) {
                setFormData(prev => ({
                  ...prev,
                  name: loggedInUser.nome || '',
                  email: loggedInUser.email || '',
                  // ... outros campos
                }));
              }
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
          >
            Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
}
