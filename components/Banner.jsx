// components/BannerCard.tsx
import Image from 'next/image';



export default function BannerCard({ titulo, descricao, imagem }) {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg shadow-lg">
      {/* Imagem de fundo */}
      <Image
        src={`/imgs/${imagem}`}
        alt={titulo}
        fill
        style={{ objectFit: 'cover' }}
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Texto sobreposto */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-md px-6 py-4 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide">{titulo}</h2>
          <p className="mt-2 text-sm sm:text-base">{descricao}</p>
        </div>
      </div>
    </div>
  );
}
