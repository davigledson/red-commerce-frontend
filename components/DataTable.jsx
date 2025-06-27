// src/components/DataTable.js
'use client';

import React from 'react';

/**
 * Componente de Tabela Genérica para exibir dados.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Array<Object>} props.data - O array de objetos a serem exibidos na tabela.
 * @param {Array<Object>} props.columns - Um array de objetos que definem as colunas da tabela.
 *   Cada objeto de coluna deve ter:
 *   - `header`: String, o texto do cabeçalho da coluna.
 *   - `render`: Função `(item) => JSX`, que renderiza o conteúdo da célula para cada item.
 * @param {Function} [props.onEdit] - Função de callback para a ação de edição. Recebe o item completo.
 * @param {Function} [props.onDelete] - Função de callback para a ação de exclusão. Recebe o ID do item.
 * @param {Function} [props.onAdd] - Função de callback para a ação de adicionar novo item.
 * @param {string} [props.addText='Adicionar Novo'] - Texto para o botão de adicionar.
 * @param {string} [props.emptyMessage='Nenhum item encontrado.'] - Mensagem exibida quando não há dados.
 * @param {string} [props.title='Lista de Itens'] - Título da tabela.
 */
export default function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onAdd, 
  addText = 'Adicionar Novo',
  emptyMessage = 'Nenhum item encontrado.',
  title = 'Lista de Itens'
}) {
  const hasActions = onEdit || onDelete;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
          {onAdd && (
            <button 
              onClick={onAdd}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              {addText}
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => ( 
                <th key={index} className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th key="actions-header" className="px-8 py-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              // AQUI: Usando item.id diretamente como chave.
              // As validações no AdminDashboard garantem que item.id será válido.
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-8 py-6 whitespace-nowrap">
                    {col.render(item)}
                  </td>
                ))}
                {hasActions && (
                  <td key={`actions-cell-${item.id}`} className="px-8 py-6 whitespace-nowrap text-sm font-medium space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-sm text-base font-medium"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="bg-gradient-to-r from-blue-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-sm text-base font-medium"
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado Vazio (Empty State) */}
      {data.length === 0 && (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.535-2.854M15 17h3.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0022 13.586V6a1 1 0 00-1-1H3a1 1 0 00-1 1v7.586a1 1 0 00.293.707l2.414 2.414A1 1 0 005.414 17H9" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Ops!</h3>
          <p className="mt-2 text-base text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
