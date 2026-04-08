import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    avatarUrl: '',
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // Carregar dados do usuário
      const userData = await authService.getUserData(token);
      setUsuario(userData);

      // Carregar perfil do usuário
      const profileData = await authService.getUserProfile(token);
      setPerfil(profileData);

      // Preencher formulário
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        bio: profileData.bio || '',
        avatarUrl: profileData.avatar_url || '',
      });
    } catch (err) {
      setErro('Erro ao carregar dados do perfil');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setSucesso('');

    try {
      const token = authService.getAccessToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // Atualizar dados do usuário
      const userData = await authService.updateUserData(
        token,
        formData.firstName,
        formData.lastName,
        formData.email
      );

      // Atualizar perfil do usuário
      const profileData = await authService.updateUserProfile(
        token,
        formData.bio,
        formData.avatarUrl
      );

      // Atualizar estado
      setUsuario(userData);
      setPerfil(profileData);
      localStorage.setItem('user', JSON.stringify(userData));

      setSucesso('Perfil atualizado com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      setErro('Erro ao atualizar perfil. Tente novamente.');
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <Link 
        to="/perfil" 
        style={{ 
          color: 'var(--text-muted)', 
          textDecoration: 'none', 
          marginBottom: '20px', 
          display: 'inline-block' 
        }}
      >
        ← Voltar para o Perfil
      </Link>

      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        padding: '40px', 
        borderRadius: '12px', 
        border: '1px solid #30363d',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginBottom: '10px' }}>Configurações do Perfil</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Atualize suas informações pessoais e dados públicos do perfil
        </p>

        {erro && (
          <div style={{ 
            backgroundColor: '#3c2626', 
            color: '#ff5555', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {erro}
          </div>
        )}

        {sucesso && (
          <div style={{ 
            backgroundColor: '#263426', 
            color: '#55ff55', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            ✓ {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Seção: Dados Pessoais */}
          <fieldset style={{ 
            border: '1px solid #30363d', 
            padding: '20px', 
            borderRadius: '6px',
            backgroundColor: '#161b22'
          }}>
            <legend style={{ color: 'var(--primary-green)', fontWeight: 'bold', padding: '0 10px' }}>
              Dados Pessoais
            </legend>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  Primeiro Nome (opcional)
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Ex: João"
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  Último Nome (opcional)
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Ex: Silva"
                />
              </div>
            </div>

            <div style={{ marginTop: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="seu.email@example.com"
                required
              />
            </div>
          </fieldset>

          {/* Seção: Perfil Público */}
          <fieldset style={{ 
            border: '1px solid #30363d', 
            padding: '20px', 
            borderRadius: '6px',
            backgroundColor: '#161b22'
          }}>
            <legend style={{ color: 'var(--primary-green)', fontWeight: 'bold', padding: '0 10px' }}>
              Perfil Público
            </legend>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                Bio (até 500 caracteres)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '100px',
                  fontFamily: 'inherit'
                }}
                placeholder="Fale um pouco sobre você. Seus interesses, hobbies, o que você curte..."
                maxLength="500"
              />
              <p style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-muted)', 
                marginTop: '5px' 
              }}>
                {formData.bio.length}/500 caracteres
              </p>
            </div>

            <div style={{ marginTop: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                URL do Avatar
              </label>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                style={inputStyle}
                placeholder="https://example.com/seu-avatar.jpg"
              />
              {formData.avatarUrl && (
                <div style={{ marginTop: '15px' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Pré-visualização:
                  </p>
                  <img 
                    src={formData.avatarUrl} 
                    alt="Avatar" 
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--primary-green)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </fieldset>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => carregarDados()}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #30363d',
                color: 'var(--text-muted)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 20px' }}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  backgroundColor: '#0d1117',
  border: '1px solid #30363d',
  color: 'white',
  padding: '10px 12px',
  borderRadius: '6px',
  outline: 'none',
  width: '100%',
  fontSize: '0.95rem',
  fontFamily: 'inherit'
};
