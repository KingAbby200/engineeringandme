'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Loader, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { setSent(true); }
      else toast.error(data.error || 'Something went wrong');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, background: '#16a34a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>Engineering<span style={{ color: '#16a34a' }}>Tutorials</span></span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.4rem' }}>
            {sent ? 'Check your email' : 'Reset your password'}
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
            {sent ? `We sent a reset link to ${email}` : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={30} color="#16a34a" />
              </div>
              <p style={{ color: '#4b5563', lineHeight: 1.7, margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
                If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly. Check your spam folder if you don't see it.
              </p>
              <button onClick={() => { setSent(false); setEmail(''); }}
                style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'underline' }}>
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{ width: '100%', padding: '0.65rem 0.9rem 0.65rem 2.35rem', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => e.target.style.borderColor = '#16a34a'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: loading ? 0.75 : 1, fontFamily: 'inherit' }}>
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />Sending…</> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
