// src/app/produtos/[id]/page.jsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProdutoService from '@/services/ProdutoService';
import axios from 'axios';

export default function ViewProdutoPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await ProdutoService.buscarPorId(id);
        setProduto(data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do produto:", err);
        let errorMessage = "Erro ao carregar detalhes do produto.";
        if (axios.isAxiosError(err) && err.response && err.response.data) {
          if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (err.response.data.errors) {
            errorMessage = err.response.data.errors.join(', ');
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 mt-24">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-80 h-80 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-6">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar produto</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h3 className="mt-4 text-xl font-medium text-gray-900">Produto não encontrado</h3>
          <p className="mt-2 text-gray-600">O produto com o ID "{id}" não foi encontrado.</p>
          <a 
            href="/produtos" 
            className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar aos produtos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 mt-24">
      <div className="bg-white rounded-lg shadow-lg p-10 space-y-8">
        {/* Nome e categoria */}
        <div>
          <h1 className="text-5xl font-extrabold text-green-800 mb-2">{produto.nome}</h1>
          <p className="text-md text-gray-500">
            Categoria: <span className="font-medium text-gray-700">{produto.categoria?.nome || 'N/A'}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Imagem */}
          <div className="w-80 h-80 relative shadow-md rounded-lg overflow-hidden">
            <Image
              src={produto.imagem || '/imgs/planta.png'} 
              alt={produto.nome}
              fill
              className="object-cover"
            />
          </div>

          {/* Detalhes */}
          <div className="flex-1 space-y-6">
            {/* Descrição */}
            <p className="text-lg text-gray-700 leading-relaxed">{produto.descricao}</p>

            {/* Preço */}
            <p className="text-3xl font-semibold text-green-700">
              R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
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