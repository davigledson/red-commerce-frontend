'use client';
import { useState, useEffect } from 'react';

export default function FormModal({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  fields = [],
  title = 'Modal Genérico',
  subtitle = 'Preencha as informações',
  saveButtonText = 'Salvar',
  iconSvg = (
    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  ),
  customSections = [], // Seções customizadas como estatísticas
  modalSize = 'max-w-4xl', // Tamanho do modal
  headerGradient = 'from-green-500 to-blue-500', // Gradiente do header
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Inicializa os dados do formulário com base em initialData ou valores padrão dos campos
    const initialFormState = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialFormState[field.name] = initialData[field.name] !== undefined ? initialData[field.name] : false;
      } else {
        initialFormState[field.name] = initialData[field.name] !== undefined ? initialData[field.name] : '';
      }
    });
    setFormData(initialFormState);
  }, [initialData, fields]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar dados');
    }
  };

  const renderField = (field) => {
    const baseInputClasses = "w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={field.rows || 5}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={`${baseInputClasses} resize-none`}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={baseInputClasses}
            required={field.required}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-4">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={handleChange}
              className="w-6 h-6 text-green-600 border-gray-300 rounded focus:ring-green-500"
              required={field.required}
            />
            <label htmlFor={field.name} className="text-lg font-medium text-gray-900">
              {field.label}
            </label>
          </div>
        );
      
      default:
        return (
          <input
            id={field.name}
            name={field.name}
            type={field.type || 'text'}
            step={field.step}
            min={field.min}
            max={field.max}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={baseInputClasses}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${modalSize} max-h-[90vh] overflow-hidden transform transition-all duration-300 border border-gray-100`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${headerGradient} px-10 py-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {iconSvg}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {title}
                </h3>
                <p className="text-green-100 text-lg">
                  {subtitle}
                </p>
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
            {/* Campos do Formulário */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {fields.filter(field => field.type !== 'checkbox' && !field.fullWidth).map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block mb-3 text-lg font-semibold text-gray-900">
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {/* Campos de largura total */}
            {fields.filter(field => field.fullWidth && field.type !== 'checkbox').map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block mb-3 text-lg font-semibold text-gray-900">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}

            {/* Checkboxes */}
            {fields.filter(field => field.type === 'checkbox').length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.filter(field => field.type === 'checkbox').map((field) => (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seções Customizadas */}
            {customSections.map((section, index) => (
              <div key={index} className={section.className || "bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-6 border border-gray-100"}>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h4>
                <div className={section.gridClassName || "grid grid-cols-1 md:grid-cols-3 gap-4"}>
                  {section.content}
                </div>
              </div>
            ))}
          </form>
        </div>

        {/* Footer com Botões */}
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
              className={`px-8 py-4 text-lg bg-gradient-to-r ${headerGradient} text-white rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium`}
            >
              {saveButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
