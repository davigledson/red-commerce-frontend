"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Garantir que estamos no cliente antes de fazer qualquer coisa
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll - só depois do componente montar no cliente
  useEffect(() => {
    if (!isClient) return;
    
    const handler = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollPosition > 0);
    };
    
    // Verificar posição inicial
    handler();
    
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isClient]);

  // Handle click outside dropdown and mobile menu
  useEffect(() => {
    if (!isClient) return;
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isClient]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (!isClient) return;
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isClient]);

  const profileMenuItems = [
    { name: 'Meu Perfil', href: '/perfil', icon: '👤' },
    { name: 'Meus Pedidos', href: '/pedidos', icon: '📦' },
    { name: 'Favoritos', href: '/favoritos', icon: '💖' },
    { name: 'Configurações', href: '/configuracoes', icon: '⚙️' },
    { name: 'Ajuda', href: '/ajuda', icon: '❓' },
    { name: 'Sair', href: '/logout', icon: '🚪' },
  ];

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Comprar', href: '/comprar' },
    { name: 'Login', href: '/login' },
    { name: 'Cadastro', href: '/cadastro' },
    { name: 'Admin', href: '/admin' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full mb-10 z-50 transition-colors duration-300 ${
        isClient && scrolled 
          ? 'bg-transparent backdrop-blur-xl' 
          : 'bg-white bg-opacity-90 backdrop-blur shadow'
      }`}
      suppressHydrationWarning
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/imgs/logo.png"
                alt="Minha Loja"
                width={64}
                height={32}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-green-800 hover:text-green-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Desktop Dropdown do Perfil */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-lg font-medium text-green-800 hover:text-green-600 transition-colors duration-200 flex items-center space-x-1"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <span>Perfil</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">João Silva</p>
                    <p className="text-sm text-gray-500">joao@email.com</p>
                  </div>
                  
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="mr-3 text-base" aria-hidden="true">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-green-800 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu principal"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile Menu */}
            <div 
              className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              aria-hidden={!isMobileMenuOpen}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Navigation Links */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-lg font-medium text-green-800 hover:text-green-600 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Profile Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-2 py-2 mb-3">
                    <p className="text-sm font-medium text-gray-900">João Silva</p>
                    <p className="text-sm text-gray-500">joao@email.com</p>
                  </div>
                  
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center py-2 px-2 text-base text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors duration-150 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-3 text-lg" aria-hidden="true">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}