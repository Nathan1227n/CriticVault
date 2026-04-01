# 🎮🎬📖 CriticVault

O **CriticVault** é uma plataforma interativa de avaliações de filmes, jogos e livros, inspirada em sistemas de notas agregadas como o Metacritic. O objetivo do projeto é permitir que a comunidade descubra, avalie e compartilhe suas opiniões, gerando um *score* honesto e dinâmico para cada obra.

## 📐 Arquitetura do Sistema

Este projeto foi desenvolvido seguindo estritamente a arquitetura **MVC (Model-View-Controller)**, dividida da seguinte forma:

* **Visão (View):** Desenvolvida como uma **Single Page Application (SPA)** utilizando **React**. É responsável por toda a interface de usuário (UI), interações dinâmicas sem recarregamento de página e consumo da API.
* **Controlador (Controller):** Construído com **Django REST Framework**. Responsável por receber as requisições HTTP do frontend, processar a lógica de negócio, autenticação e rotear as operações CRUD.
* **Modelo (Model):** Gerenciado pelo ORM do **Django**, define a estrutura de dados (Usuários, Itens e Reviews) e cuida da persistência de dados no banco de dados **SQLite**.

---

## ✨ Funcionalidades (Features)

* **Autenticação JWT:** Sistema seguro de Login e Cadastro de usuários.
* **CRUD Completo:** Usuários logados podem Criar, Ler, Atualizar (Editar) e Deletar suas próprias reviews.
* **Metascore da Comunidade:** O sistema agrupa automaticamente as avaliações de uma mesma obra e calcula a nota média da comunidade.
* **Filtros Dinâmicos:** Filtro instantâneo por categorias (Filmes, Jogos, Livros) e busca por texto em tempo real.
* **Painel de Perfil:** Área dedicada para o usuário gerenciar seu histórico de avaliações.
* **Design Responsivo:** Interface moderna (Dark Mode com detalhes em Neon) estilizada com CSS puro, com layouts em grid que se adaptam à tela.

---

## 🛠️ Tecnologias Utilizadas

**Frontend (Visão):**
* [React](https://reactjs.org/) (via Vite)
* [React Router Dom](https://reactrouter.com/) (Roteamento da SPA)
* [Axios](https://axios-http.com/) (Requisições HTTP)
* CSS3 (Variáveis e Flexbox/Grid)

**Backend (Modelo e Controlador):**
* [Python 3](https://www.python.org/)
* [Django](https://www.djangoproject.com/)
* [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
* [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/) (Autenticação)

**Banco de Dados:**
* SQLite (Padrão do Django)

---

## 🚀 Como Rodar o Projeto Localmente

Para rodar a aplicação em sua máquina, você precisará do **Node.js** e do **Python** instalados. 
O projeto é dividido em dois servidores rodando simultaneamente.

### Passo 1: Configurando o Backend (Servidor Django)

1. Abra o terminal na pasta raiz do projeto e navegue até a pasta do backend (se houver):
2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   # No Windows:
   venv\Scripts\activate
   # No Linux/Mac:
   source venv/bin/activate
Instale as dependências necessárias:

Bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
Execute as migrações para criar o banco de dados SQLite:

Bash
python manage.py makemigrations
python manage.py migrate
Crie um superusuário para acessar o painel de administrador (opcional):

Bash
python manage.py createsuperuser
Inicie o servidor do backend:

Bash
python manage.py runserver
O backend estará rodando em http://127.0.0.1:8000

Passo 2: Configurando o Frontend (Visão React)
Abra um novo terminal e navegue até a pasta do frontend (onde está o arquivo package.json).

Instale as dependências do Node:

Bash
npm install
Inicie o servidor de desenvolvimento do Vite:

Bash
npm run dev
Acesse o link gerado no terminal (geralmente http://localhost:5173) segurando Ctrl e clicando no link.
