import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Monitor, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const devices = {
  mobile: { width: 360, height: 640, borderRadius: 32, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 700, height: 900, borderRadius: 24, icon: Tablet, label: 'Tablet' },
  desktop: { width: 1100, height: 700, borderRadius: 12, icon: Monitor, label: 'Desktop' },
};

export default function Sites() {
  const { data } = usePortfolio();
  const [selectedSite, setSelectedSite] = useState(0);
  const [currentDevice, setCurrentDevice] = useState('desktop');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [selectedSite, currentDevice]);

  if (data.sites.length === 0) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>Nenhum site cadastrado.</p>
      </div>
    );
  }

  const site = data.sites[selectedSite];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.container}
    >
      <div className="container" style={styles.content}>
        <div style={styles.sidebar}>
          <h1 className="font-display" style={styles.pageTitle}>Web <span className="text-primary">Exp</span></h1>
          <div style={styles.siteList}>
            {data.sites.map((s, idx) => (
              <button 
                key={s.id}
                onClick={() => setSelectedSite(idx)}
                className="btn glass"
                style={{
                  ...styles.siteBtn,
                  borderColor: selectedSite === idx ? 'var(--primary)' : 'transparent',
                  color: selectedSite === idx ? 'var(--primary)' : 'white'
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.previewSection}>
          {/* Device Morph Container */}
          <motion.div
            layout
            animate={{
              width: devices[currentDevice].width,
              height: devices[currentDevice].height,
              borderRadius: devices[currentDevice].borderRadius,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="glass"
            style={styles.deviceFrame}
          >
            {isLoading && (
              <div style={styles.loader}>
                <div className="spinner"></div>
                <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>Carregando experiência...</p>
              </div>
            )}
            {/* Site Content */}
            <div style={{ ...styles.deviceContent, opacity: isLoading ? 0 : 1 }}>
              <iframe 
                src={site.url} 
                title={site.name}
                onLoad={() => setIsLoading(false)}
                style={styles.iframe}
              />
            </div>
            
            {/* Device Specific Details */}
            {currentDevice === 'mobile' && <div style={styles.homeButton} />}
          </motion.div>

          {/* Morph Controls */}
          <div style={styles.controls}>
            <div style={styles.deviceToggle}>
              {Object.entries(devices).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setCurrentDevice(key)}
                  className="btn glass"
                  style={{
                    ...styles.controlBtn,
                    backgroundColor: currentDevice === key ? 'var(--primary)' : 'transparent',
                    color: currentDevice === key ? 'var(--primary-foreground)' : 'white',
                  }}
                >
                  <config.icon size={20} />
                  <span style={styles.controlLabel}>{config.label}</span>
                </button>
              ))}
            </div>

            <a 
              href={site.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn"
              style={styles.visitBtn}
            >
              Acessar Site <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '4rem 0 10rem',
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '2rem',
    alignItems: 'start',
    width: '95vw',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
  },
  siteList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  siteBtn: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    width: '100%',
    padding: '0.8rem 1.2rem',
    border: '1px solid transparent',
    fontSize: '0.9rem',
  },
  previewSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    width: '100%',
  },
  deviceFrame: {
    position: 'relative',
    boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
    border: '8px solid #222',
    overflow: 'hidden',
    backgroundColor: '#fff',
    maxWidth: '90vw',
    transformOrigin: 'top center',
  },
  deviceContent: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  homeButton: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '4px',
    backgroundColor: '#444',
    borderRadius: '2px',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
  },
  deviceToggle: {
    display: 'flex',
    gap: '1rem',
  },
  visitBtn: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    padding: '1rem 2rem',
    borderRadius: '9999px',
    fontSize: '1rem',
    fontWeight: 600,
    gap: '0.8rem',
    boxShadow: '0 10px 20px rgba(200, 255, 26, 0.2)',
  },
  controlBtn: {
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
  },
  controlLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  loader: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    zIndex: 5,
  }
};
