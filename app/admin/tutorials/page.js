'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { Star, Trash2, Edit, Loader, PlusCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  approved: { bg: '#f0fdf4', color: '#16a34a', label: 'Published' },
  pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
  draft: { bg: '#f1f5f9', color: '#64748b', label: 'Draft' },
};

export default function AdminTutorialsPage() {
  const { user, fetchUser } = useAuthStore();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [processing, setProcessing] = useState({});

  const load = () => {
    setLoading(true);
    const params = { limit: '100', ...(statusFilter ? { status: statusFilter } : { status: 'all' }) };
    if (user?.role === 'author') params.author = user._id;
    const qs = new URLSearchParams(params).toString();
    fetch(`/api/tutorials?${qs}`).then(r => r.json()).then(d => { setTutorials(d.tutorials || []); setLoading(false); });
  };

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { if (user) load(); }, [user, statusFilter]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This will also delete all its pages.`)) return;
    setProcessing(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`/api/tutorials/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Deleted'); load(); }
      else { const d = await res.json(); toast.error(d.error); }
    } catch { toast.error('Delete failed'); }
    finally { setProcessing(p => ({ ...p, [id]: false })); }
  };

  const handleFeature = async (id, current) => {
    setProcessing(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`/api/tutorials/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !current }),
      });
      if (res.ok) { toast.success(!current ? 'Featured!' : 'Unfeatured'); load(); }
    } catch { toast.error('Failed'); }
    finally { setProcessing(p => ({ ...p, [id]: false })); }
  };

  const filtered = tutorials.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.author?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>{user?.role === 'author' ? 'My Tutorials' : 'All Tutorials'}</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>{filtered.length} tutorials</p>
        </div>
        <Link href="/admin/tutorials/new" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', background: '#16a34a', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
          <PlusCircle size={16} /> New Tutorial
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or author…"
            style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        {['', 'approved', 'pending', 'rejected', 'draft'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 20, border: `1.5px solid ${statusFilter === s ? '#16a34a' : '#e2e8f0'}`, background: statusFilter === s ? '#16a34a' : 'white', color: statusFilter === s ? 'white' : '#6b7280', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, fontFamily: 'inherit', textTransform: 'capitalize' }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><Loader size={24} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto' }} /></div>
      ) : (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                  {['Title', 'Category', 'Author', 'Pages', 'Status', 'Views', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.775rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No tutorials found</td></tr>
                ) : filtered.map((t, i) => {
                  const st = STATUS_STYLES[t.status] || STATUS_STYLES.draft;
                  return (
                    <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                      <td style={{ padding: '0.75rem 1rem', maxWidth: 260 }}>
                        <p style={{ fontWeight: 600, color: '#0f172a', margin: '0 0 0.1rem', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{t.title}</p>
                        {t.featured && <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 600 }}>⭐ Featured</span>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{t.category?.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{t.author?.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280', textAlign: 'center' }}>{t.totalPages}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', background: st.bg, color: st.color, padding: '0.2rem 0.6rem', borderRadius: 20, fontWeight: 600 }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280', textAlign: 'center' }}>{t.views || 0}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link href={`/admin/tutorials/${t._id}/edit`}
                            style={{ padding: '0.3rem 0.6rem', border: '1.5px solid #e2e8f0', borderRadius: 5, textDecoration: 'none', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <Edit size={12} /> Edit
                          </Link>
                          <button onClick={() => handleFeature(t._id, t.featured)} disabled={processing[t._id]}
                            title={t.featured ? 'Unfeature' : 'Feature'}
                            style={{ padding: '0.3rem 0.5rem', border: `1.5px solid ${t.featured ? '#fde68a' : '#e2e8f0'}`, borderRadius: 5, background: t.featured ? '#fffbeb' : 'white', cursor: 'pointer', color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                            <Star size={12} fill={t.featured ? '#f59e0b' : 'none'} />
                          </button>
                          <button onClick={() => handleDelete(t._id, t.title)} disabled={processing[t._id]}
                            style={{ padding: '0.3rem 0.5rem', border: '1.5px solid #fecaca', borderRadius: 5, background: '#fef2f2', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
