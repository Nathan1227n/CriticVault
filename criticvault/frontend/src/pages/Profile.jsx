import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const [minhasReviews, setMinhasReviews] = useState([]);
  const [estatisticasComunidade, setEstatisticasComunidade] = useState({});
  
  const meuUsuario = localStorage.getItem('username') || 'Usuário';

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reviews/')
      .then(response => {
        // 1. Calcula as médias da comunidade para todos os itens
        const agrupados = {};
        response.data.forEach(r => {
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
        const apenasAsMinhas = response.data.filter(review => review.nome_usuario === meuUsuario);
        setMinhasReviews(apenasAsMinhas);
      })
      .catch(error => console.error("Erro ao buscar reviews:", error));
  }, [meuUsuario]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta review?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/reviews/${id}/`);
        setMinhasReviews(minhasReviews.filter(review => review.id !== id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  const getCorNota = (nota) => {
    if (nota >= 80) return '#00e676';
    if (nota >= 60) return '#ffd600';
    return '#ff5252';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ 
        backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '12px', 
        display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px', border: '1px solid #30363d'
      }}>
        <div style={{ 
          width: '100px', height: '100px', backgroundColor: '#30363d', borderRadius: '50%', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-green)' 
        }}>
          {meuUsuario.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>{meuUsuario}</h1> 
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Membro da Comunidade</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{minhasReviews.length} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>Reviews Escritas</span></span>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Minhas Avaliações</h2>

      {minhasReviews.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Você ainda não avaliou nenhum item.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {minhasReviews.map(review => {
            // Resgata os dados da comunidade que calculamos lá em cima
            const comunidade = estatisticasComunidade[review.item];

            return (
              <div key={review.id} style={{ 
                backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #21262d'
              }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {review.capa_item && (
                    <img src={review.capa_item} alt={review.titulo_item} style={{ width: '70px', height: '95px', objectFit: 'cover', borderRadius: '6px' }} />
                  )}
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{review.tipo_item}</span>
                    <Link to={`/review/${review.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                      <h3 style={{ margin: '5px 0' }}>{review.titulo_item}</h3>
                    </Link>
                    
                    {/* INFORMAÇÃO NOVA: Média da Comunidade */}
                    {comunidade && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getCorNota(comunidade.media) }}></div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Média da comunidade: <strong>{comunidade.media}</strong> ({comunidade.totalAvaliacoes} avaliações)
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <Link to={`/editar-review/${review.id}`} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem', textDecoration: 'none' }}>Editar</Link>
                      <button onClick={() => handleDelete(review.id)} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem', borderColor: '#ff5252', color: '#ff5252' }}>
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-green)', fontSize: '0.7rem', marginBottom: '5px', fontWeight: 'bold', textTransform: 'uppercase' }}>Sua Nota</span>
                  <div style={{ backgroundColor: getCorNota(review.nota), color: '#000', padding: '12px 18px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.4rem' }}>
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