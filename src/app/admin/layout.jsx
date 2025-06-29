// src/app/admin/layout.js
'use client';
import { useState } from 'react';
import SideNav from '@/components/dashboard/SideNav';

export default function AdminLayout({ children }) {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SideNav */}
      <SideNav 
        isOpen={sideNavOpen} 
        onToggle={toggleSideNav}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header com botão para mobile */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={toggleSideNav}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Painel Admin</h1>
            <div className="w-6"></div> {/* Spacer para centralizar o título */}
          </div>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}