'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Subscribe() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null); // 'monthly', 'yearly'
  const [submitting, setSubmitting] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    };
    checkUser();
  }, []);

  const handleSubscribeClick = (plan) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedPlan(plan);
    setError('');
  };

  const handleSimulatedPayment = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Basic simulation validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment simulation failed.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/meditation');
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Light Seeker',
      price: '$0',
      period: 'forever',
      description: 'Access basic guided meditations, breathwork archives, and standard calendar schedules.',
      features: [
        'Access to free meditation recordings',
        'View full calendar schedule details',
        'Standard audio streams'
      ],
      actionText: 'Current Plan / Free Account',
      popular: false,
    },
    {
      id: 'monthly',
      name: 'Rainbow Body Pass',
      price: '$15',
      period: 'month',
      description: 'Unlock our entire archive of premium ancestral clearings, Kundalini activation series, and daily 3 AM guided live archives.',
      features: [
        'Unlock all premium video transmissions',
        'Daily 3 AM Brahma Muhurat archives',
        'Access advanced Kundalini activations',
        'Priority support for online sessions'
      ],
      actionText: 'Subscribe Monthly',
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Eternal Light Pass',
      price: '$120',
      period: 'year',
      description: 'Full annual spiritual passport. Save 33% on access to all premium material and receive early booking passes for offline retreats.',
      features: [
        'All Monthly Pass benefits included',
        'Save 33% compared to monthly tier',
        'Early access passes for retreats (Kerala, Kashi)',
        'Exclusive annual members-only live calls'
      ],
      actionText: 'Subscribe Annually',
      popular: false,
    }
  ];

  return (
    <div className="subscribe-wrapper">
      <Navbar />

      <main className="subscribe-container container">
        <header className="subscribe-header">
          <h1 className="text-glow-rainbow">Spiritual Energy Exchange</h1>
          <p>Support the co-creation of a new age of consciousness while unlocking deep-level guided healing records.</p>
        </header>

        {user && user.isSubscribed && (
          <div className="active-sub-banner glass-panel">
            <h3>✨ Your Spiritual Passport is Active!</h3>
            <p>You have full premium access unlocked. Head over to the meditation portal to play any premium content.</p>
            <Link href="/meditation" className="btn-premium" style={{ marginTop: '1rem' }}>
              Open Meditation Library
            </Link>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card glass-panel ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <span className="popular-tag">Most Recommended</span>}
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <div className="plan-price">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">/ {plan.period}</span>
                </div>
                <p>{plan.description}</p>
              </div>

              <ul className="plan-features">
                {plan.features.map((feat, i) => (
                  <li key={i}>
                    <span className="feature-check">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="plan-action">
                {plan.id === 'free' ? (
                  <Link href={user ? '/meditation' : '/register'} className="btn-premium-outline full-width-btn">
                    {user ? 'Explore Library' : 'Create Free Account'}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSubscribeClick(plan.id)}
                    className={`btn-premium full-width-btn ${plan.id === 'monthly' ? 'pulse-button' : ''}`}
                    disabled={user && user.isSubscribed}
                  >
                    {user && user.isSubscribed ? 'Already Subscribed' : plan.actionText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Simulator Modal */}
        {selectedPlan && (
          <div className="modal-overlay">
            <div className="modal-content glass-panel">
              <button className="close-modal" onClick={() => setSelectedPlan(null)}>&times;</button>
              
              <div className="modal-header">
                <h2>Simulated Payment</h2>
                <p>Completing transaction for {selectedPlan === 'monthly' ? 'Rainbow Body Pass (Monthly)' : 'Eternal Light Pass (Annually)'}</p>
              </div>

              {success ? (
                <div className="success-state">
                  <div className="success-checkmark">✓</div>
                  <h3>Transaction Successful!</h3>
                  <p>Your spiritual passport is being configured. Redirecting to portal...</p>
                </div>
              ) : (
                <form onSubmit={handleSimulatedPayment} className="payment-form">
                  {error && <div className="error-message">{error}</div>}

                  <div className="form-group">
                    <label>Simulated Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group half-width">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="form-group half-width">
                      <label>CVC / CVV</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="payment-note">
                    <p>💡 <strong>Development Note:</strong> This is a secure payment simulation. You can input any card details to activate premium capabilities locally.</p>
                  </div>

                  <button type="submit" className="btn-premium submit-payment" disabled={submitting}>
                    {submitting ? 'Verifying with Network...' : 'Pay & Unlock Archives'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .subscribe-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .subscribe-container {
          padding-top: 4rem;
          flex-grow: 1;
        }

        .subscribe-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem auto;
        }

        .subscribe-header h1 {
          font-size: 2.8rem;
          margin-bottom: 0.75rem;
        }

        .subscribe-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .active-sub-banner {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 3rem auto;
          border: 1px solid var(--color-accent);
          background: rgba(255, 215, 0, 0.05);
          padding: 2.5rem !important;
        }

        .active-sub-banner h3 {
          color: var(--color-accent);
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          margin-bottom: 6rem;
          align-items: stretch;
        }

        .plan-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 2.5rem !important;
          position: relative;
          height: 100%;
        }

        .plan-card.popular {
          border: 2px solid var(--color-secondary);
          box-shadow: 0 10px 30px rgba(46, 139, 87, 0.25);
        }

        .popular-tag {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-secondary);
          color: white;
          padding: 0.3rem 1.2rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 10px rgba(46, 139, 87, 0.3);
        }

        .plan-header h2 {
          font-size: 1.6rem;
          margin-bottom: 1rem;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          margin-bottom: 1.5rem;
        }

        .price-amount {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1;
        }

        .price-period {
          font-size: 1rem;
          color: var(--text-muted);
          margin-left: 0.5rem;
        }

        .plan-card p {
          font-size: 0.95rem;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .plan-features {
          list-style: none;
          margin-bottom: 2.5rem;
          flex-grow: 1;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .feature-check {
          color: var(--color-secondary);
          font-weight: bold;
        }

        :global(.full-width-btn) {
          width: 100% !important;
          text-align: center;
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(229, 242, 232, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 200;
          padding: 1.5rem;
        }

        .modal-content {
          width: 100%;
          max-width: 480px;
          padding: 3rem 2.5rem !important;
          position: relative;
          box-shadow: 0 20px 50px rgba(12, 32, 17, 0.15);
        }

        .close-modal {
          position: absolute;
          top: 15px;
          right: 20px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 2rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close-modal:hover {
          color: var(--color-primary);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          font-size: 1.6rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .modal-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .payment-form {
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

        .payment-note {
          background: rgba(46, 139, 87, 0.05);
          border: 1px dashed rgba(46, 139, 87, 0.3);
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .submit-payment {
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
          text-align: center;
        }

        .success-state {
          text-align: center;
          padding: 3rem 0;
        }

        .success-checkmark {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: rgba(46, 139, 87, 0.15);
          border: 2px solid var(--color-primary);
          color: var(--color-secondary);
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
          box-shadow: 0 0 20px rgba(46, 139, 87, 0.3);
        }

        .success-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .success-state p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .pulse-button {
          animation: pulse-glow 3s infinite;
        }

        @media (max-width: 600px) {
          .plan-card {
            padding: 2rem 1.5rem !important;
          }
          .modal-content {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
export const dynamic = 'force-dynamic';
