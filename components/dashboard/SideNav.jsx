// src/components/SideNav.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Importe useRouter
import { useAuth } from '@/hooks/ContextoAuth'; // Importe o hook de autenticação

export default function SideNav({ isOpen, onToggle }) {
  const pathname = usePathname();
  const router = useRouter(); // Inicialize o useRouter
  const { loggedInUser, logout } = useAuth(); // Obtenha o usuário logado e a função de logout

  const [expandedMenus, setExpandedMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Carregar estado do localStorage no cliente
  useEffect(() => {
    const savedState = localStorage.getItem('sidenavCollapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Salvar estado no localStorage
  useEffect(() => {
    localStorage.setItem('sidenavCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSubmenu = (menuKey) => {
    if (isCollapsed) return; // Não permitir expandir submenus quando colapsado
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Fechar todos os submenus quando colapsar
    if (!isCollapsed) {
      setExpandedMenus({});
    }
  };

  // Função de logout
  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    router.push('/login'); // Redireciona para a página de login após o logout
  };

  // Configuração dos itens do menu
  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      href: '/admin/',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      key: 'produtos',
      title: 'Produtos',
      href: '/admin/produtos',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      key: 'categorias',
      title: 'Categorias',
      href: '/admin/categorias',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    
    {
      key: 'pedidos',
      title: 'Pedidos',
      href: '/admin/pedidos',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
     
    },
    {
      key: 'clientes',
      title: 'Usuários',
      href: '/admin/usuarios',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
  ];

  const isActiveLink = (href) => {
    return pathname === href;
  };

  const hasActiveSubmenu = (submenu) => {
    return submenu?.some(item => isActiveLink(item.href));
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed mt-30 left-0 top-0 h-full bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        {/* Header do Sidebar */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h2 className="text-white font-bold text-lg truncate">Admin Panel</h2>
                  <p className="text-green-100 text-sm truncate">Painel de Controle</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Botão para colapsar/expandir - apenas desktop */}
              <button
                onClick={toggleCollapse}
                className="hidden lg:block text-white hover:text-green-200 transition-colors p-1"
                title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isCollapsed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  )}
                </svg>
              </button>
              {/* Botão fechar - apenas mobile */}
              <button
                onClick={onToggle}
                className="lg:hidden text-white hover:text-green-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 h-full overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                {item.submenu ? (
                  // Item com submenu
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.key)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${hasActiveSubmenu(item.submenu) || expandedMenus[item.key]
                          ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${isCollapsed ? 'justify-center px-2' : ''}
                      `}
                      title={isCollapsed ? item.title : ''}
                    >
                      <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                        {item.icon}
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </div>
                      {!isCollapsed && (
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedMenus[item.key] ? 'rotate-180' : ''
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {!isCollapsed && (
                      <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${expandedMenus[item.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                      `}>
                        <ul className="mt-2 ml-4 space-y-1">
                          {item.submenu.map((subItem, index) => (
                            <li key={index}>
                              <Link 
                                href={subItem.href}
                                className={`
                                  block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                  ${isActiveLink(subItem.href)
                                    ? 'bg-green-100 text-green-700 font-medium border-l-2 border-green-500'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  }
                                `}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  // Item simples sem submenu
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActiveLink(item.href)
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                      ${isCollapsed ? 'justify-center px-2' : 'space-x-3'}
                    `}
                    title={isCollapsed ? item.title : ''}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Footer do Sidebar */}
          {!isCollapsed && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full mt-3 flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">Sair</span>
              </button>
            </div>
          )}

          {/* Footer colapsado - apenas ícones */}
          {isCollapsed && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center space-y-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                title="Sair"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}