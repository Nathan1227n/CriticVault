# 🎬 CriticVault

> **Uma Single Page Application (SPA) moderna para avaliar filmes, séries, livros e jogos com a comunidade**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-6.0-darkgreen.svg)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19.2+-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0+-9370db.svg)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Visão Geral

**CriticVault** é uma aplicação web moderna que demonstra as melhores práticas de desenvolvimento de uma **Single Page Application (SPA)** com arquitetura separada Frontend/Backend:

- **Frontend**: React com Vite (interface reativa e responsiva)
- **Backend**: Django REST Framework (API robusta e autenticação JWT)
- **Autenticação**: Sistema JWT com tokens refresh automático
- **Perfil de Usuário**: Bio, avatar personalizado e configurações

O projeto é ideal para fins educacionais, demonstrando:
- ✅ Comunicação cliente-servidor via REST API
- ✅ Autenticação e autorização com JWT
- ✅ Gestão de estado e requisições assíncronas
- ✅ Separação clara de responsabilidades (frontend/backend)
- ✅ CORS e boas práticas de segurança

---

## 🎯 Funcionalidades Principais

### Para Usuários Não Autenticados
- 👀 Visualizar reviews da comunidade
- 📊 Ver notas e médias dos itens
- 🔐 Fazer login ou registrar nova conta

### Para Usuários Autenticados
- ✍️ Criar reviews sobre filmes, séries, livros e jogos
- ⭐ Avaliar itens com notas de 0 a 100
- 📝 Editar e deletar suas próprias reviews
- 👤 Customizar perfil (nome, bio, avatar)
- 🎨 Visualizar perfil pessoal com todas as reviews
- 💬 Ver comentários e avaliações da comunidade

### Sistema de Avaliação
- 🟢 **Verde (80-100)**: Excelente
- 🟡 **Amarelo (60-79)**: Bom
- 🔴 **Vermelho (0-59)**: Ruim

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
criticvault/
│
├── 📋 Documentação
│   ├── README.md                          ← Este arquivo
│   ├── SUMMARY.md                         ← Resumo executivo da refatoração
│   ├── REFACTORING_AUTH.md               ← Detalhes da refatoração de autenticação
│   ├── FRONTEND_UPDATE_GUIDE.md          ← Guia de atualização do frontend
│   ├── IMPLEMENTATION_CHECKLIST.md       ← Checklist de implementação
│   └── PROJECT_STRUCTURE.md              ← Visualização da arquitetura
│
├── 🔐 Backend (Django)
│   ├── manage.py                          ← CLI do Django
│   ├── db.sqlite3                         ← Banco de dados SQLite
│   │
│   ├── backend/                           ← Configurações principais
│   │   ├── settings.py                   ← Configuração do projeto
│   │   ├── urls.py                       ← Roteamento principal
│   │   ├── wsgi.py                       ← Aplicação WSGI
│   │   └── asgi.py                       ← Aplicação ASGI
│   │
│   ├── authentication/                    ← 🆕 App de Autenticação
│   │   ├── migrations/
│   │   ├── models.py                     ← UserProfile model
│   │   ├── views.py                      ← 8 endpoints de autenticação
│   │   ├── serializers.py                ← Validações de dados
│   │   ├── urls.py                       ← Rotas de autenticação
│   │   ├── admin.py                      ← Admin do Django
│   │   └── README.md                     ← Documentação dos endpoints
│   │
│   └── catalog/                           ← App de Catálogo
│       ├── migrations/
│       ├── models.py                     ← Item, Review models
│       ├── views.py                      ← ItemViewSet, ReviewViewSet
│       ├── serializers.py                ← ItemSerializer, ReviewSerializer
│       ├── admin.py
│       └── tests.py
│
└── 🎨 Frontend (React + Vite)
    ├── package.json                       ← Dependências npm
    ├── vite.config.js                    ← Configuração Vite
    ├── index.html                        ← HTML principal
    ├── eslint.config.js
    │
    ├── public/                            ← Assets estáticos
    │
    └── src/
        ├── main.jsx                       ← Ponto de entrada
        ├── App.jsx                        ← Componente raiz + rotas
        ├── App.css                        ← Estilos globais
        ├── index.css                      ← Variáveis CSS
        │
        ├── services/                      ← 🆕 Serviços de API
        │   └── authService.js            ← Serviço de autenticação
        │
        ├── pages/                         ← Páginas (rotas)
        │   ├── Home.jsx                  ← Página inicial
        │   ├── Login.jsx                 ← Login/Registro
        │   ├── Reviews.jsx               ← Lista de reviews
        │   ├── ReviewDetail.jsx          ← Detalhes de uma review
        │   ├── CreateReview.jsx          ← Criar nova review
        │   ├── EditReview.jsx            ← Editar review
        │   ├── Profile.jsx               ← Perfil do usuário
        │   └── ProfileSettings.jsx       ← 🆕 Configurações de perfil
        │
        ├── components/                    ← Componentes reutilizáveis
        │   ├── Navbar.jsx                ← Navegação
        │   ├── ItemCard.jsx              ← Card de item
        │   └── ReviewCard.jsx            ← Card de review
        │
        └── assets/                        ← Imagens e recursos
```

---

## 🚀 Início Rápido

### Pré-requisitos
- **Python 3.10+** (Backend)
- **Node.js 18+** (Frontend)
- **npm** ou **yarn**

### 1️⃣ Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd criticvault
```

### 2️⃣ Configurar Backend (Django)

