'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/login'); // Or a generic /api/auth/me, but we can reuse login route with GET or check status
      // Wait, we can fetch user profile via getCurrentUser from a small route or just check if cookie exists.
      // Let's create a small route `/api/auth/me` or just fetch from a `/api/auth/user` endpoint.
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const data = await userRes.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    // Fetch user on route changes
    const handleRouteChange = () => fetchUser();
    // We listen to pathname changes as a proxy for navigation
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <Link href="/" className="logo-section">
          <div className="logo-image-wrapper">
            <img src="/logo.jpg" alt="ALC Logo" className="logo-image" />
          </div>
          <div className="logo-text">
            <span className="logo-title">Authentic Light Center</span>
            <span className="logo-subtitle">Realising the Rainbow Body</span>
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link href="/" className={pathname === '/' ? 'active-link' : ''} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/meditation" className={pathname === '/meditation' ? 'active-link' : ''} onClick={() => setMenuOpen(false)}>
              Meditations
            </Link>
          </li>
          <li>
            <Link href="/subscribe" className={pathname === '/subscribe' ? 'active-link' : ''} onClick={() => setMenuOpen(false)}>
              Subscribe
            </Link>
          </li>
          {user && user.role === 'ADMIN' && (
            <li>
              <Link href="/admin" className={pathname === '/admin' ? 'active-link' : ''} onClick={() => setMenuOpen(false)}>
                Admin Panel
              </Link>
            </li>
          )}

          <div className="auth-buttons">
            {user ? (
              <div className="user-profile">
                <span className="user-name">
                  {user.name} {user.isSubscribed && <span className="premium-badge">PRO</span>}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="login-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="register-btn" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </ul>
      </div>

      <style jsx>{`
        .navbar-container {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(242, 249, 244, 0.85);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(46, 139, 87, 0.12);
          padding: 1rem 2rem;
          transition: all 0.3s ease;
        }

        .navbar-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .logo-image-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--color-accent);
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-dark);
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 0.75rem;
          color: var(--color-accent, #b8860b);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-muted);
          transition: all 0.3s ease;
        }

        .nav-links a:hover, .active-link {
          color: var(--color-secondary) !important;
          text-shadow: 0 0 4px rgba(46, 139, 87, 0.2);
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-left: 1rem;
        }

        .login-link {
          color: var(--text-muted);
          font-weight: 500;
        }

        .register-btn {
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #8a2be2, #da70d6);
          border-radius: 20px;
          color: white !important;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 10px rgba(138, 43, 226, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .register-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(218, 112, 214, 0.5);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .premium-badge {
          background: linear-gradient(90deg, #ffd700, #ffa500);
          color: #110122;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.6);
        }

        .logout-btn {
          background: transparent;
          border: 1px solid rgba(46, 139, 87, 0.3);
          color: var(--text-muted);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-secondary);
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .bar {
          width: 24px;
          height: 2px;
          background: var(--text-main);
          transition: all 0.3s ease;
        }

        .bar.active:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .bar.active:nth-child(2) {
          opacity: 0;
        }
        .bar.active:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(230, 242, 233, 0.98);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 1px solid rgba(46, 139, 87, 0.15);
            transform: translateY(-120%);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
          }

          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }

          .auth-buttons {
            margin-left: 0;
            width: 100%;
            justify-content: center;
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}
