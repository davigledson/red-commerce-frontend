'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CardProduto({ 
  id, 
  nome = "Produto sem nome", 
  especie = "", 
  preco = "0,00", 
  imagem = "planta.png", 
  onAddCarrinho 
}) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/produtos/${id}`);
  };

  return (
    <div 
      className="max-w-lg bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleCardClick}
    >
      <div className="w-full h-60 relative">
        <Image
          src={`/imgs/${imagem}`}
          alt={nome}
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{nome}</h3>
        {especie && <p className="text-sm text-gray-500 italic">{especie}</p>}
        <div className="mt-4 flex justify-around items-center">
          <button 
            className="flex items-center px-4 py-2 bg-green-700 text-white font-medium hover:bg-green-800 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onAddCarrinho?.();
            }}
          >
            🛒 R$ {preco}
          </button>
          <button 
            className="flex items-center px-4 py-2 border border-gray-300 font-medium hover:bg-gray-100 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            🤍 Lista de desejos
          </button>
        </div>
      </div>
    </div>
  );
}