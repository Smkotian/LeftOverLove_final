import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
  const res = await login(form.email, form.password);
  if (!res.ok) throw new Error(res.message);
  const next = new URLSearchParams(location.search).get('next');
  if (next) return navigate(next);
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'donor') navigate('/donor-dashboard');
  else navigate('/donations');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="container"><div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {error && <div style={{ color: 'crimson', fontSize: 14 }}>{error}</div>}
        <button className="btn" disabled={loading}>{loading ? '...' : 'Login'}</button>
      </form>
    </div></div>
  );
}
