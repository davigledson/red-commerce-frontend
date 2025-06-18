// src/app/cart/page.jsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function CartPage() {
  // Estado inicial com dados de exemplo
  const [items, setItems] = useState([
    {
      id: '1',
      name: 'Nome do produto',
      category: 'Categoria',
      price: 120,
      image: '/imgs/planta.png',
      quantity: 2,

      
    },
     {
      id: '2',
      name: 'Nome do produto',
      category: 'Categoria',
      price: 120,
      image: '/imgs/planta.png',
      quantity: 2,

      
    },
    
  ]);

  // Atualiza quantidade de um item
  function updateQuantity(id, delta) {
    setItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty > 0 ? newQty : 1 };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  }

  // Calcula subtotal
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
  <div className="max-w-screen-xl mx-auto mt-16 p-10 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 scale-[1.05]">
    {/* Lista de itens */}
   <div className="space-y-8">
  <h1 className="text-5xl font-bold">Seu carrinho</h1>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] text-left table-auto border-separate border-spacing-y-6 text-xl">
      <thead className="text-gray-600 text-lg uppercase">
        <tr>
          <th className="pl-4 py-4">Produto</th>
          <th className="py-4">Preço</th>
          <th className="py-4">Quantidade</th>
          <th className="py-4">Total</th>
          <th className="py-4"></th>
        </tr>
      </thead>

      <tbody>
        {items.map(item => (
          <tr key={item.id} className="bg-white shadow rounded-xl">
            <td className="flex items-center gap-6 pl-4 py-6">
              <div className="w-28 h-28 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-gray-500 text-base">{item.category}</div>
              </div>
            </td>

            <td className="font-semibold py-6">R$ {item.price.toFixed(2)}</td>

            <td>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                >
                  –
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, +1)}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </td>

            <td className="font-semibold py-6">
              R$ {(item.price * item.quantity).toFixed(2)}
            </td>

            <td className="py-6">
              <button
                onClick={() =>
                  setItems(prev => prev.filter(i => i.id !== item.id))
                }
                className="text-gray-400 hover:text-red-600 text-xl"
              >
                ×
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


    {/* Resumo da compra */}
    <div className="bg-gray-50 p-8 rounded-lg shadow text-base">
      <h2 className="text-2xl font-semibold mb-4">Resumo da compra</h2>
      <div className="flex justify-between mb-2">
        <span>Sub‑total</span>
        <span>R$ {subTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Frete</span>
        <span className="text-green-600 font-medium">Gratuito</span>
      </div>
      <button className="text-green-600 text-sm underline mb-4">
        Adicionar cupom de desconto →
      </button>
      <div className="flex justify-between items-center font-bold text-lg mb-6">
        <span>Total</span>
        <span>R$ {subTotal.toFixed(2)}</span>
      </div>
      <button className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800">
        Finalizar compra
      </button>
    </div>
  </div>
);

}
