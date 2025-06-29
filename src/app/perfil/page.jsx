"use client";
import { useState } from 'react';
import MineDataTable from '@/components/MineDataTable';

import EnderecoTable from './EnderecoTable';
import Infos from './Infos';
import Configuracoes from './Configuracoes';

export default function UserProfile() {


  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);



  const handleSave = () => {
    console.log('Dados salvos:', formData);
    setIsEditing(false);
  };

  // Dados de estatísticas do usuário
  const userStats = {
    plantsOwned: 23,
    favoriteStores: 5,
    totalSpent: 1250.90,
    reviewsWritten: 12
  };

  // Dados dos pedidos
  const orders = [
    {
      id: '#001',
      date: '15/06/2025',
      items: 'Samambaia, Suculenta Jade',
      total: 89.90,
      status: 'Entregue',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '#002',
      date: '20/06/2025',
      items: 'Monstera Deliciosa, Vaso Cerâmica',
      total: 156.50,
      status: 'Em Trânsito',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: '#003',
      date: '22/06/2025',
      items: 'Fertilizante Orgânico, Substrato',
      total: 45.20,
      status: 'Processando',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ];

  // Dados do carrinho
  const cartItems = [
    {
      id: 1,
      name: 'Ficus Lyrata',
      price: 129.90,
      quantity: 1,
      image: '🌿'
    },
    {
      id: 2,
      name: 'Vaso Decorativo Grande',
      price: 85.00,
      quantity: 2,
      image: '🏺'
    },
    {
      id: 3,
      name: 'Kit Ferramentas Jardinagem',
      price: 67.50,
      quantity: 1,
      image: '🛠️'
    }
  ];

  // Dados dos favoritos
  const favorites = [
    {
      id: 1,
      name: 'Costela de Adão',
      price: 89.90,
      store: 'Verde Vida',
      image: '🌱'
    },
    {
      id: 2,
      name: 'Espada de São Jorge',
      price: 45.00,
      store: 'Plantas & Cia',
      image: '🌿'
    },
    {
      id: 3,
      name: 'Palmeira Ráfia',
      price: 199.90,
      store: 'Garden Center',
      image: '🌴'
    },
    {
      id: 4,
      name: 'Cacto Mandacaru',
      price: 35.50,
      store: 'Suculentas Brasil',
      image: '🌵'
    }
  ];

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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Plantas</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.plantsOwned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Lojas Favoritas</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.favoriteStores}</p>
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
                <p className="text-2xl font-bold text-gray-900">R$ {userStats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avaliações</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.reviewsWritten}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
            <nav className="flex space-x-8 px-8">
  <button
    onClick={() => setActiveTab('personal')}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === 'personal'
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    Informações Pessoais
  </button>
  <button
    onClick={() => setActiveTab('orders')}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === 'orders'
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    Meus Pedidos
  </button>
  <button
    onClick={() => setActiveTab('cart')}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === 'cart'
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    Meu Carrinho
  </button>
  <button
    onClick={() => setActiveTab('favorites')}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === 'favorites'
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    Favoritos
  </button>

 <button
    onClick={() => setActiveTab('address')}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === 'address'
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    Endereços
  </button>

  <button
    onClick={() => setActiveTab('settings')}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === 'settings'
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    Configurações
  </button>