```bash
# Criar virtualenv (opcional, mas recomendado)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# Aplicar migrações
python manage.py migrate

# Criar superusuário (admin)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

Backend estará em: **http://localhost:8000**

### 3️⃣ Configurar Frontend (React + Vite)

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Frontend estará em: **http://localhost:5173**

---

## 🔌 Endpoints da API

### Autenticação (`/api/auth/`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/registro/` | Registrar novo usuário |
| `POST` | `/login/` | Fazer login |
| `POST` | `/logout/` | Fazer logout |
| `GET` | `/me/` | Obter dados do usuário autenticado |
| `PATCH` | `/me/` | Atualizar dados do usuário |
| `GET` | `/profile/` | Obter perfil do usuário |
| `PATCH` | `/profile/` | Atualizar perfil (bio, avatar) |
| `POST` | `/token/refresh/` | Renovar access token |

### Catálogo (`/api/`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/itens/` | Listar todos os itens |
| `POST` | `/itens/` | Criar novo item |
| `GET` | `/itens/{id}/` | Obter detalhes de um item |
| `PATCH` | `/itens/{id}/` | Atualizar item |
| `DELETE` | `/itens/{id}/` | Deletar item |
| `GET` | `/reviews/` | Listar todas as reviews |
| `POST` | `/reviews/` | Criar nova review |
| `GET` | `/reviews/{id}/` | Obter detalhes de uma review |
| `PATCH` | `/reviews/{id}/` | Atualizar review |
| `DELETE` | `/reviews/{id}/` | Deletar review |

---

## 🔐 Autenticação JWT

A aplicação usa **JWT (JSON Web Tokens)** com sistema de refresh:

### Fluxo de Login

```javascript
// 1. Fazer login
POST /api/auth/login/
{
  "username": "seu_usuario",
  "password": "sua_senha"
}

// Resposta:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",      // Access token (curta duração)
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",     // Refresh token (longa duração)
  "user": { ... }
}

// 2. Usar access token em requisições
GET /api/auth/me/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

// 3. Quando access expirar, usar refresh para obter novo
POST /api/auth/token/refresh/
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 📚 Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|----------|
| **Python** | 3.10+ | Linguagem |
| **Django** | 6.0+ | Framework web |
| **Django REST Framework** | Latest | API REST |
| **Simple JWT** | Latest | Autenticação JWT |
| **CORS Headers** | Latest | Cross-Origin Requests |
| **SQLite** | - | Banco de dados |

### Frontend

| Tecnologia | Versão | Descrição |
|-----------|--------|----------|
| **React** | 19.2+ | Biblioteca UI |
| **React Router** | 7.13+ | Roteamento |
| **Vite** | 8.0+ | Build tool e dev server |
| **JavaScript (ES6+)** | - | Linguagem |
| **CSS3** | - | Estilos |

---

## 🎓 Fluxo de Uso

### 1. Registrar Nova Conta
```
Usuário → Login/Cadastro → Criar Conta → Backend cria User + UserProfile
```

### 2. Fazer Login
```
Usuário → Login → Backend valida credenciais → Retorna access + refresh tokens
```

### 3. Criar Review
```
Usuário → Nova Review → Seleciona item → Insere nota e texto → 
Backend valida e salva → Review aparece no perfil e na comunidade
```

### 4. Editar Perfil
```
Usuário → Meu Perfil → ⚙️ Configurações → Edita nome, email, bio, avatar → 
Backend atualiza → Perfil atualizado
```

---

## 🧪 Testando a Aplicação

### Via Postman/Insomnia

1. **Registrar novo usuário:**
   ```
   POST http://localhost:8000/api/auth/registro/
   Content-Type: application/json
   
   {
     "username": "testuser",
     "email": "test@example.com",
     "first_name": "Test",
     "last_name": "User",
     "password": "senha123456",
     "password_confirm": "senha123456"
   }
   ```

2. **Fazer login:**
   ```
   POST http://localhost:8000/api/auth/login/
   Content-Type: application/json
   
   {
     "username": "testuser",
     "password": "senha123456"
   }
   ```

3. **Obter dados do usuário:**
   ```
   GET http://localhost:8000/api/auth/me/
   Authorization: Bearer <seu_access_token>
   ```

### Via Interface Web
1. Acesse http://localhost:5173
2. Clique em "Entrar"
3. Faça login ou crie uma conta
4. Navegue pelas funcionalidades

---

## 📁 Como Adicionar Novos Itens ao Banco

Via Django Admin:

```bash
# Criar superusuário
python manage.py createsuperuser

# Acessar admin
http://localhost:8000/admin/

# Login e adicione itens/reviews no painel
```

Ou via API:

```bash
POST http://localhost:8000/api/itens/
Content-Type: application/json

{
  "titulo": "Inception",
  "tipo": "FILME",
  "capa_url": "https://example.com/inception.jpg"
}
```

---

## 🔧 Scripts Disponíveis

### Backend

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Criar superusuário admin
python manage.py createsuperuser

# Shell interativo do Django
python manage.py shell

# Executar testes
python manage.py test
```

### Frontend

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm build

# Preview do build
npm run preview

# Lint do código
npm run lint
```

## 📖 Aprendizados Principais

Este projeto é excelente para aprender:

1. **Arquitetura SPA** - Separação frontend/backend
2. **REST API** - Design de APIs RESTful
3. **Autenticação JWT** - Tokens e refresh
4. **React Hooks** - useState, useEffect
5. **React Router** - Roteamento no cliente
6. **Fetch API** - Requisições HTTP assíncronas
7. **Django REST Framework** - Construir APIs com Django
8. **CORS** - Cross-Origin Resource Sharing
9. **Vite** - Build tool moderno
10. **Responsive Design** - CSS para diferentes telas
