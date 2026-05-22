'use client';
import { useEffect, useState } from 'react';
import { Users, Plus, X, Loader, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', bio: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAuthors = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/authors');
    const data = await res.json();
    if (res.ok) setAuthors(data.authors || []);
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/authors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { toast.success('Author created! Credentials sent via email.'); setForm({ name: '', email: '', bio: '' }); setShowForm(false); fetchAuthors(); }
      else toast.error(data.error);
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const toggleActive = async (authorId, current) => {
    const res = await fetch('/api/admin/authors', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ authorId, isActive: !current }) });
    if (res.ok) { toast.success(`Author ${!current ? 'activated' : 'deactivated'}`); fetchAuthors(); }
  };

  const inputStyle = { width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid #e5e7eb', borderRadius: 7, fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Authors</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Manage content authors on the platform</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}>
          <Plus size={16} /> Add Author
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Create New Author</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Full Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Email Address *</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Bio (optional)</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Brief author bio..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button type="submit" disabled={submitting} style={{ padding: '0.6rem 1.5rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 7, cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Creating…</> : <><Mail size={14} /> Create & Send Credentials</>}
              </button>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>A temporary password will be emailed to the author.</p>
            </div>
          </form>
        </div>
      )}

      {/* Authors list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading authors…</div>
      ) : authors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: 10, border: '1.5px dashed #e5e7eb' }}>
          <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ color: '#6b7280', margin: 0 }}>No authors yet. Add your first author above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {authors.map(a => (
            <div key={a._id} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem', fontWeight: 700, color: '#16a34a' }}>
                {a.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 0.15rem' }}>{a.name}</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>{a.email}</p>
                {a.bio && <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.2rem 0 0' }}>{a.bio}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Joined {new Date(a.createdAt).toLocaleDateString()}</span>
                <button onClick={() => toggleActive(a._id, a.isActive)}
                  title={a.isActive ? 'Deactivate' : 'Activate'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: a.isActive ? '#16a34a' : '#dc2626', fontFamily: 'inherit', fontWeight: 500 }}>
                  {a.isActive ? <><ToggleRight size={20} /> Active</> : <><ToggleLeft size={20} /> Inactive</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
