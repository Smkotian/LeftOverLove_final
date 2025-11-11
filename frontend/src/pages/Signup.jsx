import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor', contact: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await register(form);
      if (!res.ok) throw new Error(res.message);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'donor') navigate('/donor-dashboard');
      else navigate('/donations');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="container"><div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input className="input" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <input className="input" name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange} className="input">
          <option value="donor">Donor</option>
          <option value="ngo">NGO</option>
        </select>
        {error && <div style={{ color: 'crimson', fontSize: 14 }}>{error}</div>}
        <button className="btn" disabled={loading}>{loading ? '...' : 'Signup'}</button>
      </form>
    </div></div>
  );
}
