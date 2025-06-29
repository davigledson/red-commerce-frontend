import BaseService from './BaseService';


interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha_digest?: string;
  papel?: 'cliente' | 'admin';
  created_at?: string;
  updated_at?: string;
}

