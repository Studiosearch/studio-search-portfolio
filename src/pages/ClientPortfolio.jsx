import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import Branding from './Branding';
import Videos from './Videos';
import Sites from './Sites';

export default function ClientPortfolio() {
  const { data } = usePortfolio();
  const [highlight, setHighlight] = useState(null);

  useEffect(() => {
    // Randomize highlight on session start, only from non-empty categories
    const nonEmptyCategories = ['branding', 'videos', 'sites'].filter(cat => data[cat]?.length > 0);
    
    if (nonEmptyCategories.length > 0) {
      const randomCat = nonEmptyCategories[Math.floor(Math.random() * nonEmptyCategories.length)];
      const items = data[randomCat];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setHighlight({ ...randomItem, category: randomCat });
    }
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.container}
      id="client-portfolio-root"
    >
      {/* Editorial Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.gridOverlay} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.heroContent}
        >
          <img src="/assets/logo.png" alt="Logo" style={{ height: '50px', marginBottom: '3rem', opacity: 1, filter: 'brightness(0) invert(1)' }} />
          
          <h1 className="font-display" style={styles.heroText}>
            Com um portfólio de mais de 100 marcas transformadas, 
            <span className="text-primary"> O Studio Search</span> é uma boutique de marketing 
            que desenvolve soluções criativas e estratégicas para negócios que buscam 
            clareza, presença digital e alta percepção de valor.
          </h1>
          
          <div style={styles.divider} />
          <div style={styles.scrollHint}>Role para explorar o portfólio ↓</div>
        </motion.div>
      </section>

      <section style={styles.section} id="branding">
        <Branding isEmbedded={true} />
      </section>
      
      <section style={styles.section} id="videos">
        <Videos isEmbedded={true} />
      </section>
      
      <section style={styles.section} id="sites">
        <Sites isEmbedded={true} />
      </section>
    </motion.div>
  );
}

const styles = {
  container: {
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollbarWidth: 'none',
    backgroundColor: '#000',
  },
  heroSection: {
    height: '100vh',
    scrollSnapAlign: 'start',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000', // Black background
    padding: '0 10vw',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '100px 100px',
  },
  heroContent: {
    zIndex: 2,
    maxWidth: '1200px',
    textAlign: 'left',
  },
  heroText: {
    fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
    lineHeight: 1.2,
    color: '#fff', // White text
    maxWidth: '900px',
  },
  divider: {
    width: '100px',
    height: '4px',
    backgroundColor: 'var(--primary)',
    margin: '3rem 0',
  },
  scrollHint: {
    fontSize: '0.9rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
  },
  section: {
    minHeight: '100vh',
    scrollSnapAlign: 'start',
    position: 'relative',
  }
};
