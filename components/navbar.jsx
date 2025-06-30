// components/Navbar.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/ContextoAuth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { loggedInUser, logout } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const handler = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollPosition > 0);
    };
    
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isClient]);

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

  const handleLogout = () => {
    logout();
  };

    const profileMenuItems = [
    { name: 'Meu Perfil', href: '/perfil?tab=personal', icon: '👤', description: 'Gerencie suas informações' }, // Adicionado ?tab=personal
    { name: 'Meus Pedidos', href: '/perfil?tab=orders', icon: '📦', description: 'Acompanhe seus pedidos' },     // Adicionado ?tab=orders
    { name: 'Favoritos', href: '/perfil?tab=favorites', icon: '💖', description: 'Seus produtos favoritos' },   // Adicionado ?tab=favorites
    { name: 'Meus Endereços', href: '/perfil?tab=address', icon: '🏠', description: 'Gerencie seus endereços' }, // Adicionado ?tab=address
    { name: 'Meu Carrinho', href: '/perfil?tab=cart', icon: '🛒', description: 'Itens no seu carrinho' },       // Adicionado ?tab=cart
    { name: 'Configurações', href: '/perfil?tab=settings', icon: '⚙️', description: 'Configurações da conta' }, // Adicionado ?tab=settings
    { name: 'Ajuda', href: '/ajuda', icon: '❓', description: 'Centro de ajuda' },
    { name: 'Sair', action: handleLogout, icon: '🚪', description: 'Sair da conta' }, 
  ];


  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Comprar', href: '/comprar' },
  ];

  if (!loggedInUser) {
    navigationItems.push({ name: 'Login', href: '/login' });
    navigationItems.push({ name: 'Cadastro', href: '/cadastro' });
  } else if (loggedInUser.papel === 'admin') {
    navigationItems.push({ name: 'Admin', href: '/admin' });
  }

  // Função para gerar iniciais do nome
  const getUserInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  // Função para gerar cor baseada no nome
  const getUserColor = (name, email) => {
    const text = name || email;
    const colors = [
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500',
      'bg-gradient-to-br from-teal-500 to-green-500',
    ];
    const index = text.length % colors.length;
    return colors[index];
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full mb-10 z-50 transition-all duration-500 ${
        isClient && scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20' 
          : 'bg-white/95 backdrop-blur-md shadow-md'
      }`}
      suppressHydrationWarning
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block transition-transform hover:scale-105 duration-200">
              <Image
                src="/imgs/logo.png"
                alt="Minha Loja"
                width={64}
                height={32}
                className="object-contain drop-shadow-sm"
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
                className="relative text-lg font-medium text-gray-700 hover:text-green-600 transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            
            {/* Desktop User Profile */}
            {loggedInUser && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-left hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {loggedInUser.nome || loggedInUser.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {loggedInUser.email}
                    </p>
                  </div>
                  
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 text-gray-600 ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <p className="text-base font-semibold text-gray-900">{loggedInUser.nome || 'Usuário'}</p>
                      <p className="text-sm text-gray-500">{loggedInUser.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      {profileMenuItems.map((item, index) => (
                        'href' in item ? (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-800 transition-all duration-200 group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="mr-4 text-lg group-hover:scale-110 transition-transform duration-200" aria-hidden="true">{item.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500 group-hover:text-green-600">{item.description}</p>
                            </div>
                          </Link>
                        ) : (
                          <button
                            key={item.name}
                            onClick={() => { item.action(); setIsProfileOpen(false); }}
                            className={`flex items-center w-full text-left px-4 py-3 transition-all duration-200 group ${
                              item.name === 'Sair' 
                                ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-800'
                            }`}
                          >
                            <span className="mr-4 text-lg group-hover:scale-110 transition-transform duration-200" aria-hidden="true">{item.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className={`text-xs ${item.name === 'Sair' ? 'text-red-400 group-hover:text-red-500' : 'text-gray-500 group-hover:text-green-600'}`}>
                                {item.description}
                              </p>
                            </div>
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50/50 transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu principal"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`}
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
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-6 space-y-4 max-w-screen-xl mx-auto">
                  {/* Mobile User Info */}
                  {loggedInUser && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="font-semibold text-gray-900">{loggedInUser.nome || 'Usuário'}</p>
                      <p className="text-sm text-gray-600">{loggedInUser.email}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full mt-2">
                        {loggedInUser.papel === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </div>
                  )}

                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Navegação</h3>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-3 px-3 text-lg font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Profile Menu */}
                  {loggedInUser && (
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Conta</h3>
                      <div className="space-y-2">
                        {profileMenuItems.map((item) => (
                          'href' in item ? (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center py-3 px-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="mr-3 text-lg">{item.icon}</span>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                            </Link>
                          ) : (
                            <button
                              key={item.name}
                              onClick={() => { item.action(); setIsMobileMenuOpen(false); }}
                              className={`flex items-center w-full py-3 px-3 rounded-lg transition-all duration-200 ${
                                item.name === 'Sair' 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                              }`}
                            >
                              <span className="mr-3 text-lg">{item.icon}</span>
                              <div className="text-left">
                                <p className="font-medium">{item.name}</p>
                                <p className={`text-xs ${item.name === 'Sair' ? 'text-red-400' : 'text-gray-500'}`}>
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}