import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function Home() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.container}
    >
      {/* Background Grid */}
      <div style={styles.gridOverlay} />

      <div className="container" style={styles.content}>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={styles.textColumn}
        >
          <h1 className="font-display" style={styles.mainTitle}>
            Olá,<br />
            [NOME DO<br />
            CLIENTE]
          </h1>
          <div style={styles.divider} />
          <p style={styles.description}>
            Com um portfólio de mais de 100 marcas transformadas, O Studio Search 
            é uma boutique de marketing que desenvolve soluções criativas e 
            estratégicas para negócios que buscam clareza, presença digital e alta 
            percepção de valor.
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={styles.imageColumn}
        >
          <div style={styles.largeLogoWrapper}>
            <img src="/assets/logo.png" alt="Studio Search" style={styles.largeLogo} />
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f2f0eb', // Light editorial background from reference
    color: '#333',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '80px 80px',
    pointerEvents: 'none',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '4rem',
    width: '100%',
    padding: '0 5%',
    zIndex: 1,
  },
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 'clamp(4rem, 10vw, 8rem)',
    lineHeight: 1,
    fontWeight: 300,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    marginBottom: '2rem',
  },
  divider: {
    width: '120px',
    height: '4px',
    backgroundColor: 'var(--primary)',
    marginBottom: '3rem',
  },
  description: {
    fontSize: '1.2rem',
    lineHeight: 1.8,
    color: '#666',
    maxWidth: '550px',
    fontStyle: 'italic',
  },
  imageColumn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  largeLogoWrapper: {
    position: 'absolute',
    right: '-15%',
    width: '120%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  largeLogo: {
    width: '100%',
    height: 'auto',
    filter: 'grayscale(1) contrast(1.2) brightness(0.8)',
    transform: 'scale(1.5)',
  }
};
