'use client';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <h3>Authentic Light Center</h3>
          <p className="footer-tagline">Realising the Rainbow Body</p>
          <p className="footer-desc">
            Guided by Mahavatar Babaji and Mataji, we assist in deep spiritual healing, chakra balancing, Kundalini activation, and co-creating a new age of consciousness on Earth.
          </p>
        </div>

        <div className="footer-contact">
          <h4>Connect With Us</h4>
          <ul>
            <li>
              <span className="icon">📞</span>
              <span>+91-9885841444</span>
            </li>
            <li>
              <span className="icon">✉️</span>
              <span>info.authenticlightcenter@gmail.com</span>
            </li>
            <li>
              <span className="icon">📍</span>
              <span>Pune, Maharashtra, India</span>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/meditation">Guided Meditations</a></li>
            <li><a href="/subscribe">Pricing & Plans</a></li>
            <li><a href="/#schedule">Meditation Schedule</a></li>
            <li><a href="https://www.youtube.com/@AuthenticLightCenterPune" target="_blank" rel="noopener noreferrer">YouTube Channel</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Authentic Light Center. All Rights Reserved. Co-creating a New Age of Consciousness.</p>
      </div>

      <style jsx>{`
        .footer-container {
          background: rgba(229, 242, 232, 0.95);
          border-top: 1px solid rgba(46, 139, 87, 0.12);
          padding: 4rem 2rem 2rem 2rem;
          color: var(--text-muted);
          margin-top: 5rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 4rem;
        }

        .footer-info h3 {
          color: var(--text-main);
          font-size: 1.4rem;
          margin-bottom: 0.25rem;
        }

        .footer-tagline {
          color: var(--color-accent);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .footer-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 450px;
        }

        .footer-contact h4, .footer-links h4 {
          color: var(--text-main);
          font-size: 1.1rem;
          margin-bottom: 1.2rem;
          font-weight: 600;
        }

        .footer-contact ul, .footer-links ul {
          list-style: none;
        }

        .footer-contact li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
        }

        .footer-contact .icon {
          font-size: 1.1rem;
        }

        .footer-links li {
          margin-bottom: 0.6rem;
        }

        .footer-links a {
          font-size: 0.95rem;
          color: var(--text-muted);
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--color-primary);
          padding-left: 3px;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 3.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(46, 139, 87, 0.1);
          text-align: center;
          font-size: 0.85rem;
        }

        @media (max-width: 900px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .footer-info {
            grid-column: span 2;
          }
        }

        @media (max-width: 600px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-info {
            grid-column: span 1;
          }
        }
      `}</style>
    </footer>
  );
}
