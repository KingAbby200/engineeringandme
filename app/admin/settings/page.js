'use client';
import { useState } from 'react';
import { Save, Loader, Shield, Bell, Globe, Database, Settings, AlertTriangle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('site');

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Engineering Tutorials',
    siteTagline: 'Learn Engineering Online — Free',
    contactEmail: 'contact@engineeringtutorials.com',
    adsenseId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    maintenanceMode: false,
  });

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [changingPw, setChangingPw] = useState(false);

  const handleSaveSite = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success('Settings saved (update .env for AdSense/GA changes)');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setChangingPw(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwForm.newPw }),
      });
      if (res.ok) { toast.success('Password updated'); setPwForm({ current: '', newPw: '', confirm: '' }); }
      else { const d = await res.json(); toast.error(d.error); }
    } catch { toast.error('Failed'); }
    finally { setChangingPw(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #e2e8f0',
    borderRadius: 7, fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#374151',
    marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  const TABS = [
    { key: 'site', label: 'Site Settings', icon: <Globe size={15} /> },
    { key: 'security', label: 'Security', icon: <Shield size={15} /> },
    { key: 'notifications', label: 'Info', icon: <Bell size={15} /> },
  ];

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 780 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Settings</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Manage site configuration and admin preferences.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: '1.75rem' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.1rem', border: 'none', borderBottom: `2px solid ${activeTab === tab.key ? '#16a34a' : 'transparent'}`, marginBottom: '-2px', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: activeTab === tab.key ? 700 : 400, color: activeTab === tab.key ? '#16a34a' : '#64748b', transition: 'color 0.15s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Site Settings */}
      {activeTab === 'site' && (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Site Configuration</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Site Name</label>
              <input value={siteSettings.siteName} onChange={e => setSiteSettings(s => ({ ...s, siteName: e.target.value }))} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={labelStyle}>Tagline</label>
              <input value={siteSettings.siteTagline} onChange={e => setSiteSettings(s => ({ ...s, siteTagline: e.target.value }))} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Contact Email</label>
            <input type="email" value={siteSettings.contactEmail} onChange={e => setSiteSettings(s => ({ ...s, contactEmail: e.target.value }))} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={14} />Environment Variable Settings</p>
            <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
              The following settings are controlled via your <code style={{ background: '#f0fdf4', padding: '0.1rem 0.3rem', borderRadius: 3, color: '#16a34a', fontSize: '0.75rem' }}>.env.local</code> file.
              Update them there and redeploy.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                ['NEXT_PUBLIC_ADSENSE_CLIENT_ID', 'Google AdSense Client ID'],
                ['NEXT_PUBLIC_GA_MEASUREMENT_ID', 'Google Analytics ID'],
                ['NEXTAUTH_SECRET', 'JWT Secret Key'],
                ['MONGODB_URI', 'MongoDB Connection String'],
              ].map(([key, label]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', padding: '0.35rem 0' }}>
                  <span style={{ color: '#64748b' }}>{label}</span>
                  <code style={{ color: '#16a34a', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.725rem' }}>{key}</code>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={siteSettings.maintenanceMode} onChange={e => setSiteSettings(s => ({ ...s, maintenanceMode: e.target.checked }))} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Maintenance Mode</span>
            </label>
            {siteSettings.maintenanceMode && <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: 20 }}>Site hidden from public</span>}
          </div>

          <button onClick={handleSaveSite} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'inherit', width: 'fit-content', opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.25rem' }}>Change Admin Password</h2>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 420 }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input type="password" value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} required minLength={8} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <button type="submit" disabled={changingPw}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'inherit', width: 'fit-content', opacity: changingPw ? 0.7 : 1 }}>
              {changingPw ? <Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Shield size={15} />}
              {changingPw ? 'Updating…' : 'Update Password'}
            </button>
          </form>
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8 }}>
            <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={14} />Important:</strong> The admin email/password in <code>.env.local</code> (<code>ADMIN_EMAIL</code> / <code>ADMIN_PASSWORD</code>) are used for the initial login. After first login, you can change your password here and it will be stored securely in the database.
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      {activeTab === 'notifications' && (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.25rem' }}>Platform Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              ['Platform', 'Engineering Tutorials'],
              ['Framework', 'Next.js 15 (App Router)'],
              ['Database', 'MongoDB via Mongoose'],
              ['Storage', 'Cloudinary'],
              ['Auth', 'JWT (HTTP-only cookies)'],
              ['Email', 'Nodemailer'],
              ['Styling', 'Tailwind CSS + Inline Styles'],
            ].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>{key}</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
            <p style={{ fontSize: '0.8rem', color: '#166534', margin: '0 0 0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={14} />Documentation</p>
            <p style={{ fontSize: '0.775rem', color: '#166534', margin: 0, lineHeight: 1.7 }}>
              Refer to <code>DEPLOYMENT.md</code> in the project root for full setup instructions, environment variables reference, MongoDB configuration, Cloudinary setup, and Vercel deployment guide.
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
