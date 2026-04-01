import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CreateReview() {
  const navigate = useNavigate();
  
  const [itens, setItens] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [nota, setNota] = useState('');
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Busca os filmes/jogos/livros cadastrados no banco para o usuário escolher
    axios.get('http://127.0.0.1:8000/api/itens/')
      .then(response => {
        setItens(response.data);
        if (response.data.length > 0) {
          setItemSelecionado(response.data[0].id); // Seleciona o primeiro por padrão
        }
      })
      .catch(error => console.error("Erro ao buscar itens:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setErro("Você precisa estar logado para avaliar.");
        return;
      }

      // TRUQUE DE MESTRE: Decodificando o Token JWT para pegar o ID do usuário logado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id;

      // Envia os dados para o Django criar a review
      await axios.post('http://127.0.0.1:8000/api/reviews/', {
        item: itemSelecionado,
        usuario: userId,
        nota: parseInt(nota),
        texto: texto
      });

      // Redireciona para o perfil para ele ver a review recém-criada
      navigate('/perfil');
      
    } catch (error) {
      console.error("Erro ao criar review:", error);
      setErro("Ocorreu um erro ao salvar. Verifique os dados.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Voltar para a Home
      </Link>

      <div style={{ backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '12px', border: '1px solid #30363d' }}>
        <h2 style={{ marginBottom: '10px' }}>Escrever Nova Review</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Compartilhe sua opinião sobre um jogo, filme ou livro com a comunidade.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>O que você está avaliando?</label>
            <select 
              value={itemSelecionado}
              onChange={(e) => setItemSelecionado(e.target.value)}
              style={{...inputStyle, cursor: 'pointer'}}
              required
            >
              {itens.map(item => (
                <option key={item.id} value={item.id}>
                  {item.titulo} ({item.tipo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Sua Nota (0 a 100)</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              placeholder="Ex: 85"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Sua Crítica</label>
            <textarea 
              rows="6"
              placeholder="Escreva o que você achou da obra..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              style={{...inputStyle, resize: 'vertical'}}
              required
            ></textarea>
          </div>

          {erro && <p style={{ color: '#ff5252', fontSize: '0.9rem' }}>{erro}</p>}

          <button type="submit" className="btn-primary" style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>
            Publicar Avaliação
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