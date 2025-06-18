'use client';

import { useState } from 'react';
import Image from 'next/image';
import produtosJson from '@/data/produtos.json';
import EditModal from '@/components/EditModal'; // modal com Flowbite React

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(produtosJson);
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
    <div className="p-8 bg-gray-100 mt-20 min-h-screen">
      <input
        type="text"
        placeholder="Buscar plantas..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="px-4 py-2 mb-6 w-80 border rounded-lg"
      />

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-600 text-lg uppercase">
          <tr>
            <th className="px-6 py-4">Imagem</th>
            <th className="px-6 py-4">Nome</th>
            <th className="px-6 py-4">Categorias</th>
            <th className="px-6 py-4">Loja</th>
            <th className="px-6 py-4">Preço</th>
            <th className="px-6 py-4">Ação</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(plant => (
            <tr key={plant.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 w-20 h-20">
                <Image src={plant.image} alt={plant.name} width={64} height={64} className="rounded" />
              </td>
              <td className="px-6 py-4 font-medium">{plant.name}</td>
              <td className="px-6 py-4">
                {plant.category.map(cat => (
                  <span key={cat} className="inline-block bg-green-100 text-green-800 text-sm px-2 rounded-full mr-1">
                    {cat}
                  </span>
                ))}
              </td>
              <td className="px-6 py-4">{plant.store}</td>
              <td className="px-6 py-4 text-green-700 font-semibold">R$ {plant.price.toFixed(2)}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => setEditing(plant)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditModal
        open={Boolean(editing)}
        product={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  );
}
