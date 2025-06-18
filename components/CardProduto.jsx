import Image from 'next/image';

export default function CardProduto({ nome, especie, preco, imagem }) {
  return (
    <div className="max-w-lg bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
      <Image
        src={`/imgs/${imagem}`}
        alt={nome}
        width={300}
        height={200}
        className="w-full h-60  object-cover"
      />
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{nome}</h3>
        <p className="text-sm text-gray-500 italic">{especie}</p>
        <div className="mt-4 flex justify-around items-center">
          <button className="flex items-center px-4 py-2 bg-green-700 text-white font-medium hover:bg-green-800">
            🛒 R$ {preco}
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 font-medium hover:bg-gray-100">
            🤍 Lista de desejos
          </button>
        </div>
      </div>
    </div>
  );
}
