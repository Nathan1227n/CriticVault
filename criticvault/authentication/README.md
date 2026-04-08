# Aplicação de Autenticação - CriticVault

Esta aplicação gerencia toda a autenticação e perfis de usuários do sistema.

## Modelos

### UserProfile
Perfil estendido do usuário Django padrão. Armazena informações adicionais como bio e avatar.

## Endpoints

### Autenticação

#### Registro de Novo Usuário
- **URL:** `POST /api/auth/registro/`
- **Permissões:** Público (AllowAny)
- **Body:**
```json
{
    "username": "seu_usuario",
    "email": "seu_email@example.com",
    "first_name": "Seu",
    "last_name": "Nome",
    "password": "senha_forte_123",
    "password_confirm": "senha_forte_123"
}
```
- **Response (201):**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "id": 1,
        "username": "seu_usuario",
        "email": "seu_email@example.com",
        "first_name": "Seu",
        "last_name": "Nome"
    }
}
```

#### Login
- **URL:** `POST /api/auth/login/`
- **Permissões:** Público (AllowAny)
- **Body:**
```json
{
    "username": "seu_usuario",
    "password": "senha_forte_123"
}
```
- **Response (200):**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "id": 1,
        "username": "seu_usuario",
        "email": "seu_email@example.com",
        "first_name": "Seu",
        "last_name": "Nome"
    }
}
```

#### Logout
- **URL:** `POST /api/auth/logout/`
- **Permissões:** Autenticado (IsAuthenticated)
- **Body:** {} (Vazio)
- **Response (200):**
```json
{
    "mensagem": "Logout realizado com sucesso"
}
```

### Perfil e Dados do Usuário

#### Obter Dados do Usuário Autenticado
- **URL:** `GET /api/auth/me/`
- **Permissões:** Autenticado (IsAuthenticated)
- **Response (200):**
```json
{
    "id": 1,
    "username": "seu_usuario",
    "email": "seu_email@example.com",
    "first_name": "Seu",
    "last_name": "Nome"
}
```

#### Atualizar Dados do Usuário Autenticado
- **URL:** `PATCH /api/auth/me/`
- **Permissões:** Autenticado (IsAuthenticated)
- **Body:**
```json
{
    "first_name": "Novo",
    "last_name": "Nome",
    "email": "novo_email@example.com"
}
```

#### Obter Perfil do Usuário Autenticado
- **URL:** `GET /api/auth/profile/`
- **Permissões:** Autenticado (IsAuthenticated)
- **Response (200):**
```json
{
    "user": {
        "id": 1,
        "username": "seu_usuario",
        "email": "seu_email@example.com",
        "first_name": "Seu",
        "last_name": "Nome"
    },
    "bio": "Amante de filmes e séries",
    "avatar_url": "https://example.com/avatar.jpg",
    "criado_em": "2024-01-15T10:30:00Z",
    "atualizado_em": "2024-01-15T10:30:00Z"
}
```

#### Atualizar Perfil do Usuário Autenticado
- **URL:** `PATCH /api/auth/profile/`
- **Permissões:** Autenticado (IsAuthenticated)
- **Body:**
```json
{
    "bio": "Crítico de filmes, séries e games",
    "avatar_url": "https://example.com/novo_avatar.jpg"
}
```

### Token JWT

#### Renovar Access Token
- **URL:** `POST /api/auth/token/refresh/`
- **Permissões:** Público (AllowAny)
- **Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```
- **Response (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Fluxo de Autenticação

1. **Registrar novo usuário** → Obter access e refresh tokens
2. **Fazer login** → Obter access e refresh tokens
3. **Usar access token** → Incluir no header `Authorization: Bearer {access_token}`
4. **Quando token expirar** → Usar refresh token para obter novo access token
5. **Obter dados do usuário** → GET `/api/auth/me/`
6. **Atualizar perfil** → PATCH `/api/auth/profile/`

## Headers de Autenticação

Para requisições que requerem autenticação, inclua:
```
Authorization: Bearer {access_token}
```

## Validações

### Registro
- ✓ Username único
- ✓ Email único
- ✓ Senhas devem coincidir
- ✓ Senhas com mínimo de 8 caracteres
- ✓ Todos os campos obrigatórios

### Login
- ✓ Username e password obrigatórios
- ✓ Valida credenciais

## Estrutura da Aplicação

```
authentication/
├── migrations/      # Migrations do banco de dados
├── __init__.py
├── admin.py         # Registro de modelos no admin
├── apps.py          # Configuração da aplicação
├── models.py        # Modelos (UserProfile)
├── serializers.py   # Serializers para validação/transformação
├── views.py         # Views/Endpoints
└── urls.py          # Rotas da aplicação
```
