
import { useState } from 'react';
export default function Configuracoes() {

const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    city: 'São Paulo',
    state: 'SP',
    bio: 'Amante de plantas e jardinagem. Sempre em busca de novas espécies para minha coleção.',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
    
  });

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notifications.')) {
      const notificationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  return (
   
    <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-gray-900">Configurações da Conta</h3>

                {/* Notificações */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Notificações</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Notificações por Email</p>
                        <p className="text-sm text-gray-500">Receba atualizações sobre pedidos e ofertas</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications.email"
                          checked={formData.notifications.email}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.notifications.email ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Notificações SMS</p>
                        <p className="text-sm text-gray-500">Receba alertas importantes por SMS</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications.sms"
                          checked={formData.notifications.sms}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.notifications.sms ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Notificações Push</p>
                        <p className="text-sm text-gray-500">Notificações do navegador em tempo real</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications.push"
                          checked={formData.notifications.push}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.notifications.push ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Segurança */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Segurança</h4>
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Alterar Senha</p>
                          <p className="text-sm text-gray-500">Última alteração há 3 meses</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Autenticação de Dois Fatores</p>
                          <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Zona de Perigo */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h4 className="text-lg font-medium text-red-900 mb-4">Zona de Perigo</h4>
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 bg-white rounded-lg border border-red-200 hover:border-red-400 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">Excluir Conta</p>
                          <p className="text-sm text-red-600">Esta ação não pode ser desfeita</p>
                        </div>
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
  );
}
