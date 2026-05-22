'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader, Save, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const ICONS = ['⚡', '🏗️', '⚙️', '💻', '🧪', '🛢️', '✈️', '🏛️', '🫀', '🌿', '🔬', '🌊', '🔋', '📡', '🔩'];
const COLORS = ['#16a34a', '#2563eb', '#dc2626', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#059669', '#64748b', '#0f172a'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '⚙️', color: '#16a34a', order: 0 });
  const [submitting, setSubmitting] = useState(false);

  const fetchCats = async () => {
    setLoading(true);
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (res.ok) setCategories(data.categories || []);
    setLoading(false);
  };

  useEffect(() => { fetchCats(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', icon: '⚙️', color: '#16a34a', order: categories.length }); setShowForm(true); };
  const openEdit = (cat) => { setEditing(cat._id); setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '⚙️', color: cat.color || '#16a34a', order: cat.order || 0 }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editing ? `/api/categories/${editing}` : '/api/categories';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { toast.success(editing ? 'Category updated!' : 'Category created!'); setShowForm(false); setEditing(null); fetchCats(); }
      else toast.error(data.error);
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Tutorials in it will lose their category.')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Category deleted'); fetchCats(); }
    else toast.error('Delete failed');
  };

  const inputStyle = { width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid #e5e7eb', borderRadius: 7, fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Categories</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Manage engineering discipline categories</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Seed defaults button */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.825rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span>💡 <strong>Tip:</strong> Add all engineering disciplines here. They'll appear as navigation filters throughout the site.</span>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{editing ? 'Edit Category' : 'New Category'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Category Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Electrical Engineering" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this discipline…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {ICONS.map(ic => (
                  <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                    style={{ fontSize: '1.4rem', padding: '0.3rem', borderRadius: 6, border: `2px solid ${form.icon === ic ? '#16a34a' : 'transparent'}`, background: form.icon === ic ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Accent Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? '#111827' : 'transparent'}`, cursor: 'pointer' }} />
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" disabled={submitting} style={{ padding: '0.6rem 1.5rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 7, cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                {editing ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading…</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: 10, border: '1.5px dashed #e5e7eb' }}>
          <FolderOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ color: '#6b7280', margin: 0 }}>No categories yet. Add engineering disciplines above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {categories.map(cat => (
            <div key={cat._id} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${cat.color}18`, border: `2px solid ${cat.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{cat.icon || '⚙️'}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 0.15rem' }}>{cat.name}</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>/tutorials/{cat.slug} · {cat.tutorialCount || 0} tutorials · Order: {cat.order}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(cat)} style={{ padding: '0.4rem 0.75rem', border: '1.5px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', color: '#374151', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'inherit' }}>
                  <Edit2 size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(cat._id)} style={{ padding: '0.4rem 0.75rem', border: '1.5px solid #fecaca', borderRadius: 6, background: '#fef2f2', cursor: 'pointer', color: '#dc2626', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'inherit' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
