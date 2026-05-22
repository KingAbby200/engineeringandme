'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Clock, CheckCircle, FolderOpen, ArrowRight, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: '#9ca3af', textAlign: 'center' }}>Loading dashboard…</div>;

  const s = stats?.stats || {};

  const cards = [
    { label: 'Total Tutorials', value: s.totalTutorials || 0, icon: <BookOpen size={20} />, color: '#3b82f6', href: '/admin/tutorials' },
    { label: 'Pending Review', value: s.pending || 0, icon: <Clock size={20} />, color: '#f59e0b', href: '/admin/pending' },
    { label: 'Published', value: s.approved || 0, icon: <CheckCircle size={20} />, color: '#16a34a', href: '/admin/tutorials' },
    { label: 'Students', value: s.totalUsers || 0, icon: <Users size={20} />, color: '#8b5cf6', href: '/admin/authors' },
    { label: 'Authors', value: s.totalAuthors || 0, icon: <Users size={20} />, color: '#ec4899', href: '/admin/authors' },
    { label: 'Categories', value: s.totalCategories || 0, icon: <FolderOpen size={20} />, color: '#06b6d4', href: '/admin/categories' },
  ];

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Dashboard Overview</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Welcome back, Admin.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.25rem', transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>{card.icon}</div>
                <ArrowRight size={14} color="#cbd5e1" />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.15rem', lineHeight: 1 }}>{card.value}</p>
              <p style={{ fontSize: '0.775rem', color: '#64748b', margin: 0 }}>{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending tutorials */}
      <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Latest Pending Tutorials</h2>
          <Link href="/admin/pending" style={{ fontSize: '0.8rem', color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
        </div>
        {stats?.recentTutorials?.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>No pending tutorials — you're all caught up! ✓</div>
        ) : (
          <div>
            {stats?.recentTutorials?.map(t => (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid #f8fafc', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#0f172a', margin: '0 0 0.15rem', fontSize: '0.9rem' }}>{t.title}</p>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.775rem' }}>by {t.author?.name} · {t.category?.name} · {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>Pending</span>
                <Link href="/admin/pending" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>
                  <Eye size={14} /> Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
