# Red Commerce 🛒

Uma plataforma de e-commerce completa desenvolvida com tecnologias modernas, oferecendo uma experiência de compra fluida e intuitiva.

## 📋 Sobre o Projeto

Red Commerce é uma aplicação de e-commerce full-stack que combina:
- **Frontend**: Interface moderna e responsiva construída com Next.js e React
- **Backend**: API robusta desenvolvida com Ruby on Rails

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js** - Framework React para produção
- **React** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Geist Font** - Família de fontes otimizada da Vercel

### Backend
- **Ruby on Rails** - Framework web para desenvolvimento ágil
- **PostgreSQL/MySQL** - Sistema de gerenciamento de banco de dados

## 📁 Estrutura do Projeto

```
red-commerce/
├── frontend/          # Aplicação Next.js
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json

```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Ruby (versão 3.0 ou superior)
- Rails (versão 7.0 ou superior)
- PostgreSQL ou MySQL

### Backend (Ruby on Rails)

1. Clone o repositório do backend:
```bash
git clone https://github.com/Bruno-Ed-cs/red-comerce-backend.git
cd red-comerce-backend
```

2. Instale as dependências:
```bash
bundle install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do projeto
DB_USER=seu_usuario_db
DB_PASSWORD=sua_senha_db
```

4. Configure o banco de dados:
```bash
rails db:create
rails db:migrate
rails db:seed  # (opcional) para dados de exemplo
```

5. Execute o servidor:
```bash
rails server
```

O backend estará disponível em `http://localhost:3000`

### Frontend (Next.js)

1. Clone o repositório do frontend:
```bash
git clone https://github.com/davigledson/red-commerce-frontend.git
cd red-commerce-frontend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O frontend estará disponível em `http://localhost:3000`

## 🔧 Scripts Disponíveis

### Frontend
- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Executa a aplicação em modo produção
- `npm run lint` - Executa o linter

### Backend
- `rails server` - Executa o servidor de desenvolvimento
- `rails console` - Abre o console interativo do Rails
- `rails db:migrate` - Executa as migrações do banco
- `rails test` - Executa os testes

## 📊 Funcionalidades

- ✅ Catálogo de produtos com filtros e busca
- ✅ Carrinho de compras dinâmico
- ✅ Sistema de autenticação de usuários
- ✅ Painel administrativo para gerenciamento
- ✅ Processamento de pedidos
- ✅ Integração com sistema de pagamentos
- ✅ Interface responsiva para todos os dispositivos

## 🌐 Deploy

### Frontend (Vercel - Recomendado)
O deploy mais fácil para aplicações Next.js é através da [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Backend (Heroku/Railway)
O backend Rails pode ser facilmente deployado em plataformas como Heroku, Railway ou DigitalOcean.

## 📝 Variáveis de Ambiente

### Backend
```env
DB_USER=usuario_do_banco
DB_PASSWORD=senha_do_banco
DATABASE_URL=url_completa_do_banco
SECRET_KEY_BASE=chave_secreta_rails
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Desenvolvedores

- **Frontend**: [Davi Gledson](https://github.com/davigledson)
- **Backend**: [Bruno Ed](https://github.com/Bruno-Ed-cs)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub ou pelos perfis dos desenvolvedores.

---

<div align="center">
  <strong>Red Commerce</strong> - Transformando a experiência de compra online 🚀
</div>
