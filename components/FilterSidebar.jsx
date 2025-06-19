"use client";
import { useState } from 'react';

// Componente FilterSidebar
export default function FilterSidebar({ onFilterChange, className = "" }) {
  const [filters, setFilters] = useState({
    organizarPor: 'relevancia',
    tiposMuda: ['todos'],
    ambiente: 'todos',
    iluminacao: 'todos',
    rega: 'todos'
  });

  const handleFilterChange = (category, value) => {
    let newFilters = { ...filters };

    if (category === 'tiposMuda') {
      if (value === 'todos') {
        newFilters.tiposMuda = ['todos'];
      } else {
        if (newFilters.tiposMuda.includes('todos')) {
          newFilters.tiposMuda = [value];
        } else {
          if (newFilters.tiposMuda.includes(value)) {
            newFilters.tiposMuda = newFilters.tiposMuda.filter(item => item !== value);
            if (newFilters.tiposMuda.length === 0) {
              newFilters.tiposMuda = ['todos'];
            }
          } else {
            newFilters.tiposMuda.push(value);
          }
        }
      }
    } else {
      newFilters[category] = value;
    }

    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const FilterSection = ({ title, options, category, multiSelect = false }) => (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type={multiSelect ? "checkbox" : "radio"}
                name={category}
                value={option.value}
                checked={
                  multiSelect 
                    ? filters[category].includes(option.value)
                    : filters[category] === option.value
                }
                onChange={() => handleFilterChange(category, option.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                (multiSelect ? filters[category].includes(option.value) : filters[category] === option.value)
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 group-hover:border-green-400'
              }`}>
                {(multiSelect ? filters[category].includes(option.value) : filters[category] === option.value) && (
                  <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
            <span className={`ml-2 text-sm transition-colors duration-200 ${
              (multiSelect ? filters[category].includes(option.value) : filters[category] === option.value)
                ? 'text-green-700 font-medium'
                : 'text-gray-700 group-hover:text-green-600'
            }`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const organizarOptions = [
    { value: 'relevancia', label: 'Relevância' },
    { value: 'estoque', label: 'Estoque' },
    { value: 'nome', label: 'Nome' },
    { value: 'preco', label: 'Preço' }
  ];

  const tiposMudaOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'aglaonemas', label: 'Aglaonemas' },
    { value: 'flores', label: 'Flores' },
    { value: 'folhagens', label: 'Folhagens' },
    { value: 'frutiferas', label: 'Frutíferas' },
    { value: 'frutiferas-vaso', label: 'Frutíferas em vaso' },
    { value: 'medicinais', label: 'Medicinais' },
    { value: 'nativas', label: 'Nativas' },
    { value: 'orquideas', label: 'Orquídeas' },
    { value: 'paisagismo', label: 'Paisagismo' },
    { value: 'palmeiras', label: 'Palmeiras' },
    { value: 'pimentas', label: 'Pimentas' },
    { value: 'rosa-deserto', label: 'Rosa do deserto' },
    { value: 'suculentas', label: 'Suculentas' },
    { value: 'trepadeiras', label: 'Trepadeiras' }
  ];

  const ambienteOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'externo', label: 'Externo' },
    { value: 'interno-externo', label: 'Interno ou externo' }
  ];

  const iluminacaoOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'sol-direto', label: 'Sol direto' },
    { value: 'meia-luz', label: 'Meia luz' }
  ];

  const regaOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'moderada', label: 'Moderada' },
    { value: 'pouca', label: 'Pouca' }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit sticky top-6 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
        <button
          onClick={() => {
            const resetFilters = {
              organizarPor: 'relevancia',
              tiposMuda: ['todos'],
              ambiente: 'todos',
              iluminacao: 'todos',
              rega: 'todos'
            };
            setFilters(resetFilters);
            if (onFilterChange) {
              onFilterChange(resetFilters);
            }
          }}
          className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
        >
          Limpar
        </button>
      </div>

      <div className=" pr-2">
        <FilterSection
          title="Organizar por:"
          options={organizarOptions}
          category="organizarPor"
          multiSelect={false}
        />

        <FilterSection
          title="Tipos de muda:"
          options={tiposMudaOptions}
          category="tiposMuda"
          multiSelect={true}
        />

        <FilterSection
          title="Ambiente:"
          options={ambienteOptions}
          category="ambiente"
          multiSelect={false}
        />

        <FilterSection
          title="Iluminação:"
          options={iluminacaoOptions}
          category="iluminacao"
          multiSelect={false}
        />

        <FilterSection
          title="Rega:"
          options={regaOptions}
          category="rega"
          multiSelect={false}
        />
      </div>
    </div>
  );
}
