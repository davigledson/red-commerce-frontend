'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import produtos from '@/data/produtos.json';

export default function ViewProdutoPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const encontrado = produtos.find(p => p.id === id);
    setProduto(encontrado);
  }, [id]);

  if (!produto) {
    return <div className="p-10 text-red-500">Produto não encontrado</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 mt-24">
      <div className="bg-white rounded-lg shadow-lg p-10 space-y-8">
        {/* Nome e loja */}
        <div>
          <h1 className="text-5xl font-extrabold text-green-800 mb-2">{produto.name}</h1>
          <p className="text-md text-gray-500">Loja: <span className="font-medium text-gray-700">{produto.store}</span></p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Imagem */}
          <div className="w-80 h-80 relative shadow-md rounded-lg overflow-hidden">
            <Image
              src={produto.image}
              alt={produto.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Detalhes */}
          <div className="flex-1 space-y-6">
            {/* Badges de categorias */}
            <div className="flex flex-wrap gap-2">
              {produto.category.map(cat => (
                <span
                  key={cat}
                  className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Descrição */}
            <p className="text-lg text-gray-700 leading-relaxed">{produto.description}</p>

            {/* Preço */}
            <p className="text-3xl font-semibold text-green-700">
              R$ {produto.price.toFixed(2)}
            </p>

            {/* Botão */}
            <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-lg transition">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
