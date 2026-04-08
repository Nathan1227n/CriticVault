import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [isLogado, setIsLogado] = useState(false);

  useEffect(() => {
    // Verificar se está logado
    if (authService.isAuthenticated()) {
      setIsLogado(true);
      // Tentar carregar dados do usuário da LS
      const userData = localStorage.getItem('user');
      if (userData) {
        setUsuario(JSON.parse(userData));
      }
    } else {
      setIsLogado(false);
      setUsuario(null);
    }
  }, []);

  // Função para deslogar
  const handleLogout = async () => {
    try {
      const token = authService.getAccessToken();
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar tokens mesmo se houver erro
      authService.clearTokens();
      setIsLogado(false);
      setUsuario(null);
      navigate('/');
    }
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 40px', 
      borderBottom: '1px solid #30363d',
      backgroundColor: '#0d1117'
    }}>
      {/* Logo e Nome */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ 
          backgroundColor: 'var(--primary-green)', 
          color: '#000', 
          padding: '5px', 
          fontWeight: 'bold', 
          borderRadius: '4px' 
        }}>
          CV
        </div>
        <h2 style={{ color: 'white', margin: 0 }}>CriticVault</h2>
      </Link>
      
      {/* Links Centrais */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Início</Link>
        <Link to="/reviews" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Reviews</Link>
        {isLogado && (
          <Link to="/perfil" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Meu Perfil</Link>
        )}
      </div>

      {/* Seção de Autenticação */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isLogado && usuario && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link 
              to="/perfil/settings" 
              style={{ 
                color: 'var(--text-muted)', 
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              {usuario.username}
            </Link>
          </div>
        )}
        
        {isLogado ? (
          <button 
            onClick={handleLogout} 
            className="btn-outline" 
            style={{ 
              borderColor: '#ff5252', 
              color: '#ff5252',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            → Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}