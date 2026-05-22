'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const COURSES = [
  { value: 'electrical', label: 'Electrical & Electronics' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'computer', label: 'Computer Engineering' },
  { value: 'chemical', label: 'Chemical Engineering' },
  { value: 'petroleum', label: 'Petroleum Engineering' },
  { value: 'aerospace', label: 'Aerospace Engineering' },
  { value: 'structural', label: 'Structural Engineering' },
  { value: 'biomedical', label: 'Biomedical Engineering' },
  { value: 'environmental', label: 'Environmental Engineering' },
];

export default function SignupPage() {
  const [step, setStep] = useState('form'); // form | verify
  const [form, setForm] = useState({ name: '', email: '', password: '', courseOfInterest: '' });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.courseOfInterest) { toast.error('Please select your course of interest'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { toast.success('Check your email for the OTP!'); setStep('verify'); }
      else toast.error(data.error);
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, otp }) });
      const data = await res.json();
      if (res.ok) {
        toast.success('Account verified! Welcome aboard 🎉');
        router.push('/dashboard');
      } else toast.error(data.error);
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, background: '#16a34a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>Engineering<span style={{ color: '#16a34a' }}>Tutorials</span></span>
          </Link>
          {step === 'form' ? (
            <>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.4rem' }}>Create your account</h1>
              <p style={{ color: '#6b7280', margin: 0 }}>Start learning engineering for free today</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.4rem' }}>Verify your email</h1>
              <p style={{ color: '#6b7280', margin: 0 }}>We sent a 6-digit code to <strong>{form.email}</strong></p>
            </>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          {step === 'form' ? (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Password <span style={{ color: '#9ca3af', fontWeight: 400 }}>(min 8 characters)</span></label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={handleChange} placeholder="Create a strong password"
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                    onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Course of Interest</label>
                <select name="courseOfInterest" required value={form.courseOfInterest} onChange={handleChange}
                  style={{ ...inputStyle, color: form.courseOfInterest ? '#111827' : '#9ca3af' }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                  <option value="" disabled>Select your primary interest</option>
                  {COURSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0.3rem 0 0' }}>You can access tutorials from all disciplines regardless of your choice.</p>
              </div>
              <button type="submit" disabled={loading} style={{ padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: loading ? 0.75 : 1, fontFamily: 'inherit' }}>
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>📧 Check your inbox and spam folder for the verification code.</p>
              </div>
              <div>
                <label style={labelStyle}>6-Digit OTP Code</label>
                <input type="text" required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6}
                  style={{ ...inputStyle, textAlign: 'center', fontSize: '1.75rem', letterSpacing: '0.5rem', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700 }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} autoFocus />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} style={{ padding: '0.75rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: (loading || otp.length !== 6) ? 0.75 : 1, fontFamily: 'inherit' }}>
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : <><CheckCircle size={16} /> Verify Email</>}
              </button>
              <button type="button" onClick={() => setStep('form')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline', fontFamily: 'inherit' }}>
                Use a different email
              </button>
            </form>
          )}

          {step === 'form' && (
            <p style={{ textAlign: 'center', margin: '1.5rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
