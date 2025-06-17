'use client'; // se estiver usando App Router

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800">Minha Loja</Link>
        <div className="flex gap-6">
          <Link href="/home" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/produtos" className="text-gray-600 hover:text-blue-600">Produtos</Link>
          <Link href="/contato" className="text-gray-600 hover:text-blue-600">Contato</Link>
        </div>
      </div>
    </nav>
  );
}
