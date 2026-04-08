import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

export default function EditReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [nota, setNota] = useState('');
  const [texto, setTexto] = useState('');
  const [tituloItem, setTituloItem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Busca os dados atuais da review para preencher os campos
    fetch(`http://localhost:8000/api/reviews/${id}/`)
      .then(response => response.json())
      .then(data => {
        setNota(data.nota);
        setTexto(data.texto);
        setTituloItem(data.titulo_item);
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao carregar a review:", error);
        setErro("Erro ao carregar a review");
        setCarregando(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const token = authService.getAccessToken();
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Usa PATCH para atualizar apenas os campos que foram modificados
      const response = await fetch(`http://localhost:8000/api/reviews/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nota: parseInt(nota),
          texto: texto
        })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar');
      }
      
      // Volta para o perfil após salvar
      navigate('/perfil');
    } catch (error) {
      console.error("Erro ao atualizar review:", error);
      setErro("Erro ao salvar. Verifique se a nota está entre 0 e 100.");
    }
  };

  if (carregando) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/perfil" style={{ color: 'var(--primary-green)', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Voltar para o Perfil
      </Link>

      <div style={{ backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '12px', border: '1px solid #30363d' }}>
        <h2 style={{ marginBottom: '10px' }}>Editar Avaliação</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Você está editando sua análise sobre <strong>{tituloItem}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {erro && (
            <div style={{ 
              backgroundColor: '#3c2626', 
              color: '#ff5555', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}>
              {erro}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Nota (0 a 100)</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Sua Crítica</label>
            <textarea 
              rows="8"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              style={{...inputStyle, resize: 'vertical'}}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  backgroundColor: '#1c2128',
  border: '1px solid #30363d',
  color: 'white',
  padding: '12px 15px',
  borderRadius: '6px',
  outline: 'none',
  width: '100%',
  fontFamily: 'inherit'
};