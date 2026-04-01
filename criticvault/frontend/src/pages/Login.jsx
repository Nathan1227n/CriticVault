import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  // Estado para controlar se mostra "login" ou "register"
  const [modo, setModo] = useState('login'); 
  
  // Estados para os inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros anteriores

    try {
      if (modo === 'login') {
        // Envia requisição de LOGIN para o Controlador
        const response = await axios.post('http://127.0.0.1:8000/api/token/', {
          username: email, // Usando o email como username no backend padrão
          password: password
        });
        
        // Salva os tokens no navegador (LocalStorage)
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Salva o nome do usuário para a página de Perfil saber quem é
        localStorage.setItem('username', email);
        
        // Redireciona para a Home forçando recarregamento (para a Navbar atualizar)
        window.location.href = '/';

      } else {
        // Envia requisição de CADASTRO para o Controlador
        const response = await axios.post('http://127.0.0.1:8000/api/registro/', {
          username: username,
          email: email,
          password: password
        });

        // O backend já nos devolve logado
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Salva o nome de usuário escolhido no cadastro
        localStorage.setItem('username', username);
        
        // Redireciona para a Home forçando recarregamento
        window.location.href = '/';
      }
    } catch (error) {
      setErro('Credenciais inválidas ou erro no servidor. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh' 
    }}>
      <div style={{ width: '400px', textAlign: 'center' }}>
        
        {/* Logo CV */}
        <div style={{ 
          backgroundColor: 'var(--primary-green)', 
          color: '#000', 
          width: '40px', 
          height: '40px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          fontWeight: 'bold', 
          borderRadius: '4px',
          margin: '0 auto 20px auto'
        }}>
          CV
        </div>

        {/* Título Dinâmico */}
        <h2 style={{ marginBottom: '10px' }}>
          {modo === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>
          {modo === 'login' ? 'Entre para continuar avaliando' : 'Junte-se à comunidade CriticVault'}
        </p>

        {/* Abas Entrar / Cadastrar */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#1c2128', 
          borderRadius: '6px', 
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          <button 
            onClick={() => setModo('login')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: 'none', 
              backgroundColor: modo === 'login' ? '#2d333b' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: modo === 'login' ? 'bold' : 'normal'
            }}
          >
            Entrar
          </button>
          <button 
            onClick={() => setModo('register')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: 'none', 
              backgroundColor: modo === 'register' ? '#2d333b' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: modo === 'register' ? 'bold' : 'normal'
            }}
          >
            Cadastrar
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* O campo de Username só aparece no Cadastro */}
          {modo === 'register' && (
            <input 
              type="text" 
              placeholder="Nome de usuário" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle} 
              required
            />
          )}

          <input 
            type="text" 
            placeholder={modo === 'login' ? 'Usuário (ou admin)' : 'Email'} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} 
            required
          />

          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle} 
            required
          />

          {erro && <p style={{ color: '#ff5555', fontSize: '0.8rem', textAlign: 'left' }}>{erro}</p>}

          <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px' }}>
            {modo === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        {modo === 'login' && (
          <a href="#" style={{ color: 'var(--primary-green)', display: 'block', marginTop: '20px', textDecoration: 'none', fontSize: '0.9rem' }}>
            Esqueceu a senha?
          </a>
        )}
      </div>
    </div>
  );
}

// Estilo extraído para não repetir em cada input
const inputStyle = {
  backgroundColor: '#1c2128',
  border: '1px solid #30363d',
  color: 'white',
  padding: '12px 15px',
  borderRadius: '6px',
  outline: 'none',
  width: '100%'
};