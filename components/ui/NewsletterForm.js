'use client';
import { useState } from 'react';
import { Mail, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterForm({ compact = false, dark = false }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name }) });
      const data = await res.json();
      if (res.ok) { setDone(true); toast.success(data.message); }
      else toast.error(data.error);
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  const inputStyle = { padding: compact ? '0.5rem 0.65rem' : '0.65rem 0.9rem', border: `1.5px solid ${dark ? '#334155' : '#e5e7eb'}`, borderRadius: 6, fontSize: '0.875rem', outline: 'none', background: dark ? '#1e293b' : 'white', color: dark ? '#e2e8f0' : '#111827', fontFamily: 'IBM Plex Sans, sans-serif', width: '100%' };

  if (done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.875rem' }}>
        <CheckCircle size={18} /> <span>Subscribed! Check your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: compact ? '0.5rem' : '0.75rem' }}>
      {!compact && <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" style={inputStyle} />}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" style={{ ...inputStyle, flex: 1 }} />
        <button type="submit" disabled={loading} style={{ padding: compact ? '0.5rem 0.75rem' : '0.65rem 1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
          {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Mail size={14} />}
          {!compact && 'Subscribe'}
        </button>
      </div>
      <p style={{ fontSize: '0.7rem', color: dark ? '#64748b' : '#9ca3af', margin: 0 }}>
        No spam. Unsubscribe anytime. See our <a href="/privacy-policy" style={{ color: dark ? '#22c55e' : '#16a34a', textDecoration: 'none' }}>Privacy Policy</a>.
      </p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
