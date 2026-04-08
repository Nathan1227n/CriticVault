import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Profile() {
  const navigate = useNavigate();
  const [minhasReviews, setMinhasReviews] = useState([]);
  const [estatisticasComunidade, setEstatisticasComunidade] = useState({});
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const token = authService.getAccessToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Carregar dados do usuário
      const userData = await authService.getUserData(token);
      setUsuario(userData);

      // Carregar perfil
      const profileData = await authService.getUserProfile(token);
      setPerfil(profileData);

      // Carregar reviews
      const response = await fetch('http://localhost:8000/api/reviews/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const reviews = await response.json();

      // 1. Calcula as médias da comunidade para todos os itens
      const agrupados = {};
      reviews.forEach(r => {
        if (!agrupados[r.item]) {
          agrupados[r.item] = { soma: r.nota, total: 1 };
        } else {
          agrupados[r.item].soma += r.nota;
          agrupados[r.item].total += 1;
        }
      });

      const stats = {};
      for (let itemId in agrupados) {
        stats[itemId] = {
          media: Math.round(agrupados[itemId].soma / agrupados[itemId].total),
          totalAvaliacoes: agrupados[itemId].total
        };
      }
      setEstatisticasComunidade(stats);

      // 2. Filtra apenas as reviews do usuário logado
      const apenasAsMinhas = reviews.filter(review => review.nome_usuario === userData.username);
      setMinhasReviews(apenasAsMinhas);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta review?')) {
      try {
        const token = authService.getAccessToken();
        const response = await fetch(`http://localhost:8000/api/reviews/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setMinhasReviews(minhasReviews.filter(review => review.id !== id));
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  if (carregando) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando perfil...</div>;
  }

  if (!usuario) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Erro ao carregar perfil</div>;
  }

  const getCorNota = (nota) => {
    if (nota >= 80) return '#00e676';
    if (nota >= 60) return '#ffd600';
    return '#ff5252';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        padding: '40px', 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '30px', 
        marginBottom: '40px', 
        border: '1px solid #30363d'
      }}>
        {/* Avatar */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          backgroundColor: '#30363d', 
          borderRadius: '50%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {perfil?.avatar_url ? (
            <img 
              src={perfil.avatar_url} 
              alt={usuario.username}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: 'var(--primary-green)' 
            }}>
              {usuario.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem' }}>
            {usuario.first_name && usuario.last_name 
              ? `${usuario.first_name} ${usuario.last_name}` 
              : usuario.username}
          </h1>
          {usuario.first_name && usuario.last_name && (
            <p style={{ color: 'var(--text-muted)', margin: '0 0 10px 0', fontSize: '0.9rem' }}>
              @{usuario.username}
            </p>
          )}
          
          {perfil?.bio && (
            <p style={{ color: 'var(--text-muted)', margin: '10px 0', fontSize: '0.95rem' }}>
              {perfil.bio}
            </p>
          )}

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
              {minhasReviews.length} 
              <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '5px' }}>
                Reviews Escritas
              </span>
            </span>
          </div>
        </div>

        {/* Botão de configurações */}
        <Link 
          to="/perfil/settings" 
          className="btn-outline"
          style={{ 
            padding: '10px 20px', 
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          ⚙️ Configurações
        </Link>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Minhas Avaliações</h2>

      {minhasReviews.length === 0 ? (
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          padding: '40px', 
          borderRadius: '12px', 
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Você ainda não avaliou nenhum item.
          </p>
          <Link to="/nova-review" className="btn-primary" style={{ textDecoration: 'none' }}>
            + Criar Primeira Review
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {minhasReviews.map(review => {
            // Resgata os dados da comunidade que calculamos lá em cima
            const comunidade = estatisticasComunidade[review.item];

            return (
              <div key={review.id} style={{ 
                backgroundColor: 'var(--card-bg)', 
                padding: '20px', 
                borderRadius: '8px',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                border: '1px solid #21262d'
              }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                  {review.capa_item && (
                    <img 
                      src={review.capa_item} 
                      alt={review.titulo_item} 
                      style={{ width: '70px', height: '95px', objectFit: 'cover', borderRadius: '6px' }} 
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {review.tipo_item}
                    </span>
                    <Link 
                      to={`/review/${review.id}`} 
                      style={{ textDecoration: 'none', color: 'var(--text-main)' }}
                    >
                      <h3 style={{ margin: '5px 0' }}>{review.titulo_item}</h3>
                    </Link>
                    
                    {comunidade && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: getCorNota(comunidade.media) 
                        }}></div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Média da comunidade: <strong>{comunidade.media}</strong> ({comunidade.totalAvaliacoes} avaliações)
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <Link 
                        to={`/editar-review/${review.id}`} 
                        className="btn-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(review.id)} 
                        className="btn-outline" 
                        style={{ 
                          padding: '4px 10px', 
                          fontSize: '0.8rem', 
                          borderColor: '#ff5252', 
                          color: '#ff5252',
                          cursor: 'pointer'
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ 
                    color: 'var(--primary-green)', 
                    fontSize: '0.7rem', 
                    marginBottom: '5px', 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase' 
                  }}>
                    Sua Nota
                  </span>
                  <div style={{ 
                    backgroundColor: getCorNota(review.nota), 
                    color: '#000', 
                    padding: '12px 18px', 
                    borderRadius: '6px', 
                    fontWeight: 'bold', 
                    fontSize: '1.4rem' 
                  }}>
                    {review.nota}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}