</nav>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'personal' && (
             <Infos></Infos>
            )}

            {activeTab === 'history' && (
              <div className="space-y-8">
                {/* Pedidos */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Meus Pedidos</h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <MineDataTable
  columns={[
    { key: 'id', title: 'Pedido' },
    { key: 'date', title: 'Data' },
    { key: 'items', title: 'Itens', whitespace: 'whitespace-normal' },
    { key: 'total', title: 'Total', render: (value) => `R$ ${value.toFixed(2)}` },
    { 
      key: 'status', 
      title: 'Status', 
      render: (value, row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.statusColor}`}>
          {value}
        </span>
      )
    }
  ]}
  data={orders}
/>
                    </div>
                  </div>
                </div>

                {/* Carrinho */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Carrinho de Compras</h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                     <MineDataTable
  columns={[
    { 
      key: 'name', 
      title: 'Produto', 
      render: (value, row) => (
        <div className="flex items-center">
          <span className="text-2xl mr-3">{row.image}</span>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'price', title: 'Preço', render: (value) => `R$ ${value.toFixed(2)}` },
    { key: 'quantity', title: 'Quantidade' },
    { 
      key: 'subtotal', 
      title: 'Subtotal', 
      render: (_, row) => `R$ ${(row.price * row.quantity).toFixed(2)}` 
    }
  ]}
  data={cartItems}
  rowActions={(row) => (
    <button className="text-red-600 hover:text-red-900">Remover</button>
  )}
  showFooter
  footerContent={
    <div className="flex justify-between items-center">
      <span className="text-lg font-semibold text-gray-900">Total:</span>
      <span className="text-lg font-bold text-green-600">
        R$ {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
      </span>
    </div>
  }
/>
                    </div>
                  
                  </div>
                </div>

                {/* Favoritos */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Produtos Favoritos</h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                     <MineDataTable
  columns={[
    { 
      key: 'name', 
      title: 'Produto', 
      render: (value, row) => (
        <div className="flex items-center">
          <span className="text-2xl mr-3">{row.image}</span>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'price', title: 'Preço', render: (value) => `R$ ${value.toFixed(2)}` },
    { key: 'store', title: 'Loja' }
  ]}
  data={favorites}
  rowActions={(row) => (
    <>
      <button className="text-green-600 hover:text-green-900">Comprar</button>
      <button className="text-red-600 hover:text-red-900">Remover</button>
    </>
  )}
/>
                    </div>
                  </div>
                </div>
              </div>
            )}

             {activeTab === 'settings' && (
             <Configuracoes></Configuracoes>
            )}

            {activeTab === 'orders' && (
  <div className="space-y-6" >
    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Meus Pedidos</h3>
    <MineDataTable
      columns={[
        { key: 'id', title: 'Pedido' },
        { key: 'date', title: 'Data' },
        { key: 'items', title: 'Itens', whitespace: 'whitespace-normal' },
        { key: 'total', title: 'Total', render: (value) => `R$ ${value.toFixed(2)}` },
        { 
          key: 'status', 
          title: 'Status', 
          render: (value, row) => (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.statusColor}`}>
              {value}
            </span>
          )
        }
      ]}
      data={orders}
    />
  </div>
)}

{activeTab === 'cart' && (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Meu Carrinho</h3>
    <MineDataTable
      columns={[
        { 
          key: 'name', 
          title: 'Produto', 
          render: (value, row) => (
            <div className="flex items-center">
              <span className="text-2xl mr-3">{row.image}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          )
        },
        { key: 'price', title: 'Preço', render: (value) => `R$ ${value.toFixed(2)}` },
        { key: 'quantity', title: 'Quantidade' },
        { 
          key: 'subtotal', 
          title: 'Subtotal', 
          render: (_, row) => `R$ ${(row.price * row.quantity).toFixed(2)}` 
        }
      ]}
      data={cartItems}
      rowActions={(row) => (
        <button className="text-red-600 hover:text-red-900">Remover</button>
      )}
      showFooter
      footerContent={
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-lg font-bold text-green-600">
            R$ {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
          </span>
        </div>
      }
    />
  </div>
)}{activeTab === 'favorites' && (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Meus Favoritos</h3>
    <MineDataTable
      columns={[
        { 
          key: 'name', 
          title: 'Produto', 
          render: (value, row) => (
            <div className="flex items-center">
              <span className="text-2xl mr-3">{row.image}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          )
        },
        { key: 'price', title: 'Preço', render: (value) => `R$ ${value.toFixed(2)}` },
        { key: 'store', title: 'Loja' }
      ]}
      data={favorites}
      rowActions={(row) => (
        <>
          <button className="text-green-600 hover:text-green-900">Comprar</button>
          <button className="text-red-600 hover:text-red-900">Remover</button>
        </>
      )}
    />
  </div>
)}{activeTab === 'address' && (
  <div className="space-y-6">
   <EnderecoTable>

   </EnderecoTable>
  </div>
)}
         
          </div>
        </div>
      </div>
    </div>
  );
}