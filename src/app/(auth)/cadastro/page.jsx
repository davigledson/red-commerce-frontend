"use client";
import { useState } from 'react';
import { AuthService } from '@/services/AuthService'; // Ajuste o caminho conforme a localização do seu AuthService
import axios from 'axios'; // Para tratamento de erros do Axios
import { useRouter } from 'next/navigation'; // Para redirecionamento no Next.js App Router
import { useAuth } from '@/hooks/ContextoAuth'; // Importe o hook useAuth

export default function Login() { // Mantendo o nome Login conforme fornecido, mas é um formulário de registro
  const [formData, setFormData] = useState({
    nome: '', // Adicionado campo nome
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [error, setError] = useState(''); // Estado para exibir mensagens de erro

  const router = useRouter();
  const { login: authLogin } = useAuth(); // Obtém a função login do contexto de autenticação

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia o estado de carregamento
    setError(''); // Limpa qualquer erro anterior

    // Validação básica no frontend
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Prepara os dados para o backend, mapeando confirmPassword para password_confirmation
      const registrationData = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        papel: 'cliente' // Definindo o papel padrão como 'cliente' para o registro
      };

      // Chama a função de registro do AuthService
      const response = await AuthService.registro(registrationData);

      console.log('Registro bem-sucedido:', response);

      router.push('/login'); 
      // Redireciona o usuário após o registro bem-sucedido
      // Você pode redirecionar para uma página de sucesso, dashboard, ou produtos
      router.push('/produtos'); 

    } catch (err) {
      // Se ocorrer um erro durante o registro
      console.error('Erro ao registrar usuário:', err);

      // Tratamento de erros do Axios
      if (axios.isAxiosError(err) && err.response) {
        const backendError = err.response.data;
        // O Devise geralmente retorna erros de validação em um array 'errors'
        if (backendError && backendError.errors && backendError.errors.length > 0) {
          setError(backendError.errors.join(', ')); // Junta as mensagens de erro
        } else if (backendError && backendError.error) {
          setError(backendError.error); // Se for um erro genérico 'error'
        } else {
          setError('Ocorreu um erro inesperado no servidor durante o registro. Por favor, tente novamente.');
        }
      } else {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
      }
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header do Card */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
          <p className="text-green-100 mt-2">Junte-se à nossa comunidade</p>
        </div>

        {/* Formulário */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erro!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* Campo Nome */}
          <div>
            <label htmlFor="nome" className="block mb-2 text-sm font-semibold text-gray-700">
              Nome
            </label>
            <div className="relative">
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Seu nome completo"
                required
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="seu@email.com"
                required
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Campo Confirmar Senha */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-semibold text-gray-700">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                required
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Eu concordo com os{' '}
              <a href="#" className="text-green-600 hover:underline font-medium">
                termos e condições
              </a>
            </label>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            disabled={loading} // Desabilita o botão enquanto estiver carregando
          >
            {loading ? 'Registrando...' : 'Criar Conta'}
          </button>
        </div>

        {/* Footer do Card */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-600 text-sm">
            Já tem uma conta?{' '}
            <a href="#" className="text-green-600 hover:underline font-medium">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
