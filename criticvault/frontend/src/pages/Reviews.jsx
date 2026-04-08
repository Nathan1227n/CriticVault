import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  useEffect(() => {
    // Busca todas as reviews no Controlador (Django)
    fetch('http://localhost:8000/api/reviews/')
      .then(response => response.json())
      .then(data => {
        setReviews(data);
      })
      .catch(error => console.error("Erro ao buscar reviews:", error));
  }, []);

  // --- MÁGICA DO METASCORE: Agrupando e calculando a média ---
  const itensAgrupados = {};

  reviews.forEach(review => {
    if (!itensAgrupados[review.item]) {
      // Primeira vez que vemos esta obra: guardamos os dados e iniciamos a soma
      itensAgrupados[review.item] = {
        ...review,
        somaNotas: review.nota,
        totalAvaliacoes: 1
      };
    } else {
      // Já vimos esta obra: apenas somamos a nova nota e aumentamos o contador
      itensAgrupados[review.item].somaNotas += review.nota;
      itensAgrupados[review.item].totalAvaliacoes += 1;
    }
  });

  // Transforma nosso agrupamento de volta em uma lista para o React desenhar
  const reviewsComMedia = Object.values(itensAgrupados).map(item => ({
    ...item,
    // Calcula a média arredondada (Ex: 30 + 90 = 120 / 2 = 60)
    nota: Math.round(item.somaNotas / item.totalAvaliacoes)
  }));

  // --- LÓGICA DE FILTRO COMBINADO ---
  // Agora filtramos em cima da lista que já tem as médias calculadas
  const reviewsFiltradas = reviewsComMedia.filter(review => {
    const bateTexto = review.titulo_item.toLowerCase().includes(busca.toLowerCase());
    const bateCategoria = filtroTipo === 'TODOS' || review.tipo_item === filtroTipo;
    return bateTexto && bateCategoria;
  });

  // Função para definir a cor da nota dinamicamente
  const getCorNota = (nota) => {
    if (nota >= 80) return '#00e676';
    if (nota >= 60) return '#ffd600';
    return '#ff5252';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Cabeçalho da Página */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Reviews</h1>
        <p style={{ color: 'var(--text-muted)' }}>Explore as avaliações e a média de notas da comunidade</p>
      </div>

      {/* Barra de Busca e Filtros */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Input de Busca */}
        <input 
          type="text" 
          placeholder="🔍 Buscar por título..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid #30363d',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '6px',
            width: '100%',
            maxWidth: '500px',
            outline: 'none'
          }}
        />

        {/* Botões de Categoria */}
        <div style={{ display: 'flex', gap: '10px', backgroundColor: 'var(--card-bg)', padding: '5px', borderRadius: '8px', border: '1px solid #30363d' }}>
          {['TODOS', 'FILME', 'JOGO', 'LIVRO'].map(tipo => (
            <button 
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              style={{
                backgroundColor: filtroTipo === tipo ? '#2d333b' : 'transparent',
                color: filtroTipo === tipo ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: filtroTipo === tipo ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {tipo === 'TODOS' ? '🏠 Todos' : tipo === 'FILME' ? '🎬 Filmes' : tipo === 'JOGO' ? '🎮 Jogos' : '📖 Livros'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Reviews (2 Colunas) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '20px' }}>
        {reviewsFiltradas.map(review => (
          <div key={review.id} style={{ 
            backgroundColor: 'var(--card-bg)', 
            padding: '20px', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            border: '1px solid #21262d'
          }}>
            
            {/* Esquerda: Imagem e Textos */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {review.capa_item && (
                <img 
                  src={review.capa_item} 
                  alt={review.titulo_item} 
                  style={{ width: '90px', height: '130px', objectFit: 'cover', borderRadius: '6px' }} 
                />
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                    {review.tipo_item}
                  </span>
                  <Link to={`/review/${review.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                    <h3 style={{ margin: '5px 0 10px 0', fontSize: '1.2rem' }}>{review.titulo_item}</h3>
                  </Link>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{review.texto}"
                  </p>
                </div>
                
                {/* Rodapé do Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: '#30363d', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      {review.nome_usuario.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Última review por {review.nome_usuario}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: Nota Colorida com indicativo de Média */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Média
              </span>
              <div style={{ 
                backgroundColor: getCorNota(review.nota), 
                color: '#000', 
                padding: '12px 16px', 
                borderRadius: '6px',
                fontWeight: '900',
                fontSize: '1.4rem'
              }}>
                {review.nota}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>
                {review.totalAvaliacoes} {review.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
              </span>
            </div>

          </div>
        ))}
        
        {/* Mensagem caso a busca não encontre nada */}
        {reviewsFiltradas.length === 0 && (
          <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px' }}>
            Nenhuma review encontrada com esses filtros.
          </p>
        )}
      </div>
    </div>
  );
}