// components/Toast.jsx
'use client';
import { useState, useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrada animation
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto close timer
    const closeTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const toastStyles = {
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
      icon: '✅',
      border: 'border-emerald-300',
      shadow: 'shadow-emerald-500/25'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-500',
      icon: '❌',
      border: 'border-red-300',
      shadow: 'shadow-red-500/25'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      icon: '⚠️',
      border: 'border-amber-300',
      shadow: 'shadow-amber-500/25'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      icon: 'ℹ️',
      border: 'border-blue-300',
      shadow: 'shadow-blue-500/25'
    }
  };

  const currentStyle = toastStyles[type] || {
    bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
    icon: '💬',
    border: 'border-gray-300',
    shadow: 'shadow-gray-500/25'
  };

  if (!isVisible && !isLeaving) return null;

  return (
    <div 
      className={`
        fixed bottom-6 right-6 z-50
        ${currentStyle.bg} ${currentStyle.shadow}
        backdrop-blur-sm border ${currentStyle.border}
        rounded-xl p-4 text-white
        flex items-center space-x-3
        min-w-80 max-w-md
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-2 opacity-0 scale-95'
        }
        shadow-2xl
        hover:scale-105 hover:shadow-3xl
        cursor-pointer
      `}
      onClick={handleClose}
    >
      {/* Ícone animado */}
      <div className="flex-shrink-0">
        <span className="text-2xl animate-bounce">{currentStyle.icon}</span>
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-5 break-words">
          {message}
        </p>
      </div>
      
      {/* Botão de fechar estilizado */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="
          flex-shrink-0 ml-2 p-1 rounded-full
          bg-white/20 hover:bg-white/30 
          transition-all duration-200
          hover:rotate-90 transform
        "
        aria-label="Fechar toast"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
      
      {/* Barra de progresso */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl overflow-hidden">
        <div className="h-full bg-white/60 rounded-b-xl w-full animate-pulse" />
      </div>
    </div>
  );
}