'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MeditationCatalog() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Meditation', 'Chakras', 'Ancestral Healing', 'Breathwork', 'Lectures'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user info
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }
        
        // Fetch videos
        const videosRes = await fetch('/api/videos');
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setVideos(videosData.videos || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="catalog-wrapper">
      <Navbar />

      <main className="catalog-container container">
        {/* Header Section */}
        <header className="catalog-header">
          <h1 className="text-glow-rainbow">Spiritual Healing Portal</h1>
          <p>Explore guided meditations, sound baths, Kundalini activations, and ancestral healing sessions.</p>
        </header>

        {/* Subscription Promo Banner if not subscribed */}
        {(!user || !user.isSubscribed) && (
          <div className="promo-banner glass-panel">
            <div className="promo-text">
              <h3>Unlock Premium Guided Sessions</h3>
              <p>Get full unlimited access to daily Brahma Muhurat meditations, Kundalini lectures, and high-frequency energy files.</p>
            </div>
            <Link href="/subscribe" className="btn-premium">
              Subscribe Now
            </Link>
          </div>
        )}

        {/* Filter Categories */}
        <nav className="filter-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Loading State */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Accessing Higher Dimensions...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="empty-state glass-panel">
            <p>No transmissions found in this category. Check back soon!</p>
          </div>
        ) : (
          /* Video Grid */
          <div className="grid-responsive video-grid">
            {filteredVideos.map((video) => (
              <Link href={`/meditation/${video.id}`} key={video.id} className="video-card glass-panel">
                <div className="card-thumbnail-wrapper">
                  {/* Thumbnail Image placeholder / generated illustration CSS */}
                  <div className="thumbnail-placeholder" style={{ backgroundImage: `url(${video.thumbnail})` }}>
                    <div className="thumbnail-overlay">
                      {video.isLocked ? (
                        <div className="lock-indicator">
                          <span>🔒 Premium</span>
                        </div>
                      ) : (
                        <div className="play-indicator">
                          <span>▶ Play Now</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="duration-tag">{video.duration}</span>
                </div>
                
                <div className="card-info">
                  <span className="category-tag">{video.category}</span>
                  <h3>{video.title}</h3>
                  <p>{video.description.length > 100 ? `${video.description.substring(0, 100)}...` : video.description}</p>
                  
                  <div className="card-footer-info">
                    {video.isPremium ? (
                      <span className="premium-label">PRO Transmission</span>
                    ) : (
                      <span className="free-label">Free Transmission</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .catalog-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .catalog-container {
          padding-top: 4rem;
          flex-grow: 1;
        }

        .catalog-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem auto;
        }

        .catalog-header h1 {
          font-size: 2.8rem;
          margin-bottom: 0.75rem;
        }

        .catalog-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .promo-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2.5rem 3rem !important;
          border-left: 4px solid var(--color-accent);
          margin-bottom: 3.5rem;
          gap: 2rem;
          background: rgba(255, 215, 0, 0.05);
        }

        .promo-text h3 {
          font-size: 1.4rem;
          color: white;
          margin-bottom: 0.5rem;
        }

        .promo-text p {
          max-width: 600px;
          font-size: 0.95rem;
        }

        .filter-nav {
          display: flex;
          gap: 0.8rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          margin-bottom: 3rem;
          scrollbar-width: none;
        }

        .filter-nav::-webkit-scrollbar {
          display: none;
        }

        .filter-btn {
          padding: 0.6rem 1.6rem;
          background: rgba(46, 139, 87, 0.08);
          border: 1px solid var(--border-glow);
          border-radius: 20px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .filter-btn:hover, .filter-btn.active {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 10px rgba(46, 139, 87, 0.25);
        }

        .loading-state {
          text-align: center;
          padding: 5rem 0;
          color: var(--text-muted);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(46, 139, 87, 0.1);
          border-top: 3px solid var(--color-secondary);
          border-radius: 50%;
          margin: 0 auto 1.5rem auto;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem !important;
          color: var(--text-muted);
        }

        .video-grid {
          margin-bottom: 5rem;
        }

        .video-card {
          padding: 0 !important;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .card-thumbnail-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #0f031e;
        }

        .thumbnail-placeholder {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .video-card:hover .thumbnail-placeholder {
          transform: scale(1.05);
        }

        .thumbnail-overlay {
          position: absolute;
          inset: 0;
          background: rgba(11, 1, 22, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .video-card:hover .thumbnail-overlay {
          background: rgba(11, 1, 22, 0.6);
          opacity: 1;
        }

        .lock-indicator, .play-indicator {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          color: white;
          backdrop-filter: blur(5px);
        }

        .lock-indicator {
          background: rgba(255, 0, 127, 0.7);
          border: 1px solid rgba(255, 0, 127, 0.5);
        }

        .play-indicator {
          background: rgba(46, 139, 87, 0.7);
          border: 1px solid rgba(46, 139, 87, 0.5);
        }

        .duration-tag {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .category-tag {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-secondary);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .card-info h3 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: var(--text-main);
          line-height: 1.3;
        }

        .card-info p {
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }

        .card-footer-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(46, 139, 87, 0.1);
          padding-top: 1rem;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .premium-label {
          color: var(--color-accent);
        }

        .free-label {
          color: var(--color-primary);
        }

        @media (max-width: 900px) {
          .promo-banner {
            flex-direction: column;
            text-align: center;
            padding: 2rem !important;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
