import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

const defaultData = {
  branding: [
    { id: 1, name: 'EcoVibe', logo: 'EV', color: '#4ade80', images: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000'] },
    { id: 2, name: 'Nexus', logo: 'NX', color: '#60a5fa', images: ['https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000'] },
    { id: 3, name: 'Aura', logo: 'AU', color: '#c084fc', images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000'] },
    { id: 4, name: 'Pulse', logo: 'PL', color: '#f87171', images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000'] },
    { id: 5, name: 'Zenith', logo: 'ZN', color: '#fbbf24', images: ['https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000'] },
  ],
  videos: [
    { id: 1, title: 'Campanha de Verão', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'Captação Real' },
    { id: 2, title: 'Spot Produto IA', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'Gerado por IA' },
    { id: 3, title: 'Institucional 2026', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', type: 'Captação Real' },
  ],
  sites: [
    { id: 1, name: 'Tech Startup', url: 'https://example.com' },
    { id: 2, name: 'E-commerce Moda', url: 'https://example.org' },
  ]
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('studio-search-portfolio');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          branding: Array.isArray(parsed.branding) ? parsed.branding : [],
          videos: Array.isArray(parsed.videos) ? parsed.videos : [],
          sites: Array.isArray(parsed.sites) ? parsed.sites : []
        };
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('studio-search-auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('studio-search-portfolio', JSON.stringify(data));
  }, [data]);

  const addProject = (category, project) => {
    setData(prev => ({
      ...prev,
      [category]: [...prev[category], { ...project, id: Date.now() }]
    }));
  };

  const deleteProject = (category, id) => {
    setData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => String(item.id) !== String(id))
    }));
  };

  const login = (password) => {
    if (password === 'studio2026') {
      setIsAuthenticated(true);
      localStorage.setItem('studio-search-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('studio-search-auth');
  };

  return (
    <PortfolioContext.Provider value={{ data, addProject, deleteProject, isAuthenticated, login, logout }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
