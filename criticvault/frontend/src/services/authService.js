const API_BASE_URL = 'http://localhost:8000/api/auth';

class AuthService {
  // Registrar novo usuário
  async register(username, email, firstName, lastName, password, passwordConfirm) {
    const response = await fetch(`${API_BASE_URL}/registro/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirm: passwordConfirm,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    return {
      accessToken: data.access,
      refreshToken: data.refresh,
      user: data.user,
    };
  }

  // Fazer login
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    return {
      accessToken: data.access,
      refreshToken: data.refresh,
      user: data.user,
    };
  }

  // Renovar token
  async refreshToken(refreshToken) {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar token');
    }

    const data = await response.json();
    return {
      accessToken: data.access,
    };
  }

  // Fazer logout
  async logout(accessToken) {
    await fetch(`${API_BASE_URL}/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Obter dados do usuário autenticado
  async getUserData(accessToken) {
    const response = await fetch(`${API_BASE_URL}/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao obter dados do usuário');
    }

    return await response.json();
  }

  // Atualizar dados do usuário
  async updateUserData(accessToken, firstName, lastName, email) {
    const response = await fetch(`${API_BASE_URL}/me/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar dados do usuário');
    }

    return await response.json();
  }

  // Obter perfil do usuário
  async getUserProfile(accessToken) {
    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao obter perfil do usuário');
    }

    return await response.json();
  }

  // Atualizar perfil do usuário
  async updateUserProfile(accessToken, bio, avatarUrl) {
    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bio,
        avatar_url: avatarUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar perfil do usuário');
    }

    return await response.json();
  }

  // Verificar se usuário está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  // Guardar tokens
  saveTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Recuperar access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Recuperar refresh token
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  // Limpar tokens
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
