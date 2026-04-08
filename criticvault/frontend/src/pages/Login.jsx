import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Login() {
  // Estado para controlar se mostra "login" ou "register"
  const [modo, setModo] = useState('login');
  const navigate = useNavigate();
  
  // Estados para os inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modo === 'login') {
        // NOVO: Fazer login com novo endpoint
        const { accessToken, refreshToken, user } = await authService.login(username, password);
        
        // Salvar tokens
        authService.saveTokens(accessToken, refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirecionar para home
        navigate('/');
        
      } else {
        // NOVO: Registrar com novo endpoint
        if (password !== passwordConfirm) {
          setErro('As senhas não coincidem');
          setCarregando(false);
          return;
        }

        const { accessToken, refreshToken, user } = await authService.register(
          username,
          email,
          firstName,
          lastName,
          password,
          passwordConfirm
        );
        
        // Salvar tokens
        authService.saveTokens(accessToken, refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirecionar para home
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.message;
      try {
        const errorData = JSON.parse(errorMsg);
        // Se é um erro do backend, mostrar a mensagem específica
        const firstError = Object.values(errorData)[0];
        setErro(Array.isArray(firstError) ? firstError[0] : firstError);
      } catch {
        setErro(errorMsg || 'Erro ao fazer login/registro. Tente novamente.');
      }
    } finally {
      setCarregando(false);
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

          {/* No login, pede username. No registro, pede email */}
          <input 
            type={modo === 'login' ? 'text' : 'email'} 
            placeholder={modo === 'login' ? 'Nome de usuário' : 'Email'} 
            value={modo === 'login' ? username : email}
            onChange={(e) => modo === 'login' ? setUsername(e.target.value) : setEmail(e.target.value)}
            style={inputStyle} 
            required
          />

          {/* Campos de nome só no registro */}
          {modo === 'register' && (
            <>
              <input 
                type="text" 
                placeholder="Primeiro nome (opcional)" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />
              <input 
                type="text" 
                placeholder="Último nome (opcional)" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle} 
            required
            minLength="8"
          />

          {/* Confirmação de senha no registro */}
          {modo === 'register' && (
            <input 
              type="password" 
              placeholder="Confirmar senha" 
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              style={inputStyle}
              required
              minLength="8"
            />
          )}

          {erro && <p style={{ color: '#ff5555', fontSize: '0.8rem', textAlign: 'left' }}>{erro}</p>}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '12px', marginTop: '10px' }}
            disabled={carregando}
          >
            {carregando ? 'Processando...' : (modo === 'login' ? 'Entrar' : 'Criar Conta')}
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