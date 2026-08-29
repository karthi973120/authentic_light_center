'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/meditation');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Navbar />
      
      <main className="login-container container">
        <div className="login-card glass-panel">
          <div className="card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your spiritual journey</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-premium login-btn" disabled={loading}>
              {loading ? 'Entering Portal...' : 'Sign In'}
            </button>
          </form>

          <div className="card-footer">
            <p>
              New to the path? <Link href="/register" className="auth-link">Register here</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6rem 0;
          flex-grow: 1;
        }

        .login-card {
          width: 100%;
          max-width: 450px;
          padding: 3rem 2.5rem !important;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          animation: float 6s infinite ease-in-out;
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .card-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .card-header p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .error-message {
          background: rgba(255, 0, 127, 0.15);
          border: 1px solid #ff007f;
          color: #ffffff;
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .login-btn {
          width: 100%;
          margin-top: 1rem;
        }

        .card-footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.9rem;
        }

        .auth-link {
          color: var(--color-secondary);
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .auth-link:hover {
          color: var(--color-primary);
          text-shadow: 0 0 5px var(--color-secondary);
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
