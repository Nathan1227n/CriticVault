import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  
  const isLogado = !!localStorage.getItem('access_token');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reviews/')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => console.error("Erro ao buscar os dados da API!", error));
  }, []);

  // --- MÁGICA DO METASCORE: Agrupando e calculando a média ---
  const itensAgrupados = {};

  reviews.forEach(review => {
    if (!itensAgrupados[review.item]) {
      itensAgrupados[review.item] = {
        ...review,
        somaNotas: review.nota,
        totalAvaliacoes: 1
      };
    } else {
      itensAgrupados[review.item].somaNotas += review.nota;
      itensAgrupados[review.item].totalAvaliacoes += 1;
    }
  });

  const reviewsComMedia = Object.values(itensAgrupados).map(item => ({
    ...item,
    nota: Math.round(item.somaNotas / item.totalAvaliacoes) // Substitui a nota individual pela Média
  }));

  // Lógica para a seção "Mais Bem Avaliados" (Top 3 Médias)
  const topReviews = [...reviewsComMedia]
    .sort((a, b) => b.nota - a.nota)
    .slice(0, 3);

  // Lógica de Filtro para a seção "Reviews Recentes"
  const reviewsRecentes = reviewsComMedia.filter(review => {
    return filtroTipo === 'TODOS' || review.tipo_item === filtroTipo;
  });

  const getCorNota = (nota) => {
    if (nota >= 80) return '#00e676';
    if (nota >= 60) return '#ffd600';
    return '#ff5252';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 1. HERO SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '60px', marginTop: '20px' }}>
        <div style={{ color: 'var(--primary-green)', fontSize: '1.5rem', marginBottom: '15px' }}>
          <span>🎮 🎬 📖</span>
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '15px' }}>
          Avaliações que <span style={{ color: 'var(--primary-green)' }}>importam</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px auto' }}>
          Descubra, avalie e compartilhe suas opiniões sobre filmes, jogos e livros. Scores honestos pela comunidade.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/reviews" className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem', textDecoration: 'none' }}>
            Explorar Reviews →
          </Link>
          
          {isLogado ? (
            <Link to="/nova-review" className="btn-outline" style={{ padding: '12px 24px', fontSize: '1rem', textDecoration: 'none', borderColor: 'var(--primary-green)', color: 'var(--primary-green)' }}>
              + Nova Review
            </Link>
          ) : (
            <Link to="/login" className="btn-outline" style={{ padding: '12px 24px', fontSize: '1rem', textDecoration: 'none' }}>
              Criar Conta
            </Link>
          )}
        </div>
      </div>

      {/* 2. SEÇÃO: MAIS BEM AVALIADOS */}
      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>🏆</span> Mais Bem Avaliados
      </h3>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '60px', overflowX: 'auto', paddingBottom: '10px' }}>
        {topReviews.map((review, index) => (
          <Link to={`/review/${review.id}`} key={`top-${review.id}`} style={{ textDecoration: 'none', flex: 1, minWidth: '350px' }}>
            <div style={{
              height: '200px',
              borderRadius: '12px',
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 100%), url(${review.capa_item})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative'
            }}>
              <span style={{ color: 'var(--primary-green)', fontSize: '0.9rem', fontWeight: 'bold' }}>#{index + 1}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'white' }}>{review.titulo_item}</h4>
                  <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{review.totalAvaliacoes} avaliações</span>
                </div>
                <div style={{ backgroundColor: getCorNota(review.nota), color: '#000', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {review.nota}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. SEÇÃO: REVIEWS RECENTES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📄</span> Reviews Recentes
        </h3>
        
        <div style={{ display: 'flex', gap: '5px', backgroundColor: 'var(--card-bg)', padding: '5px', borderRadius: '8px', border: '1px solid #30363d' }}>
          {['TODOS', 'FILME', 'JOGO', 'LIVRO'].map(tipo => (
            <button 
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              style={{
                backgroundColor: filtroTipo === tipo ? '#2d333b' : 'transparent',
                color: filtroTipo === tipo ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: filtroTipo === tipo ? 'bold' : 'normal'
              }}
            >
              {tipo === 'TODOS' ? '🏠 Todos' : tipo === 'FILME' ? '🎬 Filmes' : tipo === 'JOGO' ? '🎮 Jogos' : '📖 Livros'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '20px' }}>
        {reviewsRecentes.map(review => (
          <div key={review.id} style={{ 
            backgroundColor: 'var(--card-bg)', 
            padding: '20px', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid #21262d'
          }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {review.capa_item && (
                <img src={review.capa_item} alt={review.titulo_item} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '6px' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold' }}>{review.tipo_item}</span>
                <Link to={`/review/${review.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                  <h3 style={{ margin: '5px 0', fontSize: '1.1rem' }}>{review.titulo_item}</h3>
                </Link>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "{review.texto}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Última review por {review.nome_usuario}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Média</span>
              <div style={{ backgroundColor: getCorNota(review.nota), color: '#000', padding: '10px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '1.2rem' }}>
                {review.nota}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>
                {review.totalAvaliacoes} avaliações
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}