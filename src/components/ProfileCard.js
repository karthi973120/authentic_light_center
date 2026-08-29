"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileCard({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const avatarSeed = encodeURIComponent(user?.email || user?.id || 'anon');
  const avatarUrl = `https://avatars.dicebear.com/api/initials/${avatarSeed}.svg?background=%23E6F2E9`;

  return (
    <div className="profile-card">
      <div className="profile-top">
        <img src={avatarUrl} alt="avatar" className="avatar" />
        <div className="heading">
          <h2>{user?.name || 'Unnamed'}</h2>
          <p className="email">{user?.email}</p>
        </div>
      </div>

      <div className="badges">
        <span className={`badge role ${user?.role === 'ADMIN' ? 'admin' : ''}`}>{user?.role || 'USER'}</span>
        {user?.isSubscribed ? (
          <span className="badge sub">Subscribed</span>
        ) : (
          <Link href="/subscribe" className="badge subscribe">Get Premium</Link>
        )}
      </div>

      <div className="meta">
        <div>
          <p className="meta-key">Member since</p>
          <p className="meta-val">{new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="meta-key">Subscription</p>
          <p className="meta-val">{user?.isSubscribed ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : '—'}</p>
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={() => router.push('/account/edit')}>Edit Profile</button>
        <button className="btn outline" onClick={handleLogout}>Logout</button>
      </div>

      <style jsx>{`
        .profile-card {
          width: 100%;
          max-width: 820px;
          margin: 2rem auto;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(246,250,244,0.85));
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 12px 40px rgba(6, 45, 26, 0.12);
          border: 1px solid rgba(46,139,87,0.06);
        }
        .profile-top {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(46,139,87,0.12);
          background: white;
        }
        .heading h2 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--text-main, #173b2e);
        }
        .heading .email {
          margin: 0.25rem 0 0;
          color: var(--text-muted, #6b8a7a);
          font-size: 0.95rem;
        }
        .badges { margin-top: 1rem; display:flex; gap:0.5rem; align-items:center }
        .badge { padding:0.35rem 0.6rem; border-radius:999px; font-weight:700; font-size:0.8rem }
        .role { background:#f0fff4; color:#13633a; border:1px solid rgba(19,99,58,0.06) }
        .role.admin { background: linear-gradient(90deg,#ffe6b3,#ffd6e6); color:#3b1850 }
        .sub { background:linear-gradient(90deg,#d1ffd6,#b7f0d1); color:#064c2a }
        .subscribe { background:#fff7f0; color:#b35a1f; text-decoration:none }
        .meta { display:flex; gap:2rem; margin-top:1.25rem }
        .meta-key { margin:0; color:#6b8a7a; font-size:0.85rem }
        .meta-val { margin:0.25rem 0 0; font-weight:700 }
        .actions { display:flex; gap:1rem; margin-top:1.5rem }
        .btn { padding:0.6rem 1rem; border-radius:10px; cursor:pointer; font-weight:700 }
        .btn.primary { background:linear-gradient(90deg,#2e8b57,#58c48b); color:white; border:none }
        .btn.outline { background:transparent; border:1px solid rgba(46,139,87,0.12); color:var(--text-main) }
        @media (max-width:640px){ .profile-card{padding:1rem} .meta{flex-direction:column} }
      `}</style>
    </div>
  );
}
