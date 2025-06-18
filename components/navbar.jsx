'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(true);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 transition-colors duration-300
        ${scrolled ? ' bg-transparent backdrop-blur-xl' : 'bg-white  bg-opacity-90 backdrop-blur shadow'}
      `}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* 1) Logo à esquerda */}
          <div className="flex-shrink-0 w-32">
            <Link href="/">
              <Image
                src="/imgs/logo.png"
                alt="Minha Loja"
                width={64}
                height={32}
                className="object-contain"
              />
            </Link>
          </div>

          {/* 2) Links centralizados */}
          <div className="flex-1 flex justify-center space-x-8">
            <Link href="/home" className="text-lg font-medium text-green-800 hover:text-green-600">
              Home
            </Link>
            <Link href="/produtos" className="text-lg font-medium text-green-800 hover:text-green-600">
              Produtos
            </Link>
            <Link href="/contato" className="text-lg font-medium text-green-800 hover:text-green-600">
              Contato
            </Link>
             <Link href="/carrinho" className="text-lg font-medium text-green-800 hover:text-green-600">
              Carrinho
            </Link>
             <Link href="/login" className="text-lg font-medium text-green-800 hover:text-green-600">
              Login
            </Link>
            <Link href="/admin" className="text-lg font-medium text-green-800 hover:text-green-600">
              Admin
            </Link>
          </div>

          {/* 3) Espelho à direita */}
          <div className="w-32" />
        </div>
      </div>
    </nav>
  );
}
