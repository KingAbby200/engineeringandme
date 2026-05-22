'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Loader, ImagePlus, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), { ssr: false, loading: () => <div style={{ height: 400, background: '#f9fafb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Loading editor…</div> });

const BLANK_PAGE = () => ({ title: '', content: '', order: 1, metaDescription: '', quiz: { enabled: false, questions: [] } });
const BLANK_Q = () => ({ question: '', options: ['', '', '', ''], correctOption: 0, explanation: '' });

export default function NewTutorialPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [activePage, setActivePage] = useState(0);

  const [meta, setMeta] = useState({ title: '', description: '', category: '', difficulty: 'beginner', tags: '', coverImage: '', metaTitle: '', metaDescription: '', metaKeywords: '' });
  const [pages, setPages] = useState([{ ...BLANK_PAGE(), title: 'Introduction', order: 1 }]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

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
    setPages(p => [...p, { ...BLANK_PAGE(), order: p.length + 1 }]);
    setActivePage(pages.length);
  };

  const removePage = (i) => {
    if (pages.length === 1) { toast.error('At least one page required'); return; }
    setPages(p => p.filter((_, idx) => idx !== i).map((pg, idx) => ({ ...pg, order: idx + 1 })));
    setActivePage(Math.max(0, i - 1));
  };

  const movePage = (i, dir) => {
    const n = [...pages];
    const target = i + dir;
    if (target < 0 || target >= n.length) return;
    [n[i], n[target]] = [n[target], n[i]];
    n.forEach((p, idx) => p.order = idx + 1);
    setPages(n);
    setActivePage(target);
  };

  const updatePage = (i, field, val) => setPages(p => p.map((pg, idx) => idx === i ? { ...pg, [field]: val } : pg));
  const updateQuiz = (i, field, val) => setPages(p => p.map((pg, idx) => idx === i ? { ...pg, quiz: { ...pg.quiz, [field]: val } } : pg));
  const addQuestion = (i) => setPages(p => p.map((pg, idx) => idx === i ? { ...pg, quiz: { ...pg.quiz, questions: [...pg.quiz.questions, BLANK_Q()] } } : pg));
  const updateQuestion = (pi, qi, field, val) => setPages(p => p.map((pg, idx) => idx === pi ? { ...pg, quiz: { ...pg.quiz, questions: pg.quiz.questions.map((q, qIdx) => qIdx === qi ? { ...q, [field]: val } : q) } } : pg));
  const updateOption = (pi, qi, oi, val) => setPages(p => p.map((pg, idx) => idx === pi ? { ...pg, quiz: { ...pg.quiz, questions: pg.quiz.questions.map((q, qIdx) => qIdx === qi ? { ...q, options: q.options.map((o, oIdx) => oIdx === oi ? val : o) } : q) } } : pg));
  const removeQuestion = (pi, qi) => setPages(p => p.map((pg, idx) => idx === pi ? { ...pg, quiz: { ...pg.quiz, questions: pg.quiz.questions.filter((_, qIdx) => qIdx !== qi) } } : pg));

  const handleSave = async (asDraft = false) => {
    if (!meta.title || !meta.description || !meta.category) { toast.error('Fill in title, description, and category'); return; }
    if (pages.some(p => !p.title || !p.content)) { toast.error('All pages must have a title and content'); return; }
    setSaving(true);
    try {
      const tutRes = await fetch('/api/tutorials', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...meta, tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean), status: asDraft ? 'draft' : undefined }),
      });
      const tutData = await tutRes.json();
      if (!tutRes.ok) { toast.error(tutData.error); return; }

      const tutId = tutData.tutorial._id;
      for (const page of pages) {
        await fetch(`/api/tutorials/${tutId}/pages`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(page),
        });
      }

      toast.success(asDraft ? 'Saved as draft!' : 'Tutorial submitted for review!');
      router.push('/admin/tutorials');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', padding: '0.6rem 0.8rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const labelStyle = { display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Create New Tutorial</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: '0.55rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 7, background: 'white', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', fontFamily: 'inherit', fontWeight: 500 }}>
            Save Draft
          </button>
          <button onClick={() => handleSave(false)} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit', fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
            {saving ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} />Saving…</> : <><Save size={15} />Submit for Review</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: Tutorial metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem', paddingBottom: '0.6rem', borderBottom: '1px solid #f1f5f9' }}>Tutorial Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} placeholder="e.g. Introduction to Ohm's Law" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} rows={3} placeholder="Brief overview of this tutorial…" style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select value={meta.category} onChange={e => setMeta(m => ({ ...m, category: e.target.value }))} style={{ ...inputStyle, color: meta.category ? '#111827' : '#9ca3af' }}
                    onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
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
                <input value={meta.tags} onChange={e => setMeta(m => ({ ...m, tags: e.target.value }))} placeholder="ohm's law, voltage, current, resistance" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>Cover Image</h2>
            {coverPreview ? (
              <div style={{ position: 'relative' }}>
                <img src={coverPreview} alt="Cover" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                <button onClick={() => { setCoverPreview(''); setMeta(m => ({ ...m, coverImage: '' })); }} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 130, border: '2px dashed #e2e8f0', borderRadius: 8, cursor: 'pointer', gap: '0.5rem', color: '#9ca3af', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#16a34a'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                {uploadingCover ? <Loader size={22} style={{ animation: 'spin 0.8s linear infinite' }} color="#16a34a" /> : <><ImagePlus size={22} /><span style={{ fontSize: '0.8rem' }}>Click to upload cover image</span></>}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
              </label>
            )}
          </div>

          {/* SEO */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>SEO Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Meta Title</label>
                <input value={meta.metaTitle} onChange={e => setMeta(m => ({ ...m, metaTitle: e.target.value }))} placeholder="Defaults to tutorial title" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Meta Description</label>
                <textarea value={meta.metaDescription} onChange={e => setMeta(m => ({ ...m, metaDescription: e.target.value }))} rows={2} placeholder="SEO description (150-160 chars)" style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Meta Keywords</label>
                <input value={meta.metaKeywords} onChange={e => setMeta(m => ({ ...m, metaKeywords: e.target.value }))} placeholder="keyword1, keyword2, …" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pages editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Page tabs */}
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Pages ({pages.length})</h2>
              <button onClick={addPage} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', background: '#f0fdf4', color: '#16a34a', border: '1.5px solid #bbf7d0', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' }}>
                <Plus size={14} /> Add Page
              </button>
            </div>
            <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
              {pages.map((pg, i) => (
                <button key={i} onClick={() => setActivePage(i)}
                  style={{ padding: '0.55rem 1rem', border: 'none', borderBottom: `2px solid ${activePage === i ? '#16a34a' : 'transparent'}`, background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: activePage === i ? 700 : 400, color: activePage === i ? '#16a34a' : '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {i + 1}. {pg.title || 'Untitled'}
                </button>
              ))}
            </div>

            {/* Active page editor */}
            {pages[activePage] && (
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Page Title *</label>
                    <input value={pages[activePage].title} onChange={e => updatePage(activePage, 'title', e.target.value)} placeholder="e.g. Introduction & Overview" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1.4rem', flexShrink: 0 }}>
                    <button onClick={() => movePage(activePage, -1)} disabled={activePage === 0} title="Move up" style={{ padding: '0.4rem', border: '1.5px solid #e2e8f0', borderRadius: 5, background: 'white', cursor: 'pointer', color: '#6b7280', display: 'flex' }}><ChevronUp size={15} /></button>
                    <button onClick={() => movePage(activePage, 1)} disabled={activePage === pages.length - 1} title="Move down" style={{ padding: '0.4rem', border: '1.5px solid #e2e8f0', borderRadius: 5, background: 'white', cursor: 'pointer', color: '#6b7280', display: 'flex' }}><ChevronDown size={15} /></button>
                    <button onClick={() => removePage(activePage)} title="Delete page" style={{ padding: '0.4rem', border: '1.5px solid #fecaca', borderRadius: 5, background: '#fef2f2', cursor: 'pointer', color: '#dc2626', display: 'flex' }}><Trash2 size={15} /></button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Content *</label>
                  <RichTextEditor
                    key={`new-page-${activePage}`}
                    content={pages[activePage].content}
                    onChange={val => updatePage(activePage, 'content', val)}
                    placeholder="Write your tutorial content here…"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Page Meta Description</label>
                  <input value={pages[activePage].metaDescription} onChange={e => updatePage(activePage, 'metaDescription', e.target.value)} placeholder="Optional SEO description for this page" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                {/* Quiz builder */}
                <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '0.75rem 1rem', background: '#fafbfc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Quiz (Optional)</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#6b7280' }}>
                      <input type="checkbox" checked={pages[activePage].quiz?.enabled} onChange={e => updateQuiz(activePage, 'enabled', e.target.checked)} />
                      Enable quiz for this page
                    </label>
                  </div>

                  {pages[activePage].quiz?.enabled && (
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {pages[activePage].quiz.questions.map((q, qi) => (
                        <div key={qi} style={{ padding: '1rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', position: 'relative' }}>
                          <button onClick={() => removeQuestion(activePage, qi)} style={{ position: 'absolute', top: 8, right: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer', color: '#dc2626', padding: '0.2rem 0.35rem', display: 'flex' }}><X size={12} /></button>
                          <p style={{ fontSize: '0.775rem', fontWeight: 700, color: '#374151', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Question {qi + 1}</p>
                          <input value={q.question} onChange={e => updateQuestion(activePage, qi, 'question', e.target.value)} placeholder="Enter your question" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
                          {q.options.map((opt, oi) => (
                            <div key={oi} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                              <input type="radio" name={`correct-${activePage}-${qi}`} checked={q.correctOption === oi} onChange={() => updateQuestion(activePage, qi, 'correctOption', oi)} />
                              <input value={opt} onChange={e => updateOption(activePage, qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} style={{ ...inputStyle, flex: 1 }} />
                            </div>
                          ))}
                          <input value={q.explanation} onChange={e => updateQuestion(activePage, qi, 'explanation', e.target.value)} placeholder="Explanation (shown after answering)" style={{ ...inputStyle, marginTop: '0.25rem', fontSize: '0.8rem', background: '#f0fdf4' }} />
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
      </div>
      <style>{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @media(max-width:900px){div[style*="grid-template-columns: 1fr 1.4fr"]{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
