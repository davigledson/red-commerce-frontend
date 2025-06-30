// perfil/enderecoTable.jsx
"use client";
import { useState, useEffect } from 'react';
import  EnderecoService  from '@/services/EnderecoService'; // Ajuste o caminho
import { useAuth } from '@/hooks/ContextoAuth'; // Ajuste o caminho
import axios from 'axios'; // Para tratamento de erros do Axios
import MineDataTable from '@/components/MineDataTable'; // Certifique-se de que este caminho está correto

export default function EnderecoTable() {
  const { loggedInUser, loading: authLoading } = useAuth(); // Renomeado para evitar conflito
  const [enderecos, setEnderecos] = useState([]);
  const [addressFormData, setAddressFormData] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    principal: false,
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressMessage, setAddressMessage] = useState({ type: '', text: '' });
  const [editingAddressId, setEditingAddressId] = useState(null); // Para controlar qual endereço está sendo editado

  // Função para carregar os endereços do usuário
  const fetchEnderecos = async () => {
    if (!loggedInUser || !loggedInUser.id) return;

    setAddressLoading(true);
    try {
      const data = await EnderecoService.listarPorUsuario(loggedInUser.id);
      setEnderecos(data);
    } catch (err) {
      console.error('Erro ao carregar endereços:', err);
      setAddressMessage({ type: 'error', text: 'Erro ao carregar endereços.' });
    } finally {
      setAddressLoading(false);
    }
  };

  // Carrega os endereços quando o componente monta ou o usuário logado muda
  useEffect(() => {
    if (!authLoading && loggedInUser) {
      fetchEnderecos();
    }
  }, [loggedInUser, authLoading]); // Depende do usuário logado e do estado de carregamento da autenticação

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    setAddressMessage({ type: '', text: '' });

    if (!loggedInUser || !loggedInUser.id) {
      setAddressMessage({ type: 'error', text: 'Usuário não logado. Não é possível cadastrar/atualizar endereço.' });
      setAddressLoading(false);
      return;
    }

    try {
      const addressData = {
        ...addressFormData,
        usuario_id: loggedInUser.id,
      };

      let response;
      if (editingAddressId) {
        // Atualizar endereço existente
        response = await EnderecoService.atualizar(editingAddressId, addressData);
        setAddressMessage({ type: 'success', text: 'Endereço atualizado com sucesso!' });
      } else {
        // Criar novo endereço
        response = await EnderecoService.criar(addressData);
        setAddressMessage({ type: 'success', text: 'Endereço cadastrado com sucesso!' });
      }
      
      // Recarrega a lista de endereços e limpa o formulário
      fetchEnderecos();
      setAddressFormData({
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: '',
        principal: false,
      });
      setEditingAddressId(null); // Sai do modo de edição
    } catch (err) {
      console.error('Erro ao cadastrar/atualizar endereço:', err);
      let errorMessage = 'Erro ao cadastrar/atualizar endereço. Por favor, tente novamente.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMessage = err.response.data.errors.join(', ');
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      setAddressMessage({ type: 'error', text: errorMessage });
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEdit = (address) => {
    setAddressFormData({
      cep: address.cep,
      rua: address.rua,
      numero: address.numero,
      complemento: address.complemento || '',
      cidade: address.cidade,
      estado: address.estado,
      principal: address.principal,
    });
    setEditingAddressId(address.id);
    setAddressMessage({ type: '', text: '' }); // Limpa mensagens
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este endereço?')) return;

    setAddressLoading(true);
    setAddressMessage({ type: '', text: '' });
    try {
      await EnderecoService.deletar(id);
      setAddressMessage({ type: 'success', text: 'Endereço deletado com sucesso!' });
      fetchEnderecos(); // Recarrega a lista
    } catch (err) {
      console.error('Erro ao deletar endereço:', err);
      setAddressMessage({ type: 'error', text: 'Erro ao deletar endereço.' });
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSetPrincipal = async (id) => {
    setAddressLoading(true);
    setAddressMessage({ type: '', text: '' });
    try {
      await EnderecoService.definirPrincipal(id);
      setAddressMessage({ type: 'success', text: 'Endereço definido como principal!' });
      fetchEnderecos(); // Recarrega a lista para atualizar o status principal
    } catch (err) {
      console.error('Erro ao definir endereço principal:', err);
      setAddressMessage({ type: 'error', text: 'Erro ao definir endereço principal.' });
    } finally {
      setAddressLoading(false);
    }
  };

  // Colunas para a MineDataTable de endereços
  const addressColumns = [
    { key: 'rua', title: 'Rua', whitespace: 'whitespace-normal' },
    { key: 'numero', title: 'Número' },
    { key: 'complemento', title: 'Complemento' },
    { key: 'cidade', title: 'Cidade' },
    { key: 'estado', title: 'Estado' },
    { key: 'cep', title: 'CEP' },
    { 
      key: 'principal', 
      title: 'Principal', 
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Sim' : 'Não'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-gray-900">Meus Endereços</h3>

      {addressMessage.text && (
        <div className={`p-3 rounded-md ${addressMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {addressMessage.text}
        </div>
      )}

      {/* Formulário de Cadastro/Edição de Endereço */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-medium text-gray-900 mb-4">{editingAddressId ? 'Editar Endereço' : 'Cadastrar Novo Endereço'}</h4>
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={addressFormData.cep}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={addressFormData.rua}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={addressFormData.numero}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">Complemento (Opcional)</label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={addressFormData.complemento}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={addressFormData.cidade}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={addressFormData.estado}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="principal"
              name="principal"
              checked={addressFormData.principal}
              onChange={handleAddressChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="principal" className="ml-2 block text-sm text-gray-900">
              Definir como endereço principal
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            {editingAddressId && (
              <button
                type="button"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressFormData({
                    cep: '', rua: '', numero: '', complemento: '', cidade: '', estado: '', principal: false,
                  });
                  setAddressMessage({ type: '', text: '' });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar Edição
              </button>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
              disabled={addressLoading}
            >
              {addressLoading ? (editingAddressId ? 'Atualizando...' : 'Cadastrando...') : (editingAddressId ? 'Atualizar Endereço' : 'Cadastrar Endereço')}
            </button>
          </div>
        </form>
      </div>

      {/* Tabela de Endereços Existentes */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <h4 className="text-lg font-medium text-gray-900 p-6 border-b border-gray-200">Endereços Cadastrados</h4>
        {addressLoading && enderecos.length === 0 ? (
          <p className="p-6 text-gray-600">Carregando endereços...</p>
        ) : enderecos.length === 0 ? (
          <p className="p-6 text-gray-600">Nenhum endereço cadastrado ainda.</p>
        ) : (
          <MineDataTable
            columns={addressColumns}
            data={enderecos}
            rowActions={(row) => (
              <>
                <button
                  onClick={() => handleEdit(row)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="text-red-600 hover:text-red-900 mr-4"
                >
                  Deletar
                </button>
                {!row.principal && ( // Só mostra o botão se não for o principal
                  <button
                    onClick={() => handleSetPrincipal(row.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Definir como Principal
                  </button>
                )}
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}
