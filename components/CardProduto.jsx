// components/CardProduto.jsx
'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; // Importe useState e useEffect
import FavoritoService from '@/services/FavoritoService'; // Importe o serviço de favoritos
import { useAuth } from '@/hooks/ContextoAuth'; // Importe o hook de autenticação

export default function CardProduto({ 
  id, 
  nome = "Produto sem nome", 
  especie = "", 
  preco = "0,00", 
  imagem = "planta.png", 
  onAddCarrinho,
  onAddFavoritos // Nova prop para adicionar aos favoritos
}) {
  const router = useRouter();
  const { loggedInUser } = useAuth(); // Obtém o usuário logado
  const [isFavorited, setIsFavorited] = useState(false); // Estado para controlar se é favorito

  // Verifica se o produto já é favorito quando o componente monta ou o usuário muda
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (loggedInUser && id) {
        try {
          // Assumindo que FavoritoService.isFavorito precisa do ID do usuário e do produto
          const isFav = await FavoritoService.isFavorito(loggedInUser.id, id);
          setIsFavorited(isFav);
        } catch (error) {
          console.error("Erro ao verificar status de favorito:", error);
          setIsFavorited(false); // Em caso de erro, assume que não é favorito
        }
      } else {
        setIsFavorited(false); // Não é favorito se não estiver logado
      }
    };
    checkFavoriteStatus();
  }, [loggedInUser, id]); // Depende do usuário logado e do ID do produto

  const handleCardClick = () => {
    router.push(`/produtos/${id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Impede que o clique no botão ative o clique do card
    if (onAddFavoritos) {
      onAddFavoritos();
      setIsFavorited(prev => !prev); // Atualiza o estado local imediatamente para feedback visual
    }
  };

  return (
    <div 
      className="max-w-lg bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 cursor-pointer hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 ease-in-out"
      onClick={handleCardClick}
    >
      <div className="w-full h-60 relative overflow-hidden">
        <Image
          src={`/imgs/${imagem}`}
          alt={nome}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
          priority={false}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{nome}</h3>
        {especie && <p className="text-sm text-gray-500 italic">{especie}</p>}
        <div className="mt-4 flex justify-around items-center">
          <button 
            className="flex items-center px-4 py-2 bg-green-700 text-white font-medium hover:bg-green-800 rounded transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onAddCarrinho?.();
            }}
          >
            🛒 R$ {preco}
          </button>
          <button 
            className={`flex items-center px-4 py-2 border rounded transition-all duration-200 ${isFavorited ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'}`}
            onClick={handleFavoriteClick}
          >
            {isFavorited ? '❤️ Favorito' : '🤍 Lista de desejos'}
          </button>
        </div>
      </div>
    </div>
  );
}