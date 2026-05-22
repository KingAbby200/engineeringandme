'use client';
import { useState } from 'react';
import { Mail, MapPin, Clock, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { setSent(true); toast.success(data.message); }
      else toast.error(data.error);
    } catch { toast.error('Failed to send message. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.15s', color: '#111827',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 0.75rem' }}>Contact Us</h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Have a question, suggestion, or want to contribute? We'd love to hear from you. We typically respond within 24 hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: <Mail size={20} />, title: 'Email Us', detail: 'contact.engineeringandme@gmail.com', sub: 'We reply within 24 hours' },
            { icon: <Clock size={20} />, title: 'Support Hours', detail: 'Mon – Fri, 9am – 6pm WAT', sub: 'West Africa Time (UTC+1)' },
            { icon: <MapPin size={20} />, title: 'Based Online', detail: 'Global Engineering Community', sub: 'Serving learners worldwide' },
          ].map(item => (
            <div key={item.title} style={{ padding: '1.25rem', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, background: '#f0fdf4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 0.15rem', fontSize: '0.9rem' }}>{item.title}</p>
                <p style={{ color: '#374151', margin: '0 0 0.1rem', fontSize: '0.875rem' }}>{item.detail}</p>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.775rem' }}>{item.sub}</p>
              </div>
            </div>
          ))}

          <div style={{ padding: '1.25rem', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10 }}>
            <p style={{ fontWeight: 600, color: '#166534', margin: '0 0 0.4rem', fontSize: '0.875rem' }}>Want to write tutorials?</p>
            <p style={{ color: '#166534', fontSize: '0.8rem', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
              If you're an engineer with expertise to share, reach out about becoming an author on our platform.
            </p>
            <p style={{ color: '#15803d', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>authors.engineeringandme@gmail.com</p>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Send size={28} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>Message Sent!</h2>
              <p style={{ color: '#6b7280', margin: '0 0 1.5rem', lineHeight: 1.6 }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                style={{ padding: '0.6rem 1.5rem', border: '1.5px solid #e5e7eb', background: 'white', borderRadius: 8, cursor: 'pointer', color: '#374151', fontFamily: 'inherit', fontWeight: 500 }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Send a Message</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Subject *</label>
                <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What's this about?" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Message *</label>
                <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help…" rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.75 : 1, fontFamily: 'inherit', transition: 'background 0.15s' }}>
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />Sending…</> : <><Send size={16} />Send Message</>}
              </button>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                By submitting, you agree to our <a href="/privacy-policy" style={{ color: '#16a34a', textDecoration: 'none' }}>Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @media(max-width:768px){div[style*="grid-template-columns: 1fr 1.6fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
