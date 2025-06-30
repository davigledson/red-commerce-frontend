// context/ToastContext.jsx
'use client';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import Toast from '@/components/Toast'; // Ajuste o caminho

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  let nextId = 0; // Para garantir IDs únicos para cada toast

  const addToast = useCallback((message, type = 'info') => {
    const id = nextId++;
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = useMemo(() => ({
    addToast,
  }), [addToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
