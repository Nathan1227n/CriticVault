import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ReviewDetail() {
  const { id } = useParams(); // Pega o ID da URL
  const [review, setReview] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/reviews/${id}/`)
      .then(response => setReview(response.data))
      .catch(error => console.error("Erro ao buscar review:", error));
  }, [id]);

  if (!review) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Carregando...</div>;

  const getCorNota = (nota) => {
    if (nota >= 80) return '#00e676';
    if (nota >= 60) return '#ffd600';
    return '#ff5252';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/reviews" style={{ color: 'var(--primary-green)', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Voltar para Reviews
      </Link>

      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderRadius: '12px', 
        overflow: 'hidden',
        border: '1px solid #30363d'
      }}>
        {/* Capa Gigante no Topo */}
        <div style={{ 
          height: '300px', 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), var(--card-bg)), url(${review.capa_item})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>

        <div style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{review.tipo_item}</span>
              <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>{review.titulo_item}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-muted)' }}>
                <span>Avaliado por <strong style={{ color: 'var(--text-main)' }}>{review.nome_usuario}</strong></span>
                <span>•</span>
                <span>{new Date(review.data_criacao).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: getCorNota(review.nota), 
              color: '#000', 
              padding: '15px 20px', 
              borderRadius: '8px',
              fontWeight: '900',
              fontSize: '2rem'
            }}>
              {review.nota}
            </div>
          </div>

          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#c9d1d9' }}>
            {review.texto.split('\n').map((paragrafo, index) => (
              <p key={index} style={{ marginBottom: '15px' }}>{paragrafo}</p>
            ))}
          </div>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #30363d' }}>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--primary-green)' }}>♡</span> Curtir Review ({review.total_curtidas})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}