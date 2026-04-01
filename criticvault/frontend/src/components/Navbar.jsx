import { Link } from 'react-router-dom';

export default function Navbar() {
  // Verifica se existe um token salvo (ou seja, se está logado)
  const isLogado = !!localStorage.getItem('access_token');

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = '/'; // Volta pra home e recarrega
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #30363d' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ backgroundColor: 'var(--primary-green)', color: '#000', padding: '5px', fontWeight: 'bold', borderRadius: '4px' }}>CV</div>
        <h2 style={{ color: 'white', margin: 0 }}>CriticVault</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Início</Link>
        <Link to="/reviews" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Reviews</Link>
        {/* Mostra o link do perfil só se estiver logado */}
        {isLogado && (
          <Link to="/perfil" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Meu Perfil</Link>
        )}
      </div>

      <div>
        {isLogado ? (
          <button onClick={handleLogout} className="btn-outline" style={{ borderColor: '#ff5252', color: '#ff5252' }}>
            Sair
          </button>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>→ Entrar</Link>
        )}
      </div>
    </nav>
  );
}