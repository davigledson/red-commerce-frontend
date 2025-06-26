'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CardProduto({ id, nome, especie, preco, imagem }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/produtos/${id}`);
  };

  return (
    <div 
      className="max-w-lg bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleCardClick}
    >
      <Image
        src={`/imgs/${imagem}`}
        alt={nome}
        width={300}
        height={200}
        className="w-full h-60 object-cover"
      />
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{nome}</h3>
        <p className="text-sm text-gray-500 italic">{especie}</p>
        <div className="mt-4 flex justify-around items-center">
          <button 
            className="flex items-center px-4 py-2 bg-green-700 text-white font-medium hover:bg-green-800"
            onClick={(e) => e.stopPropagation()} // Impede que o clique no botão acione o redirecionamento do card
          >
            🛒 R$ {preco}
          </button>
          <button 
            className="flex items-center px-4 py-2 border border-gray-300 font-medium hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()} // Impede que o clique no botão acione o redirecionamento do card
          >
            🤍 Lista de desejos
          </button>
        </div>
      </div>
    </div>
  );
}