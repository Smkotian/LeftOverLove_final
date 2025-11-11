import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function PlateHeartLogo({ size = 34 }) {
  // Enhanced logo with warm yellow plate + gradient heart
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="LeftOverLove logo">
      <defs>
        <radialGradient id="plateGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffce9" />
          <stop offset="70%" stopColor="#ffe595" />
          <stop offset="100%" stopColor="#ffc940" />
        </radialGradient>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9d52" />
          <stop offset="100%" stopColor="#ff6a3d" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" fill="url(#plateGlow)" stroke="#ffb300" strokeWidth="2.5" />
      <path d="M32 41c-5.2-3.9-8.666-7.3-10.4-10.3-1.9-3.4-1.3-7.4 1-9.5 1.9-1.7 5.7-2.5 8.7 1.3 3-3.8 6.7-3 8.7-1.3 2.4 2.1 3 6.1 1.4 9.1-1.6 3-5.1 6.4-9.4 10.7z" fill="url(#heartGrad)" stroke="#ff7a34" strokeWidth="1" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="navbar" style={{ backdropFilter: 'saturate(180%) blur(14px)' }}>
      <div className="navbar-inner">
        <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontFamily: 'Poppins, Inter, sans-serif', fontSize: 20 }}>
          {imgOk ? (
            <img src="/assets/logo-plate-heart.png" alt="LeftOverLove logo" style={{ height: 30 }} onError={() => setImgOk(false)} />
          ) : (
            <PlateHeartLogo />
          )}
          <span style={{ background: 'linear-gradient(90deg,#ff9d52,#ff6a3d)', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: '.5px' }}>LeftOverLove</span>
        </Link>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {user && user.role === 'donor' && <Link className="link" to="/donor-dashboard">My Donations</Link>}
          {user && user.role === 'ngo' && <Link className="link" to="/donations">Feed</Link>}
          {user && <Link className="link" to="/tracking">Tracking</Link>}
          {!user && <Link className="link" to="/login">Login</Link>}
          {!user && <Link className="link" to="/signup">Signup</Link>}
          {user && <button className="btn" onClick={logout}>Logout</button>}
        </div>
      </div>
    </div>
  );
}
