import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export default function Videos() {
  const { data } = usePortfolio();

  if (data.videos.length === 0) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>Nenhum vídeo cadastrado.</p>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: "circOut" }}
      style={styles.container}
    >
      <div style={styles.feed}>
        {data.videos.slice(0, 3).map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </motion.main>
  );
}

function VideoItem({ video }) {
  let videoUrl = video.url;
  const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');
  const isDrive = videoUrl.includes('drive.google.com');

  // Convert Google Drive share link to direct embed link
  if (isDrive) {
    const fileId = videoUrl.match(/[-\w]{25,}/);
    if (fileId) {
      videoUrl = `https://drive.google.com/get_video_info?docid=${fileId}&authuser=0`;
      // Actually, Drive direct video is tricky. Let's use embed instead which is more reliable for Drive.
      videoUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }

  const isEmbed = isYoutube || isVimeo || isDrive;

  return (
    <div style={styles.videoCard}>
      {isEmbed ? (
        <iframe
          src={isYoutube ? videoUrl.replace('watch?v=', 'embed/').split('&')[0] : videoUrl}
          style={styles.video}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={video.url}
          autoPlay
          muted
          loop
          playsInline
          style={styles.video}
        />
      )}
      
      <div style={styles.overlay}>
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="neon-badge"
          style={styles.badge}
        >
          [ {video.type} ]
        </motion.div>

        <div style={styles.info}>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display" 
            style={styles.title}
          >
            {video.title}
          </motion.h2>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  feed: {
    height: '100%',
    width: '100%',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE/Edge
  },
  videoCard: {
    height: '100vh',
    width: '100vw',
    position: 'relative',
    scrollSnapAlign: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(rgba(0,0,0,0.3), transparent 20%, transparent 80%, rgba(0,0,0,0.6))',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    pointerEvents: 'none', // Allow clicking the video behind
  },
  badge: {
    alignSelf: 'flex-end',
    marginTop: '1rem',
  },
  info: {
    marginBottom: '8rem',
  },
  title: {
    fontSize: 'clamp(2rem, 8vw, 4rem)',
    color: 'white',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
  }
};

// Global style for hiding scrollbar in Chrome/Safari
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  div::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(styleTag);
