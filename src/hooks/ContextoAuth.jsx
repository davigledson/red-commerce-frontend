// context/AuthContext.jsx
"use client"; // Necessário para usar hooks e estados no lado do cliente

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// Crie o contexto
export const AuthContext = createContext(null);

// Crie o provedor de autenticação
export function AuthProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para indicar que está carregando os dados do localStorage

  useEffect(() => {
    // Este useEffect só roda no cliente
    const loadUserFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setLoggedInUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Erro ao carregar usuário do localStorage:", e);
        localStorage.removeItem('currentUser'); // Limpa dados corrompidos
      } finally {
        setLoading(false); // Termina o carregamento
      }
    };

    loadUserFromLocalStorage();
  }, []);

  // Função para fazer login - AGORA COM useCallback
  const login = useCallback((userData, token) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
    setLoggedInUser(userData);
  }, []); // Dependências vazias, pois não depende de nenhum estado ou prop que mude

  // Função para fazer logout - AGORA COM useCallback
  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setLoggedInUser(null);
  }, []); // Dependências vazias

  // O useMemo para o valor do contexto já estava correto, mas agora suas dependências (login, logout) são estáveis
  const authContextValue = useMemo(() => ({
    loggedInUser,
    loading,
    login,
    logout,
  }), [loggedInUser, loading, login, logout]); 

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
