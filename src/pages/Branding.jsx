import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export default function Branding() {
  const { data } = usePortfolio();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset internal image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedIndex]);

  // Auto cycle images
  useEffect(() => {
    const project = data.branding[selectedIndex];
    if (project?.images?.length > 1) {
      // We have images.length + 1 slides (0 is montage, 1..N are images)
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % (project.images.length + 1));
      }, 4000); // 4 seconds for montage/cycle
      return () => clearInterval(interval);
    }
  }, [selectedIndex, data.branding]);

  const handleNext = () => {
    if (data.branding.length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % data.branding.length);
  };

  const handlePrev = () => {
    if (data.branding.length === 0) return;
    setSelectedIndex((prev) => (prev - 1 + data.branding.length) % data.branding.length);
  };

  const currentProject = data.branding[selectedIndex] || null;
  
  if (data.branding.length === 0) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>Nenhum projeto de branding cadastrado.</p>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      <div style={styles.content}>
        {/* Mockup Display Section */}
        <section style={styles.displaySection}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentProject?.id}-${currentImageIndex}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={styles.mockupWrapper}
            >
              {currentImageIndex === 0 && currentProject?.images?.length > 1 ? (
                // Special Montage View
                <div style={styles.montageGrid}>
                  {(currentProject?.images || []).slice(0, 4).map((img, i) => (
                    <img key={i} src={img} style={styles.montageItem} alt="preview" />
                  ))}
                  <div style={styles.montageOverlay}>
                    <h2 className="font-display" style={{ fontSize: '2.5rem' }}>{currentProject?.name}</h2>
                    <p style={{ letterSpacing: '0.2em', opacity: 0.8 }}>OVERVIEW</p>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={currentProject?.images?.[currentImageIndex - 1] || currentProject?.images?.[0] || currentProject?.image || ''} 
                    alt={currentProject?.name} 
                    style={styles.mockupImage}
                    onError={(e) => console.error("Image load error", e)}
                  />
                  <div style={styles.projectInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src="/assets/logo.png" alt="Studio Search" style={{ height: '30px', opacity: 0.8 }} />
                      <h2 className="font-display" style={styles.projectName}>
                        {currentProject?.name}
                      </h2>
                    </div>
                    {currentProject?.images?.length > 0 && (
                      <div style={styles.imageCounter}>
                        {currentImageIndex === 0 ? 'Montagem' : `${currentImageIndex} / ${currentProject.images.length}`}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Magnetic Roulette / Curved Carousel */}
        <section style={styles.carouselSection}>
          <div style={styles.carouselContainer}>
            {data.branding.map((item, index) => {
              const diff = index - selectedIndex;
              const angle = diff * (isMobile ? 35 : 25); // Degrees
              const radius = isMobile ? 140 : 300;
              const x = Math.sin(angle * (Math.PI / 180)) * radius;
              const y = (1 - Math.cos(angle * (Math.PI / 180))) * radius;
              
              return (
                <motion.div
                  key={item.id}
                  style={{
                    ...styles.carouselItem,
                    borderColor: index === selectedIndex ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    background: index === selectedIndex ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  }}
                  animate={{
                    x,
                    y,
                    rotate: angle,
                    scale: index === selectedIndex ? 1.2 : 0.8,
                    opacity: Math.abs(diff) > 2 ? 0 : 1 - Math.abs(diff) * 0.3,
                  }}
                  onClick={() => setSelectedIndex(index)}
                  whileHover={{ scale: index === selectedIndex ? 1.25 : 0.9 }}
                >
                  <div style={styles.logoContainer}>
                    {item.brandLogo ? (
                      <img 
                        src={item.brandLogo} 
                        alt={item.name} 
                        style={{ 
                          width: '80%', 
                          height: '80%', 
                          objectFit: 'contain',
                          filter: index === selectedIndex ? 'none' : 'grayscale(1) brightness(2)'
                        }} 
                      />
                    ) : (
                      <span style={{ 
                        ...styles.logo, 
                        color: index === selectedIndex ? 'var(--primary-foreground)' : 'white' 
                      }}>
                        {item.logo}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div style={styles.controls}>
            <button className="btn glass" onClick={handlePrev} style={styles.controlBtn}>←</button>
            <div style={styles.indicatorLabel}>Gire para navegar</div>
            <button className="btn glass" onClick={handleNext} style={styles.controlBtn}>→</button>
          </div>
        </section>
      </div>
    </motion.main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    background: '#000',
    overflow: 'hidden',
  },
  content: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '4rem 0 10rem 0',
  },
  displaySection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  mockupWrapper: {
    width: '100%',
    maxWidth: '800px',
    aspectRatio: '16/9',
    position: 'relative',
    borderRadius: '2rem',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
  },
  mockupImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  montageGrid: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    background: '#111',
  },
  montageItem: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.6,
  },
  montageOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.4)',
    color: 'white',
    textAlign: 'center',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  projectInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '3rem 2rem 2rem',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  },
  projectName: {
    fontSize: '3rem',
    color: 'white',
  },
  carouselSection: {
    position: 'relative',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  carouselContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    perspective: '1000px',
  },
  carouselItem: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '1.5rem',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.3s, background 0.3s',
  },
  logoContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '1.2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  controls: {
    marginTop: '5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    zIndex: 10,
  },
  controlBtn: {
    width: '50px',
    height: '50px',
    padding: 0,
    borderRadius: '50%',
    fontSize: '1.2rem',
  },
  indicatorLabel: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'var(--muted-foreground)',
  },
  imageCounter: {
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    color: 'var(--primary)',
    fontWeight: 600,
    letterSpacing: '0.1em',
  }
};
