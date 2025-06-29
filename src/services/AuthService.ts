// services/AuthService.ts

import BaseService from './BaseService';

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  papel?: 'cliente' | 'admin';
  created_at?: string;
  updated_at?: string;
}

interface RegistroDados {
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
  papel: 'cliente' | 'admin';
}

export class AuthService extends BaseService {
  private static axiosInstance = this.createAxiosInstance('auth');

  static async login(email: string, password: string): Promise<{ usuario: Usuario; token: string }> {
    try {
      const response = await this.axiosInstance.post('/sign_in', { usuario: { email, password } });
      // Como o backend retorna { message, usuario, token } no corpo da resposta,
      // response.data já é o objeto que contém 'usuario' e 'token'.
      // Portanto, o retorno direto de response.data está correto.
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao fazer login');
      throw error;
    }
  }

  static async registro(dados: RegistroDados): Promise<{ usuario: Usuario; token: string }> {
    try {
      const response = await this.axiosInstance.post('/sign_up', { usuario: dados });
      // O mesmo se aplica aqui para o registro: se o backend retorna o token no corpo,
      // response.data já contém o que você precisa.
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erro ao registrar usuário');
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await this.axiosInstance.delete('/sign_out');
    } catch (error) {
      this.handleError(error, 'Erro ao fazer logout');
      throw error;
    }
  }

 
}
