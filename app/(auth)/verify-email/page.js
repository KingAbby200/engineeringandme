'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 8) { toast.error('Minimum 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) { setDone(true); setTimeout(() => router.push('/login'), 2500); }
      else toast.error(data.error || 'Reset failed');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Invalid reset link. Please request a new one.</p>
        <Link href="/forgot-password" style={{ color: '#16a34a', fontWeight: 600 }}>Request new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <CheckCircle size={40} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
        <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>Password reset!</p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Redirecting to login…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>New Password</label>
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
            style={{ ...inputStyle, paddingRight: '2.5rem' }}
            onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
            {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>Confirm Password</label>
        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
      </div>
      <button type="submit" disabled={loading}
        style={{ padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: loading ? 0.75 : 1, fontFamily: 'inherit' }}>
        {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />Resetting…</> : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, background: '#16a34a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>Engineering<span style={{ color: '#16a34a' }}>Tutorials</span></span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.4rem' }}>Set new password</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Choose a strong password for your account</p>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#9ca3af' }}>Loading…</div>}>
            <ResetForm />
          </Suspense>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Back to login</Link>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
