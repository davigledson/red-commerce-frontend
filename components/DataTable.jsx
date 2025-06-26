// components/DataTable.jsx
"use client";

import { useState } from 'react';

export default function DataTable({
  columns,
  data,
  showFooter = false,
  footerContent = null,
  rowActions = null,
  onRowClick = null
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleRowClick = (rowData) => {
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
              {rowActions && <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column.key}`}
                    className={`px-6 py-4 ${column.whitespace || 'whitespace-nowrap'} ${column.className || ''}`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showFooter && (
        <div className="bg-gray-50 px-6 py-4">
          {footerContent}
        </div>
      )}
    </div>
  );
}