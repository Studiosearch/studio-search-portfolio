import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Admin() {
  const { data, addProject, deleteProject: deleteProjectContext, isAuthenticated, login, logout } = usePortfolio();
  const [activeTab, setActiveTab] = useState('branding');
  const [password, setPassword] = useState('');

  // Calculate storage usage
  const storageUsage = () => {
    const total = 5 * 1024 * 1024; // ~5MB
    const used = JSON.stringify(data).length;
    return Math.min(Math.round((used / total) * 100), 100);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!login(password)) {
      alert('Senha incorreta!');
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.loginContainer}
      >
        <form onSubmit={handleLogin} className="glass" style={styles.loginCard}>
          <h1 className="font-display" style={styles.title}>Admin <span className="text-primary">Login</span></h1>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Digite a senha..."
              required
            />
          </div>
          <button type="submit" className="btn bg-primary" style={styles.loginBtn}>Entrar</button>
        </form>
      </motion.main>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={styles.container}
    >
      <div className="container">
        <header style={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="font-display" style={styles.title}>Painel <span className="text-primary">Admin</span></h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <p style={styles.subtitle}>Gerencie os conteúdos do seu portfólio.</p>
                
                <button 
                  onClick={() => {
                    const json = JSON.stringify(data);
                    navigator.clipboard.writeText(json);
                    alert('Código de Backup copiado! Mande para o seu assistente de IA para salvar permanentemente no código.');
                  }}
                  className="btn"
                  style={styles.backupBtn}
                >
                  <Save size={16} /> Gerar Backup para o Código
                </button>

                <div style={styles.storageMeter}>
                  <div style={{ ...styles.storageBar, width: `${storageUsage()}%`, backgroundColor: storageUsage() > 80 ? '#ff4d4d' : 'var(--primary)' }} />
                  <span style={styles.storageLabel}>Espaço: {storageUsage()}%</span>
                </div>
              </div>
            </div>
            <button onClick={logout} className="btn glass" style={{ color: '#ff4d4d' }}>Sair</button>
          </div>
        </header>

        <div style={styles.tabs}>
          {['branding', 'videos', 'sites'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn glass"
              style={{
                ...styles.tabBtn,
                color: activeTab === tab ? 'var(--primary)' : 'white',
                borderColor: activeTab === tab ? 'var(--primary)' : 'transparent',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <section className="glass" style={styles.content}>
          <Form category={activeTab} onSubmit={(project) => addProject(activeTab, project)} />
          
          <div style={styles.list}>
            <h3 style={styles.listTitle}>Itens Atuais</h3>
            <div style={styles.listScroll}>
              {data[activeTab].map(item => (
                <div key={item.id} style={styles.listItem}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500 }}>{item.name || item.title}</span>
                    <span style={styles.itemType}>{item.type || (activeTab === 'branding' ? 'Branding' : 'Website')}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      deleteProjectContext(activeTab, item.id);
                    }}
                    style={styles.deleteBtn}
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
}

function Form({ category, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const resizeImage = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 0.7 quality JPEG for high compression
      };
    });
  };

  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsProcessing(true);
      const isVideo = files[0].type.startsWith('video/');
      
      if (isVideo) {
        const file = files[0];
        if (file.size > 2 * 1024 * 1024) {
          alert('Vídeo muito grande! Máximo 2MB.');
          setIsProcessing(false);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, url: reader.result }));
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } else {
        const promises = files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Resize image after reading
              resizeImage(reader.result).then(resolve);
            };
            reader.readAsDataURL(file);
          });
        });
        Promise.all(promises).then(results => {
          setFormData(prev => ({ ...prev, [fieldName]: results }));
          setIsProcessing(false);
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing) return;
    
    if (category === 'branding' && (!formData.name || !formData.images)) {
      alert('Por favor, preencha o nome e carregue ao menos uma imagem.');
      return;
    }
    if (category === 'videos' && (!formData.title || !formData.url)) {
      alert('Por favor, preencha o título e insira um link ou carregue um arquivo.');
      return;
    }
    if (category === 'sites' && (!formData.name || !formData.url)) {
      alert('Por favor, preencha o nome e a URL do site.');
      return;
    }

    try {
      onSubmit(formData);
      setFormData({});
      alert('Adicionado com sucesso!');
    } catch (err) {
      alert('Erro ao salvar. Verifique se os arquivos não são muito grandes.');
    }
  };

  const fields = {
    branding: [
      { name: 'name', label: 'Nome do Projeto', type: 'text' },
      { name: 'logo', label: 'Sigla (Texto - fallback)', type: 'text' },
      { name: 'brandLogo', label: 'Logo da Marca (PNG)', type: 'file' },
      { name: 'images', label: 'Upload dos Mockups (Múltiplos)', type: 'file', multiple: true },
    ],
    videos: [
      { name: 'title', label: 'Título do Vídeo', type: 'text' },
      { name: 'url', label: 'URL do Vídeo (MP4)', type: 'url', placeholder: 'Link externo (Drive, YouTube, etc)' },
      { name: 'file', label: 'OU Carregar Vídeo (Local)', type: 'file', accept: 'video/*' },
      { name: 'type', label: 'Tipo', type: 'select', options: ['Gerado por IA', 'Captação Real'] },
    ],
    sites: [
      { name: 'name', label: 'Nome do Site', type: 'text' },
      { name: 'url', label: 'URL do Site', type: 'url' },
    ]
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {fields[category].map(field => (
        <div key={field.name} style={styles.fieldGroup}>
          <label style={styles.label}>{field.label}</label>
          {field.type === 'select' ? (
            <select 
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              style={styles.input}
            >
              <option value="">Selecione...</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : field.type === 'file' ? (
            <input 
              type="file"
              accept={field.accept || "image/*"}
              multiple={field.multiple}
              onChange={(e) => handleFileChange(e, field.name)}
              style={{...styles.input, paddingTop: '0.75rem'}}
            />
          ) : (
            <input 
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              style={styles.input}
              placeholder={field.placeholder || ''}
            />
          )}
        </div>
      ))}
      <button 
        type="submit" 
        className="btn bg-primary" 
        style={{ ...styles.submitBtn, opacity: isProcessing ? 0.5 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>Aguarde, processando...</>
        ) : (
          <><Plus size={18} /> Adicionar</>
        )}
      </button>
    </form>
  );
}

