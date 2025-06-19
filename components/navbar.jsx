"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handler);
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('color-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = stored === 'dark' || (!stored && prefersDark);
    setIsDark(darkMode);
    // Apply initial theme
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 \
        ${scrolled ? 'bg-transparent backdrop-blur-xl' : 'bg-white bg-opacity-90 backdrop-blur shadow'}`
      }
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* Logo à esquerda */}
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

          {/* Links centralizados */}
          <div className="flex-1 flex justify-center space-x-8">
            {['Home','Produtos','Contato','Carrinho','Login','Admin'].map((text) => (
              <Link
                key={text}
                href={`/${text.toLowerCase()}`}
                className="text-lg font-medium text-green-800 hover:text-green-600"
              >
                {text}
              </Link>
            ))}

            <button
              id="theme-toggle"
              type="button"
              onClick={toggleTheme}
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
            >
              <svg
                id="theme-toggle-dark-icon"
                className={`${isDark ? 'hidden' : ''} w-5 h-5`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <svg
                id="theme-toggle-light-icon"
                className={`${isDark ? '' : 'hidden'} w-5 h-5`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                />
              </svg>
            </button>
          </div>

          {/* Espaço à direita */}
          <div className="w-32" />
        </div>
      </div>
    </nav>
  );
}
