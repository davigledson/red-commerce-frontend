// components/CarrinhoSidebar.jsx
'use client';
import { useState, useEffect } from "react"; // Mantenha useEffect se tiver alguma lógica de UI que dependa de props, mas remova useAuth, useCallback etc.

export default function CarrinhoSidebar({ aberto, itens = [], onClose, onRemoverItem }) {
  // A lógica de cálculo do total permanece aqui, pois depende apenas dos 'itens' recebidos
  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      // Assume que 'item.produto.preco' é o preço do produto e 'item.quantidade' é a quantidade
      // Adapte conforme a estrutura real do seu item vindo do backend
      const precoUnitario = typeof item.produto?.preco === 'string' 
        ? parseFloat(item.produto.preco.replace(',', '.')) 
        : item.produto?.preco || 0;
      const quantidade = item.quantidade || 1; 
      return total + (precoUnitario * quantidade);
    }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        aberto ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-green-50">
        <h2 className="text-xl font-bold text-green-800">Meu Carrinho</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar carrinho"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto h-[calc(100%-150px )]">
        {/* Removido loadingCart, error, loadingItems - agora gerenciados pelo pai */}
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
            <button 
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
         ) : (
          <ul className="space-y-4">
            {itens.map((item) => (
              // Use item.id como key se for único, ou uma combinação se necessário
              <li key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {/* Acessa item.produto?.imagem e item.produto?.nome */}
                    <img 
                      src={`/imgs/${item.produto?.imagem || "planta.png"}`} 
                      alt={item.produto?.nome || "Produto"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800">{item.produto?.nome || "Produto sem nome"}</h3>
                  <span className="text-gray-600 text-sm">
                    {item.quantidade} x R$ {parseFloat(item.produto?.preco || 0).toFixed(2).replace('.', ',')}
                  </span>
                  <p className="text-green-700 font-semibold">
                    R$ {(parseFloat(item.produto?.preco || 0) * (item.quantidade || 1)).toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoverItem(item.id); // Chama a função do pai, passando o ID do item do carrinho
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remover item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
             ))}
          </ul>
        )}
      </div>
      
      {itens.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-gray-700">Total:</span>
            <span className="text-lg font-bold text-green-700">R$ {calcularTotal()}</span>
          </div>
          <button
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
}