const styles = {
  container: {
    padding: '6rem 0 10rem',
  },
  loginContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  loginCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '3rem',
    borderRadius: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  loginBtn: {
    width: '100%',
    padding: '1rem',
  },
  header: {
    marginBottom: '3rem',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--muted-foreground)',
  },
  backupBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '0.8rem',
    padding: '0.5rem 1rem',
    borderRadius: '99px',
    gap: '0.5rem',
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  tabBtn: {
    padding: '0.75rem 2rem',
    textTransform: 'capitalize',
  },
  content: {
    padding: '3rem',
    borderRadius: '2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--muted-foreground)',
  },
  input: {
    padding: '1rem',
    borderRadius: '0.75rem',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  submitBtn: {
    marginTop: '1rem',
    gap: '0.5rem',
  },
  list: {
    borderLeft: '1px solid var(--border)',
    paddingLeft: '4rem',
    maxHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
  },
  listScroll: {
    overflowY: 'auto',
    paddingRight: '1rem',
  },
  listTitle: {
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.9rem',
  },
  itemType: {
    color: 'var(--primary)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ff4d4d',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageMeter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.05)',
    padding: '0.4rem 0.8rem',
    borderRadius: '99px',
    border: '1px solid var(--border)',
  },
  storageBar: {
    height: '6px',
    width: '100px',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  storageLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--muted-foreground)',
  }
};
