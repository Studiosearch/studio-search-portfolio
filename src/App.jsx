import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navigation from './components/Navigation';
import Home from './pages/Home';
import Branding from './pages/Branding';
import Videos from './pages/Videos';
import Sites from './pages/Sites';
import Admin from './pages/Admin';
import ClientPortfolio from './pages/ClientPortfolio';

// UI Sounds
const playClickSound = () => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAEAAQ='); // Tiny silent/pop sound base64 for demo
    // In a real app we'd load a proper UI sound file like a camera click
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio blocked by browser autoplay policy until interacted.'));
  } catch (e) {}
};

function App() {
  const location = useLocation();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      playClickSound();
    }
  }, [location.pathname, hasInteracted]);

  return (
    <>
      <Navigation />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/portfolio" replace />} />
          <Route path="/portfolio" element={<ClientPortfolio />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
