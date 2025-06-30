// components/FavoritosSidebar.jsx
'use client';
import { useState, useEffect } from "react";

export default function FavoritosSidebar({ aberto, itens = [], onClose, onRemoverItem, onAdicionarAoCarrinho }) {
  
  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        aberto ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-red-50">
        <h2 className="text-xl font-bold text-red-800">Meus Favoritos</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar favoritos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 text-lg">Nenhum item favoritado</p>
            <button 
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
         ) : (
          <ul className="space-y-4">
            {itens.map((item) => (
              <li key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={`/imgs/${item.imagem || "planta.png"}`} 
                      alt={item.nome || "Produto"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800">{item.nome || "Produto sem nome"}</h3>
                  <p className="text-gray-600 text-sm">{item.categoria || "Categoria"}</p>
                  <p className="text-green-700 font-semibold">
                    R$ {parseFloat(item.preco || 0).toFixed(2).replace('.', ',')}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdicionarAoCarrinho && onAdicionarAoCarrinho(item);
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoverItem(item.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remover dos favoritos"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </li>
             ))}
          </ul>
        )}
      </div>
    </div>
  );
}