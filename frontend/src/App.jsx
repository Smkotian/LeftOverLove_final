import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import DonationFeed from './pages/DonationFeed.jsx';
import Tracking from './pages/Tracking.jsx';
import ThankYou from './pages/ThankYou';
import Navbar from './components/Navbar.jsx';
import 'leaflet/dist/leaflet.css';

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}


export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/donor-dashboard" element={<Protected roles={['donor']}><DonorDashboard /></Protected>} />
        <Route path="/donations" element={<Protected roles={['ngo']}><DonationFeed /></Protected>} />
        <Route path="/tracking" element={<Protected><Tracking /></Protected>} />
        <Route path="/thank-you" element={<Protected><ThankYou /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function Home() {
  const { user } = useAuth();
  const [heroOk, setHeroOk] = useState(true);
  const primaryHref = !user ? '/signup' : (user.role === 'donor' ? '/donor-dashboard' : '/donations');

  useEffect(() => {
    const handle = () => {
      document.querySelectorAll('.parallax-section').forEach(sec => {
        const bg = sec.querySelector('.parallax-bg');
        if (!bg) return;
        const rect = sec.getBoundingClientRect();
        const val = Math.round(rect.top * 0.25); // 0.25x scroll
        bg.style.setProperty('--pax', `${val}px`);
      });
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => { window.removeEventListener('scroll', handle); window.removeEventListener('resize', handle); };
  }, []);

  return (
    <>
      {/* Section 1: Hero */}
      <section className="parallax-section">
        <div className="parallax-bg" style={{ backgroundImage: "url('/assets/food-sharing.jpg')" }} />
        <div className="parallax-overlay" />
        <div className="container parallax-content">
          <div className="hero" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <div className="hero-grid">
              <div>
                <h1 className="hero-title">Turning Leftovers into Love</h1>
                <p className="hero-subtitle">Donors post surplus food; NGOs accept and deliver it to those in need. Coordinate pickups, track progress on the map, and celebrate every successful delivery.</p>
                <div className="hero-cta">
                  <Link className="btn" to={primaryHref}>Get Started</Link>
                  <Link className="btn btn-accent" to="/tracking">Track Deliveries</Link>
                </div>
              </div>
              <div className="hero-img">
                {heroOk && (<img src="/assets/food-sharing.jpg" alt="Food sharing" onError={() => setHeroOk(false)} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Features */}
      <section className="container" style={{ padding: '40px 24px' }}>
        <div className="features">
          <div className="feature">
            <h3>Post Leftovers Fast</h3>
            <p>Share event surplus in seconds with quantity, location, and contact info.</p>
          </div>
          <div className="feature">
            <h3>Accept & Coordinate</h3>
            <p>NGOs accept donations, update status, and plan timely pickups.</p>
          </div>
          <div className="feature">
            <h3>See the Impact</h3>
            <p>Track the journey from pending to delivered on an interactive map.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Static Yellow CTA (no buttons per request) */}
      <section className="parallax-section" style={{ background: 'linear-gradient(180deg,#fff6d8 0%, #ffefb3 100%)' }}>
        <div className="container parallax-content" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <div className="hero" style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 12px 30px rgba(255,177,0,0.25)' }}>
            <div className="hero-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <h1 className="hero-title" style={{ fontSize: 44 }}>Join the movement</h1>
                <p className="hero-subtitle" style={{ marginBottom: 0 }}>Every plate saved is a smile earned. Help reduce waste and nourish more people today.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
