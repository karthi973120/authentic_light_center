'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VideoPlayer({ params }) {
  const { id } = use(params);
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        // Fetch video details
        const videoRes = await fetch(`/api/videos/${id}`);
        if (!videoRes.ok) {
          if (videoRes.status === 404) {
            throw new Error('Transmission not found');
          }
          throw new Error('Failed to load video details');
        }
        
        const videoData = await videoRes.json();
        setVideo(videoData.video);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isYoutubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  if (loading) {
    return (
      <div className="player-wrapper">
        <Navbar />
        <div className="loading-container container">
          <div className="spinner"></div>
          <p>Aligning frequencies...</p>
        </div>
        <Footer />
        <style jsx>{`
          .player-wrapper { min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
          .loading-container { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10rem 0; }
          .spinner { width: 50px; height: 50px; border: 3px solid rgba(138, 43, 226, 0.1); border-top: 3px solid var(--color-secondary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="player-wrapper">
        <Navbar />
        <div className="error-container container">
          <div className="error-card glass-panel">
            <h2>Cosmic Error</h2>
            <p>{error || 'This transmission is currently unavailable.'}</p>
            <Link href="/meditation" className="btn-premium">
              Return to Catalog
            </Link>
          </div>
        </div>
        <Footer />
        <style jsx>{`
          .player-wrapper { min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
          .error-container { flex-grow: 1; display: flex; justify-content: center; align-items: center; padding: 6rem 0; }
          .error-card { text-align: center; max-width: 400px; padding: 3rem !important; }
          .error-card h2 { color: #ff007f; margin-bottom: 1rem; }
          .error-card p { margin-bottom: 2rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="player-wrapper">
      <Navbar />

      <main className="player-container container">
        {/* Video Player Display */}
        <div className="video-section">
          {video.isLocked ? (
            /* Paywall Card Overlay */
            <div className="paywall-overlay" style={{ backgroundImage: `linear-gradient(rgba(11, 1, 22, 0.8), rgba(11, 1, 22, 0.95)), url(${video.thumbnail})` }}>
              <div className="paywall-content glass-panel">
                <span className="paywall-badge">🔒 Premium Transmission</span>
                <h2>Unlock the Rainbow Body</h2>
                <p>This deep healing transmission is reserved for subscription members.</p>
                <p className="paywall-desc">Subscribe to gain access to all premium video archives, daily guided meditation streams, and exclusive spiritual healing classes.</p>
                
                <div className="paywall-actions">
                  <Link href="/subscribe" className="btn-premium">
                    View Subscription Plans
                  </Link>
                  {!user && (
                    <Link href="/login" className="btn-premium-outline">
                      Login to Existing Account
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Active Player */
            <div className="player-frame glass-panel">
              {isYoutubeUrl(video.url) ? (
                <iframe
                  className="embedded-video"
                  src={getYoutubeEmbedUrl(video.url)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  className="embedded-video"
                  src={video.url}
                  controls
                  autoPlay
                  poster={video.thumbnail}
                ></video>
              )}
            </div>
          )}
        </div>

        {/* Video Info Section */}
        <div className="info-section glass-panel">
          <div className="info-meta">
            <span className="category-tag">{video.category}</span>
            <span className="duration-label">⏳ {video.duration}</span>
          </div>
          <h1>{video.title}</h1>
          <p className="description">{video.description}</p>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .player-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .player-container {
          padding-top: 3rem;
          flex-grow: 1;
        }

        .video-section {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
          aspect-ratio: 16/9;
          position: relative;
        }

        .paywall-overlay {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }

        .paywall-content {
          max-width: 550px;
          text-align: center;
          padding: 3rem 2.5rem !important;
          animation: float 6s infinite ease-in-out;
        }

        .paywall-badge {
          background: rgba(255, 0, 127, 0.15);
          border: 1px solid #ff007f;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .paywall-content h2 {
          font-size: 1.8rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .paywall-content p {
          color: var(--text-main);
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .paywall-desc {
          font-size: 0.85rem !important;
          color: var(--text-muted) !important;
          margin-bottom: 2rem !important;
          line-height: 1.5;
        }

        .paywall-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .player-frame {
          padding: 0 !important;
          width: 100%;
          height: 100%;
          border: none !important;
        }

        .embedded-video {
          width: 100%;
          height: 100%;
          display: block;
        }

        .info-section {
          padding: 2.5rem !important;
          margin-bottom: 5rem;
        }

        .info-meta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .category-tag {
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-secondary);
        }

        .duration-label {
          color: var(--text-muted);
        }

        .info-section h1 {
          font-size: 2rem;
          color: var(--text-main);
          margin-bottom: 1rem;
        }

        .description {
          font-size: 1.05rem;
          line-height: 1.7;
        }

        @media (max-width: 600px) {
          .paywall-actions {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .paywall-content {
            padding: 2rem 1.5rem !important;
          }
          .info-section {
            padding: 1.5rem !important;
          }
          .info-section h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
