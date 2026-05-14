import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Film, PenTool, MonitorSmartphone, LayoutGrid, Phone } from 'lucide-react';

const navItems = [
  { path: '/portfolio', label: 'Portfolio', icon: LayoutGrid },
  { path: '/branding', label: 'Branding', icon: PenTool },
  { path: '/videos', label: 'Vídeos', icon: Film },
  { path: '/sites', label: 'Sites', icon: MonitorSmartphone },
];

const InstagramIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const socialLinks = [
  { url: 'https://www.instagram.com/studiosearch_/', icon: InstagramIcon, color: '#E1306C' },
  { url: 'https://wa.me/5511997711480', icon: WhatsAppIcon, color: '#25D366' },
];

export default function Navigation() {
  return (
    <>
      {/* Floating Navigation Menu */}
      <nav style={styles.nav}>
        <div className="glass" style={styles.navContainer}>
          <NavLink to="/" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <img src="/assets/logo.png" alt="Logo" style={{ height: '20px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </NavLink>
          <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 0.25rem' }} />
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.link,
                color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
              })}
            >
              {({ isActive }) => (
                <div style={styles.iconWrapper}>
                  <item.icon size={18} />
                  <span style={styles.label}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={styles.indicator}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              )}
            </NavLink>
          ))}
          <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 0.25rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0 0.5rem' }}>
            {socialLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}>
                <link.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Admin Link (Hidden/Discrete) */}
      <NavLink 
        to="/admin" 
        style={styles.adminLink}
        title="Área Administrativa"
      >
        <Settings size={20} />
      </NavLink>
    </>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: '9999px',
    gap: '0.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  },
  link: {
    textDecoration: 'none',
    position: 'relative',
    padding: '0.75rem 1.25rem',
    borderRadius: '9999px',
    transition: 'color 0.2s',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'none', // Default hidden on mobile
  },
  indicator: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(200, 255, 26, 0.1)',
    borderRadius: '9999px',
    zIndex: -1,
  },
  adminLink: {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    color: 'var(--muted-foreground)',
    opacity: 0.5,
    zIndex: 100,
    transition: 'opacity 0.2s',
    textDecoration: 'none'
  }
};

// Simple responsive tweak for labels using a style tag since it's inline CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (min-width: 640px) {
    nav span { display: inline-block !important; }
  }
  .adminLink:hover { opacity: 1 !important; }
`;
document.head.appendChild(styleSheet);
