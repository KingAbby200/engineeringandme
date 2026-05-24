'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, Loader, BookOpen, User, FolderOpen, FileText, Tag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPendingPage() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [rejectModal, setRejectModal] = useState(null); // tutorial id
  const [rejectReason, setRejectReason] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/tutorials?status=pending&limit=50')
      .then(r => r.json())
      .then(d => { setTutorials(d.tutorials || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    setProcessing(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorialId: id, action: 'approve' }),
      });
      if (res.ok) { toast.success('Tutorial approved and published!'); load(); }
      else { const d = await res.json(); toast.error(d.error); }
    } catch { toast.error('Action failed'); }
    finally { setProcessing(p => ({ ...p, [id]: false })); }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setProcessing(p => ({ ...p, [rejectModal]: true }));
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorialId: rejectModal, action: 'reject', reason: rejectReason }),
      });
      if (res.ok) { toast.success('Tutorial rejected.'); setRejectModal(null); setRejectReason(''); load(); }
      else { const d = await res.json(); toast.error(d.error); }
    } catch { toast.error('Action failed'); }
    finally { setProcessing(p => ({ ...p, [rejectModal]: false })); }
  };

  const DIFF_COLORS = { beginner: '#16a34a', intermediate: '#f59e0b', advanced: '#dc2626' };

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Pending Review</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>{tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''} awaiting approval</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}><Loader size={24} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto' }} /></div>
      ) : tutorials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
          <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 0.25rem' }}>Queue empty!</p>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>All tutorials have been reviewed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tutorials.map(t => (
            <div key={t._id} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.title}</h3>
                  <span style={{ fontSize: '0.7rem', background: `${DIFF_COLORS[t.difficulty]}18`, color: DIFF_COLORS[t.difficulty], padding: '0.15rem 0.5rem', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize' }}>{t.difficulty}</span>
                </div>
                <p style={{ color: '#6b7280', margin: '0 0 0.5rem', fontSize: '0.85rem', lineHeight: 1.5 }}>{t.description}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.775rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} />{t.author?.name}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><FolderOpen size={14} />{t.category?.name}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={14} />{t.totalPages} page{t.totalPages !== 1 ? 's' : ''}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Tag size={14} />{t.tags?.join(', ') || 'No tags'}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} />{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                <a href={`/tutorials/${t.category?.slug}/${t.slug}`} target="_blank" rel="noopener"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: 6, textDecoration: 'none', color: '#374151', fontSize: '0.8rem', fontWeight: 500 }}>
                  <Eye size={14} /> Preview
                </a>
                <button onClick={() => handleApprove(t._id)} disabled={processing[t._id]}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', opacity: processing[t._id] ? 0.6 : 1 }}>
                  <CheckCircle size={14} /> Approve
                </button>
                <button onClick={() => { setRejectModal(t._id); setRejectReason(''); }} disabled={processing[t._id]}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '1.75rem', width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>Reject Tutorial</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem' }}>Provide a reason so the author can improve their submission:</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4} placeholder="e.g. Content needs more depth, images missing captions, incorrect formulas on page 3…"
              style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectModal(null)} style={{ padding: '0.55rem 1.1rem', border: '1.5px solid #e2e8f0', borderRadius: 6, background: 'white', cursor: 'pointer', fontFamily: 'inherit', color: '#374151', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleReject} style={{ padding: '0.55rem 1.1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
