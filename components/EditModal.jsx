'use client';

import { useState } from 'react';

// Modal de Edição Estilizado
export default function EditModal({ isOpen, onClose, onSave, product = {} }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    category: Array.isArray(product?.category) ? product.category.join(', ') : product?.category || '',
    store: product?.store || '',
    description: product?.description || '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      ...form,
      price: parseFloat(form.price),
      category: form.category.split(',').map(cat => cat.trim()).filter(cat => cat)
    };
    onSave(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 border border-gray-100">
        {/* Header Ampliado */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 px-10 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {product.image && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-sm">
                  <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
                </div>
              )}
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">Editar Produto</h3>
                <p className="text-green-100 text-lg">Atualize as informações do produto</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center text-white"
              aria-label="Fechar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-10 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Grid de Campos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Nome do Produto */}
              <div>
                <label htmlFor="name" className="block mb-3 text-lg font-semibold text-gray-900">
                  Nome do Produto
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Digite o nome do produto"
                />
              </div>

              {/* Preço */}
              <div>
                <label htmlFor="price" className="block mb-3 text-lg font-semibold text-gray-900">
                  Preço (R$)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="0,00"
                />
              </div>

              {/* Categoria */}
              <div>
                <label htmlFor="category" className="block mb-3 text-lg font-semibold text-gray-900">
                  Categorias
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Plantas de Interior, Tropical"
                />
                <p className="mt-2 text-sm text-gray-500">Separe múltiplas categorias com vírgulas</p>
              </div>

              {/* Loja */}
              <div>
                <label htmlFor="store" className="block mb-3 text-lg font-semibold text-gray-900">
                  Loja
                </label>
                <input
                  id="store"
                  name="store"
                  type="text"
                  value={form.store}
                  onChange={handleChange}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Nome da loja"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block mb-3 text-lg font-semibold text-gray-900">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm"
                placeholder="Descreva as características e cuidados do produto..."
              />
            </div>

            {/* Estatísticas do Produto */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações do Produto</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-600">ID do Produto</p>
                  <p className="text-xl font-bold text-gray-900">#{product.id}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-600">Valor Atual</p>
                  <p className="text-xl font-bold text-green-600">R$ {product.price?.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-xl font-bold text-blue-600">Ativo</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer com Botões Ampliados */}
        <div className="bg-gray-50 px-10 py-8 border-t border-gray-200">
          <div className="flex justify-end items-center space-x-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-lg bg-white text-gray-700 rounded-2xl hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-300 shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}