'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Meditation');
  const [isPremium, setIsPremium] = useState(false);
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const fetchVideosAndAuth = async () => {
    try {
      // 1. Verify admin role
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      
      const userData = await userRes.json();
      if (!userData.user || userData.user.role !== 'ADMIN') {
        router.push('/meditation');
        return;
      }
      
      setUser(userData.user);

      // 2. Fetch videos
      const videosRes = await fetch('/api/videos');
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData.videos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosAndAuth();
  }, []);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          url,
          thumbnail,
          duration,
          category,
          isPremium,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add video.');
      }

      setFormSuccess('Video transmission added successfully!');
      
      // Clear fields
      setTitle('');
      setDescription('');
      setUrl('');
      setThumbnail('');
      setDuration('');
      setIsPremium(false);

      // Refresh listing
      fetchVideosAndAuth();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <Navbar />
        <div className="loading-container container">
          <div className="spinner"></div>
          <p>Verifying admin privileges...</p>
        </div>
        <Footer />
        <style jsx>{`
          .admin-wrapper { min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
          .loading-container { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10rem 0; }
          .spinner { width: 50px; height: 50px; border: 3px solid rgba(138, 43, 226, 0.1); border-top: 3px solid var(--color-secondary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <Navbar />

      <main className="admin-container container">
        <header className="admin-header">
          <h1 className="text-glow-rainbow">Admin Control Center</h1>
          <p>Upload and manage spiritual transmissions, guided audio, and lectures.</p>
        </header>

        <div className="admin-grid">
          {/* Add Video Form */}
          <div className="form-card glass-panel">
            <h2>Add New Transmission</h2>
            <p className="card-subtitle">Seed the database with new spiritual recordings</p>

            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && <div className="success-message">{formSuccess}</div>}

            <form onSubmit={handleAddVideo} className="admin-form">
              <div className="form-group">
                <label>Transmission Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 3 AM Brahma Muhurat Meditation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input text-area"
                  placeholder="Provide details about what seeker will experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label>Video URL / Embed URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="YouTube or Hosted URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group half-width">
                  <label>Thumbnail Image URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label>Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 45:30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group half-width">
                  <label>Category</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Meditation">Meditation</option>
                    <option value="Chakras">Chakras</option>
                    <option value="Ancestral Healing">Ancestral Healing</option>
                    <option value="Breathwork">Breathwork</option>
                    <option value="Lectures">Lectures</option>
                  </select>
                </div>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                />
                <label htmlFor="isPremium">🌟 Mark as Premium (Requires active subscription)</label>
              </div>

              <button type="submit" className="btn-premium submit-btn" disabled={submitting}>
                {submitting ? 'Streaming to Database...' : 'Add Transmission'}
              </button>
            </form>
          </div>

          {/* Videos List */}
          <div className="list-card glass-panel">
            <h2>Current Transmissions ({videos.length})</h2>
            <p className="card-subtitle">List of active transmissions registered in DB</p>

            <div className="video-list-scroll">
              {videos.length === 0 ? (
                <p className="empty-list">No transmissions created yet. Use the form on the left to add one.</p>
              ) : (
                videos.map((vid) => (
                  <div key={vid.id} className="video-list-item">
                    <div className="list-item-thumb" style={{ backgroundImage: `url(${vid.thumbnail})` }}></div>
                    <div className="list-item-details">
                      <h4>{vid.title}</h4>
                      <p>{vid.category} &bull; {vid.duration} &bull; {vid.isPremium ? 'Premium' : 'Free'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .admin-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .admin-container {
          padding-top: 4rem;
          flex-grow: 1;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .admin-header h1 {
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
        }

        .admin-header p {
          color: var(--text-muted);
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 3rem;
          margin-bottom: 6rem;
          align-items: start;
        }

        .form-card, .list-card {
          padding: 2.5rem !important;
        }

        .form-card h2, .list-card h2 {
          font-size: 1.5rem;
          color: var(--text-main);
        }

        .card-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .half-width {
          width: 50%;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .text-area {
          resize: vertical;
          font-family: inherit;
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .form-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .form-checkbox label {
          font-size: 0.9rem;
          color: var(--text-main);
          cursor: pointer;
        }

        .submit-btn {
          width: 100%;
          margin-top: 1rem;
        }

        .error-message {
          background: rgba(255, 0, 127, 0.15);
          border: 1px solid #ff007f;
          color: white;
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .success-message {
          background: rgba(46, 139, 87, 0.15);
          border: 1px solid var(--color-primary);
          color: var(--text-main);
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .video-list-scroll {
          max-height: 480px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-right: 0.5rem;
        }

        .video-list-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .video-list-scroll::-webkit-scrollbar-thumb {
          background: var(--border-glow);
          border-radius: 4px;
        }

        .video-list-item {
          display: flex;
          gap: 1rem;
          background: rgba(46, 139, 87, 0.04);
          border: 1px solid rgba(46, 139, 87, 0.1);
          border-radius: 8px;
          padding: 0.75rem;
          align-items: center;
        }

        .list-item-thumb {
          width: 80px;
          height: 50px;
          background-size: cover;
          background-position: center;
          border-radius: 4px;
          flex-shrink: 0;
          background-color: var(--bg-dark);
        }

        .list-item-details h4 {
          font-size: 0.95rem;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .list-item-details p {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .empty-list {
          text-align: center;
          padding: 3rem 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
