'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroParticles from '@/components/HeroParticles';

export default function Home() {
  const objectives = [
    {
      title: 'Heal ancestral and past-life traumas',
      icon: '🪷',
      desc: 'Release energetic bindings and clear emotional blocks inherited from ancestral bloodlines.'
    },
    {
      title: 'Transform inherited family patterns',
      icon: '🌿',
      desc: 'Break cycles of limiting beliefs, emotional struggles, and inherited behaviors.'
    },
    {
      title: 'Awaken Kundalini & activate rainbow body',
      icon: '🧘',
      desc: 'Ignite the sacred energy at the base of your spine and elevate your body to higher states of light.'
    },
    {
      title: 'Walk towards your Soul Purpose',
      icon: '☀️',
      desc: 'Align your thoughts, actions, and lifestyle with your true soul mission and divine guidance.'
    },
    {
      title: 'Connect with nature, lineage & guidance',
      icon: '🙏',
      desc: 'Ground your consciousness, honoring the gurus, guides, Mahavatar Babaji, and Mataji.'
    },
    {
      title: 'Pass wisdom and light to future generations',
      icon: '🌱',
      desc: 'Act as a channel of pure consciousness, securing a radiant path of light for descendants.'
    }
  ];

  const schedule = [
    { time: '3:00 AM IST', title: 'Brahma Muhurat Meditation', desc: 'The auspicious hour of creation. Access deep silence and higher dimensions when the veil is thinnest.', linkText: 'Join Live Streams', linkUrl: '/meditation' },
    { time: '8:30 AM IST', title: 'Morning Agnihotra', desc: 'Fire healing ritual to purify the atmosphere, clear toxins, and establish peaceful household vibrations.', linkText: 'Watch Archive', linkUrl: '/meditation' },
    { time: '6:30 PM IST', title: 'Evening Agnihotra', desc: 'Sunset fire ceremony to transition cleanly into the evening, clearing accumulated astral impressions.', linkText: 'Watch Archive', linkUrl: '/meditation' }
  ];

  const testimonials = [
    { name: 'Amit Sharma', role: 'Meditation Practitioner', text: 'Daily 3 AM meditation with Sunita Devi has completely shifted my energy. I feel a level of deep peace and mental clarity I never thought possible.' },
    { name: 'Sophia Rossi', role: 'Spiritual Seeker', text: 'The ancestral healing session cleared a deep-seated fear that had run in my family for generations. I feel light, free, and deeply connected to my soul purpose.' },
    { name: 'Rajesh Patel', role: 'Yoga Instructor', text: 'Kundalini activation lectures and videos on the subscription portal are structured beautifully. Authentic Light Center is a true lighthouse of spiritual growth.' }
  ];

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Main Hero Section */}
      <section className="hero-section">
        <HeroParticles />
        
        {/* Live Announcement Ticker */}
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <span className="live-dot"></span>
            <span>LIVE MEDITATION EVERY DAY AT 3:00 AM IST ON YOUTUBE & PORTAL</span>
            <span className="ticker-divider">|</span>
            <span>BOOK HEALING RETREATS NOW: TRIMBAKESHWAR & KAMAKHYA</span>
            <span className="ticker-divider">|</span>
            <Link href="/meditation" className="ticker-link">Join Stream</Link>
          </div>
        </div>

        <div className="hero-content container">
          <p className="hero-pretitle">Awaken, Heal, and Transform</p>
          <h1 className="hero-title text-glow-rainbow">
            Authentic Light Center
          </h1>
          <p className="hero-subtitle">Realising the Rainbow Body</p>
          <p className="hero-description">
            Step onto a sacred journey of cellular healing, Kundalini awakening, and deep ancestral clearing under the divine guidance of Mahavatar Babaji and Mataji.
          </p>
          
          <div className="hero-actions">
            <Link href="/meditation" className="btn-premium">
              Start Meditations
            </Link>
            <Link href="/subscribe" className="btn-premium-outline">
              View Premium Access
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section container">
        <div className="quote-card glass-panel">
          <blockquote>
            "Co-creating a new age of consciousness on Earth, guided by Mahavatar Babaji and Mataji."
          </blockquote>
          <p className="quote-author">- Authentic Light Center Mission</p>
        </div>
      </section>

      {/* Objectives / Mission grid */}
      <section className="mission-section container">
        <h2 className="section-title">Our Sacred Mission</h2>
        <p className="section-subtitle">We guide you on a comprehensive path of energetic restoration</p>

        <div className="grid-responsive mission-grid">
          {objectives.map((obj, i) => (
            <div key={i} className="mission-card glass-panel">
              <div className="card-icon">{obj.icon}</div>
              <h3>{obj.title}</h3>
              <p>{obj.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Schedule Section */}
      <section id="schedule" className="schedule-section">
        <div className="container">
          <h2 className="section-title">Daily Practice Schedule</h2>
          <p className="section-subtitle">Establish your daily alignment at high-energy portal hours</p>

          <div className="schedule-list">
            {schedule.map((item, i) => (
              <div key={i} className="schedule-item glass-panel">
                <div className="schedule-time">{item.time}</div>
                <div className="schedule-details">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Link href={item.linkUrl} className="schedule-link">
                    {item.linkText} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Sunita Devi Master Section */}
      <section className="about-section container">
        <div className="about-content glass-panel">
          <div className="about-image-placeholder">
            {/* Visual representation of spiritual flow */}
            <div className="aura-glow"></div>
            <span className="aurora-text">Sacred Presence</span>
          </div>
          <div className="about-text">
            <h2>Meet the Master: Sunita Devi</h2>
            <p className="master-title">Divine Channel for Mahavatar Babaji</p>
            <p>
              Under the sacred guidance of Mahavatar Babaji, Sunita Devi radiates wisdom, compassion, and higher consciousness. Through her grace, seekers are gently guided into profound states of healing, awakening, and inner transformation.
            </p>
            <p>
              Each guided meditation and healing archive is a gateway to transcending everyday challenges, healing ancestral imprints, and rising into the Rainbow Body—welcoming all who are ready to embody their inner light.
            </p>
            <Link href="/subscribe" className="btn-premium" style={{ marginTop: '1rem' }}>
              Subscribe to Archives
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section container">
        <h2 className="section-title">Testimonials</h2>
        <p className="section-subtitle">Stories of healing, awakening, and transformation</p>

        <div className="grid-responsive testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card glass-panel">
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-footer">
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .home-wrapper {
          min-height: 100vh;
        }

        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          overflow: hidden;
          padding: 6rem 0;
          border-bottom: 1px solid rgba(46, 139, 87, 0.12);
        }

        .ticker-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(46, 139, 87, 0.1);
          border-bottom: 1px solid rgba(46, 139, 87, 0.18);
          padding: 0.5rem 0;
          overflow: hidden;
          white-space: nowrap;
          z-index: 10;
        }

        .ticker-content {
          display: inline-flex;
          align-items: center;
          animation: ticker-animation 25s linear infinite;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-main);
        }

        @keyframes ticker-animation {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff007f;
          margin-right: 0.5rem;
          box-shadow: 0 0 8px #ff007f;
          display: inline-block;
        }

        .ticker-divider {
          margin: 0 1.5rem;
          color: rgba(12, 32, 17, 0.3);
        }

        .ticker-link {
          background: var(--color-primary);
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          margin-left: 0.5rem;
          font-weight: 800;
          color: white !important;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px !important;
        }

        .hero-pretitle {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-secondary);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .hero-subtitle {
          font-size: 1.6rem;
          color: var(--color-accent);
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }

        .hero-description {
          font-size: 1.1rem;
          max-width: 650px;
          margin: 0 auto 2.5rem auto;
          color: var(--text-muted);
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .quote-section {
          margin: 4rem auto;
          text-align: center;
        }

        .quote-card {
          border-left: 4px solid var(--color-secondary);
          padding: 3rem 2rem !important;
        }

        .quote-card blockquote {
          font-size: 1.6rem;
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--text-main);
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .quote-author {
          font-size: 0.95rem;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .section-title {
          font-size: 2.2rem;
          text-align: center;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .section-subtitle {
          font-size: 1rem;
          text-align: center;
          margin-bottom: 3.5rem;
          color: var(--text-muted);
        }

        .mission-section {
          margin-bottom: 6rem;
        }

        .mission-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          padding: 2.5rem 2rem !important;
        }

        .card-icon {
          font-size: 2.5rem;
          background: rgba(138, 43, 226, 0.1);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1px solid rgba(138, 43, 226, 0.2);
        }

        .mission-card h3 {
          font-size: 1.25rem;
          color: var(--text-main);
        }

        .schedule-section {
          background: rgba(229, 242, 232, 0.45);
          border-top: 1px solid rgba(46, 139, 87, 0.12);
          border-bottom: 1px solid rgba(46, 139, 87, 0.12);
          padding: 6rem 0;
          margin-bottom: 6rem;
        }

        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .schedule-item {
          display: flex;
          gap: 2rem;
          padding: 2rem !important;
          align-items: center;
        }

        .schedule-time {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-accent);
          min-width: 140px;
          border-right: 2px solid rgba(46, 139, 87, 0.15);
          padding-right: 1.5rem;
        }

        .schedule-details h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .schedule-link {
          display: inline-block;
          font-size: 0.85rem;
          color: var(--color-secondary);
          margin-top: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .schedule-link:hover {
          color: white;
          transform: translateX(3px);
        }

        .about-section {
          margin-bottom: 6rem;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 3.5rem;
          padding: 3.5rem !important;
          align-items: center;
        }

        .about-image-placeholder {
          height: 350px;
          background: linear-gradient(135deg, var(--bg-dark), var(--bg-deep));
          border-radius: 12px;
          border: 1px solid rgba(46, 139, 87, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .aura-glow {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,179,113,0.4) 0%, rgba(46,139,87,0.15) 50%, rgba(0,0,0,0) 100%);
          filter: blur(20px);
          animation: float 6s infinite ease-in-out;
        }

        .aurora-text {
          font-size: 1.2rem;
          color: var(--text-main);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          z-index: 1;
          text-shadow: 0 0 10px rgba(255,255,255,0.7);
        }

        .about-text h2 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .master-title {
          color: var(--color-accent);
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }

        .about-text p {
          margin-bottom: 1rem;
        }

        .testimonial-card {
          padding: 2rem !important;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .testimonial-text {
          font-style: italic;
          color: var(--text-main);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .testimonial-footer {
          display: flex;
          flex-direction: column;
        }

        .testimonial-name {
          font-weight: 700;
          color: var(--color-accent);
        }

        .testimonial-role {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .hero-title {
            font-size: 3rem;
          }
          .hero-subtitle {
            font-size: 1.3rem;
          }
          .about-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem !important;
          }
          .about-image-placeholder {
            height: 250px;
          }
        }

        @media (max-width: 600px) {
          .hero-title {
            font-size: 2.25rem;
          }
          .hero-actions {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            padding: 0 2rem;
          }
          .schedule-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .schedule-time {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 0.5rem;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
