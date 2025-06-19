'use client';
import EditModal from '@/components/EditModal';
import { use, useState } from 'react';
// Dados de exemplo
const produtosExample = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    category: ["Plantas de Interior", "Tropical"],
    store: "Verde Vida",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    description: "Planta tropical de grande porte, ideal para ambientes internos com boa luminosidade."
  },
  {
    id: 2,
    name: "Suculenta Echeveria",
    category: ["Suculentas", "Fácil Cuidado"],
    store: "Cactus Shop",
    price: 25.50,
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop",
    description: "Suculenta resistente, perfeita para iniciantes no cultivo de plantas."
  },
  {
    id: 3,
    name: "Ficus Lyrata",
    category: ["Plantas de Interior", "Grande Porte"],
    store: "Plant Paradise",
    price: 159.00,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    description: "Árvore de folhas grandes e decorativas, ideal para dar destaque a qualquer ambiente."
  },
  {
    id: 4,
    name: "Zamioculcas",
    category: ["Plantas de Interior", "Resistente"],
    store: "Verde Vida",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=400&fit=crop",
    description: "Planta extremamente resistente, tolera pouca luz e regas espaçadas."
  },
  {
    id: 5,
    name: "Pothos Dourado",
    category: ["Plantas Pendentes", "Fácil Cuidado"],
    store: "Plant Paradise",
    price: 45.90,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    description: "Planta pendente com folhagem dourada, cresce rapidamente e purifica o ar."
  }
];

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(produtosExample);
  const [editing, setEditing] = useState(null);

  const rows = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(updated) {
    setProducts(prev =>
      prev.map(p => (p.id === updated.id ? updated : p))
    );
    setEditing(null);
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
              placeholder="Buscar plantas..."
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
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-base text-gray-600">Total de Produtos</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-base text-gray-600">Valor Médio</p>
                <p className="text-3xl font-bold text-gray-900">
                  R$ {(products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-base text-gray-600">Lojas Ativas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(products.map(p => p.store)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-2xl font-semibold text-gray-900">Lista de Produtos</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Categorias</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Loja</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map(plant => (
                  <tr key={plant.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-20 w-20">
                          <img className="h-20 w-20 rounded-xl object-cover shadow-sm" src={plant.image} alt={plant.name} />
                        </div>
                        <div className="ml-6">
                          <div className="text-lg font-medium text-gray-900">{plant.name}</div>
                          <div className="text-base text-gray-500">ID: {plant.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {plant.category.map(cat => (
                          <span key={cat} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base text-gray-900 font-medium">{plant.store}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">R$ {plant.price.toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditing(plant)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-sm text-base font-medium"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {rows.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.535-2.854M15 17h3.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0022 13.586V6a1 1 0 00-1-1H3a1 1 0 00-1 1v7.586a1 1 0 00.293.707l2.414 2.414A1 1 0 005.414 17H9" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-2 text-base text-gray-500">Tente ajustar sua busca para encontrar produtos.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <EditModal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        product={editing}
      />
    </div>
  );
}