'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Loader, ImagePlus, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ height: 400, background: '#f9fafb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Loading editor…</div>,
});

const BLANK_Q = () => ({ question: '', options: ['', '', '', ''], correctOption: 0, explanation: '' });

export default function EditTutorialPage() {
  const { id } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  const [meta, setMeta] = useState({ title: '', description: '', category: '', difficulty: 'beginner', tags: '', coverImage: '', metaTitle: '', metaDescription: '', metaKeywords: '' });
  const [pages, setPages] = useState([]);
  const [deletedPageIds, setDeletedPageIds] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch(`/api/tutorials/${id}`).then(r => r.json()),
      fetch(`/api/tutorials/${id}/pages`).then(r => r.json()),
    ]).then(([catData, tutData, pagesData]) => {
      setCategories(catData.categories || []);
      const t = tutData.tutorial;
      if (t) {
        setMeta({
          title: t.title || '', description: t.description || '',
          category: t.category?._id || t.category || '',
          difficulty: t.difficulty || 'beginner',
          tags: (t.tags || []).join(', '),
          coverImage: t.coverImage || '',
          metaTitle: t.metaTitle || '', metaDescription: t.metaDescription || '',
          metaKeywords: (t.metaKeywords || []).join(', '),
        });
        if (t.coverImage) setCoverPreview(t.coverImage);
      }
      const existingPages = (pagesData.pages || []).sort((a, b) => a.order - b.order).map(p => ({
        _id: p._id, title: p.title, content: p.content, order: p.order,
        metaDescription: p.metaDescription || '',
        quiz: p.quiz || { enabled: false, questions: [] },
      }));
      setPages(existingPages.length ? existingPages : [{ title: 'Introduction', content: '', order: 1, metaDescription: '', quiz: { enabled: false, questions: [] } }]);
      setLoading(false);
    }).catch(() => { toast.error('Failed to load tutorial'); setLoading(false); });
  }, [id]);

  const uploadCover = async (file) => {
    setUploadingCover(true);
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'covers');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) { setMeta(m => ({ ...m, coverImage: data.url })); setCoverPreview(data.url); toast.success('Cover uploaded'); }
      else toast.error(data.error);
    } catch { toast.error('Upload failed'); }
    finally { setUploadingCover(false); }
  };

  const addPage = () => {
    setPages(p => [...p, { title: '', content: '', order: p.length + 1, metaDescription: '', quiz: { enabled: false, questions: [] } }]);
    setActivePage(pages.length);
  };

  const removePage = (i) => {
    if (pages.length === 1) { toast.error('At least one page is required'); return; }
    const pg = pages[i];
    if (pg._id) setDeletedPageIds(d => [...d, pg._id]);
    setPages(p => p.filter((_, idx) => idx !== i).map((pg, idx) => ({ ...pg, order: idx + 1 })));
    setActivePage(Math.max(0, i - 1));
  };

  const movePage = (i, dir) => {
    const n = [...pages]; const target = i + dir;
    if (target < 0 || target >= n.length) return;
    [n[i], n[target]] = [n[target], n[i]];
    n.forEach((p, idx) => { p.order = idx + 1; });
    setPages(n); setActivePage(target);
  };

  const updatePage = (i, field, val) => setPages(p => p.map((pg, idx) => idx === i ? { ...pg, [field]: val } : pg));
  const updateQuiz = (i, field, val) => setPages(p => p.map((pg, idx) => idx === i ? { ...pg, quiz: { ...pg.quiz, [field]: val } } : pg));
  const addQuestion = (i) => setPages(p => p.map((pg, idx) => idx === i ? { ...pg, quiz: { ...pg.quiz, questions: [...pg.quiz.questions, BLANK_Q()] } } : pg));
  const removeQuestion = (pi, qi) => setPages(p => p.map((pg, idx) => idx === pi ? { ...pg, quiz: { ...pg.quiz, questions: pg.quiz.questions.filter((_, qIdx) => qIdx !== qi) } } : pg));
  const updateQuestion = (pi, qi, field, val) => setPages(p => p.map((pg, idx) => idx === pi ? { ...pg, quiz: { ...pg.quiz, questions: pg.quiz.questions.map((q, qIdx) => qIdx === qi ? { ...q, [field]: val } : q) } } : pg));
  const updateOption = (pi, qi, oi, val) => setPages(p => p.map((pg, idx) => idx === pi ? { ...pg, quiz: { ...pg.quiz, questions: pg.quiz.questions.map((q, qIdx) => qIdx === qi ? { ...q, options: q.options.map((o, oIdx) => oIdx === oi ? val : o) } : q) } } : pg));

  const handleSave = async () => {
    if (!meta.title || !meta.description || !meta.category) { toast.error('Fill in title, description, and category'); return; }
    if (pages.some(p => !p.title || !p.content)) { toast.error('All pages must have a title and content'); return; }
    setSaving(true);
    try {
      // Update tutorial meta
      const tutRes = await fetch(`/api/tutorials/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...meta, tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean), metaKeywords: meta.metaKeywords.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (!tutRes.ok) { const d = await tutRes.json(); toast.error(d.error); return; }

      // Delete removed pages
      for (const pid of deletedPageIds) {
        await fetch(`/api/tutorials/${id}/pages/${pid}`, { method: 'DELETE' });
      }

      // Upsert pages
      for (const pg of pages) {
        if (pg._id) {
          await fetch(`/api/tutorials/${id}/pages/${pg._id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: pg.title, content: pg.content, order: pg.order, quiz: pg.quiz, metaDescription: pg.metaDescription }),
          });
        } else {
          await fetch(`/api/tutorials/${id}/pages`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pg),
          });
        }
      }

      toast.success('Tutorial updated!');
      router.push('/admin/tutorials');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', padding: '0.6rem 0.8rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const labelStyle = { display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem', color: '#64748b' }}>
      <Loader size={28} style={{ animation: 'spin 0.8s linear infinite', color: '#16a34a' }} />
      <p style={{ margin: 0 }}>Loading tutorial…</p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Edit Tutorial</h1>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 7, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontFamily: 'inherit', fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
          {saving ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} />Saving…</> : <><Save size={15} />Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem', paddingBottom: '0.6rem', borderBottom: '1px solid #f1f5f9' }}>Tutorial Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select value={meta.category} onChange={e => setMeta(m => ({ ...m, category: e.target.value }))} style={inputStyle}>
                    <option value="">Select…</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select value={meta.difficulty} onChange={e => setMeta(m => ({ ...m, difficulty: e.target.value }))} style={inputStyle}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input value={meta.tags} onChange={e => setMeta(m => ({ ...m, tags: e.target.value }))} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>
          </div>

          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>Cover Image</h2>
            {coverPreview ? (
              <div style={{ position: 'relative' }}>
                <img src={coverPreview} alt="Cover" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }} />
                <button onClick={() => { setCoverPreview(''); setMeta(m => ({ ...m, coverImage: '' })); }}
                  style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120, border: '2px dashed #e2e8f0', borderRadius: 8, cursor: 'pointer', gap: '0.5rem', color: '#9ca3af' }}>
                {uploadingCover ? <Loader size={22} style={{ animation: 'spin 0.8s linear infinite' }} color="#16a34a" /> : <><ImagePlus size={22} /><span style={{ fontSize: '0.8rem' }}>Upload new cover</span></>}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
              </label>
            )}
          </div>

          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>SEO</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Meta Title</label>
                <input value={meta.metaTitle} onChange={e => setMeta(m => ({ ...m, metaTitle: e.target.value }))} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Meta Description</label>
                <textarea value={meta.metaDescription} onChange={e => setMeta(m => ({ ...m, metaDescription: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Meta Keywords</label>
                <input value={meta.metaKeywords} onChange={e => setMeta(m => ({ ...m, metaKeywords: e.target.value }))} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: page editor */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Pages ({pages.length})</h2>
            <button onClick={addPage} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', background: '#f0fdf4', color: '#16a34a', border: '1.5px solid #bbf7d0', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' }}>
              <Plus size={14} /> Add Page
            </button>
          </div>

          {/* Page tabs */}
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
            {pages.map((pg, i) => (
              <button key={i} onClick={() => setActivePage(i)}
                style={{ padding: '0.55rem 1rem', border: 'none', borderBottom: `2px solid ${activePage === i ? '#16a34a' : 'transparent'}`, background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: activePage === i ? 700 : 400, color: activePage === i ? '#16a34a' : '#64748b', whiteSpace: 'nowrap' }}>
                {i + 1}. {pg.title || 'Untitled'}
              </button>
            ))}
          </div>

          {pages[activePage] && (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Page Title *</label>
                  <input value={pages[activePage].title} onChange={e => updatePage(activePage, 'title', e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                  <button onClick={() => movePage(activePage, -1)} disabled={activePage === 0} style={{ padding: '0.4rem', border: '1.5px solid #e2e8f0', borderRadius: 5, background: 'white', cursor: 'pointer', display: 'flex', color: '#6b7280' }}><ChevronUp size={15} /></button>
                  <button onClick={() => movePage(activePage, 1)} disabled={activePage === pages.length - 1} style={{ padding: '0.4rem', border: '1.5px solid #e2e8f0', borderRadius: 5, background: 'white', cursor: 'pointer', display: 'flex', color: '#6b7280' }}><ChevronDown size={15} /></button>
                  <button onClick={() => removePage(activePage)} style={{ padding: '0.4rem', border: '1.5px solid #fecaca', borderRadius: 5, background: '#fef2f2', cursor: 'pointer', display: 'flex', color: '#dc2626' }}><Trash2 size={15} /></button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Content *</label>
                <RichTextEditor content={pages[activePage].content} onChange={val => updatePage(activePage, 'content', val)} />
              </div>

              <div>
                <label style={labelStyle}>Page Meta Description</label>
                <input value={pages[activePage].metaDescription} onChange={e => updatePage(activePage, 'metaDescription', e.target.value)} placeholder="Optional SEO description for this page" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              {/* Quiz builder */}
              <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', background: '#fafbfc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Quiz (Optional)</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#6b7280' }}>
                    <input type="checkbox" checked={pages[activePage].quiz?.enabled || false} onChange={e => updateQuiz(activePage, 'enabled', e.target.checked)} />
                    Enable quiz
                  </label>
                </div>
                {pages[activePage].quiz?.enabled && (
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pages[activePage].quiz.questions.map((q, qi) => (
                      <div key={qi} style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', position: 'relative' }}>
                        <button onClick={() => removeQuestion(activePage, qi)} style={{ position: 'absolute', top: 8, right: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer', color: '#dc2626', padding: '0.2rem 0.35rem', display: 'flex' }}><X size={12} /></button>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', margin: '0 0 0.5rem', textTransform: 'uppercase' }}>Q{qi + 1}</p>
                        <input value={q.question} onChange={e => updateQuestion(activePage, qi, 'question', e.target.value)} placeholder="Enter question" style={{ ...inputStyle, marginBottom: '0.4rem' }} />
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <input type="radio" name={`correct-${activePage}-${qi}`} checked={q.correctOption === oi} onChange={() => updateQuestion(activePage, qi, 'correctOption', oi)} />
                            <input value={opt} onChange={e => updateOption(activePage, qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} style={{ ...inputStyle, flex: 1 }} />
                          </div>
                        ))}
                        <input value={q.explanation} onChange={e => updateQuestion(activePage, qi, 'explanation', e.target.value)} placeholder="Explanation (optional)" style={{ ...inputStyle, marginTop: '0.25rem', fontSize: '0.8rem', background: '#f0fdf4' }} />
                      </div>
                    ))}
                    <button onClick={() => addQuestion(activePage)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', border: '1.5px dashed #bbf7d0', background: '#f0fdf4', color: '#16a34a', borderRadius: 7, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' }}>
                      <Plus size={14} /> Add Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @media(max-width:900px){div[style*="1fr 1.4fr"]{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
