'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { User, Flame, Trophy, BookOpen, CheckCircle, Edit2, Save, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=16a34a',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=3b82f6',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Liam&backgroundColor=8b5cf6',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe&backgroundColor=f59e0b',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max&backgroundColor=ec4899',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Nora&backgroundColor=06b6d4',
];

const COURSES = {
  electrical: 'Electrical & Electronics', civil: 'Civil', mechanical: 'Mechanical',
  computer: 'Computer', chemical: 'Chemical', petroleum: 'Petroleum',
  aerospace: 'Aerospace', structural: 'Structural', biomedical: 'Biomedical', environmental: 'Environmental',
};

export default function ProfilePage() {
  const { user, fetchUser, setUser } = useAuthStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('progress');

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', bio: user.bio || '', avatar: user.avatar || '' });
    if (!user && !loading) { /* wait for fetchUser */ }
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Please log in to view your profile.</p>
        <Link href="/login" style={{ padding: '0.6rem 1.5rem', background: '#16a34a', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Login</Link>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setEditing(false);
        setShowAvatarPicker(false);
        toast.success('Profile updated!');
      } else toast.error(data.error);
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const avatarUrl = (editing ? form.avatar : user.avatar) ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'U')}&backgroundColor=16a34a`;

  const completed = user.progress?.filter(p => p.percentComplete >= 100) || [];
  const inProgress = user.progress?.filter(p => p.percentComplete > 0 && p.percentComplete < 100) || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      {/* Profile header */}
      <div style={{ background: 'white', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={avatarUrl} alt={user.name} width={96} height={96} style={{ borderRadius: '50%', border: '3px solid #16a34a', objectFit: 'cover' }} />
          {editing && (
            <button onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, background: '#16a34a', color: 'white', border: '2px solid white', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={14} />
            </button>
          )}
        </div>

        {/* Avatar picker */}
        {showAvatarPicker && editing && (
          <div style={{ position: 'absolute', zIndex: 20, background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {AVATARS.map(av => (
              <button key={av} type="button" onClick={() => { setForm(f => ({ ...f, avatar: av })); setShowAvatarPicker(false); }}
                style={{ padding: 4, borderRadius: 8, border: `2px solid ${form.avatar === av ? '#16a34a' : 'transparent'}`, cursor: 'pointer', background: 'none' }}>
                <img src={av} alt="avatar" width={56} height={56} style={{ borderRadius: '50%' }} />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                style={{ padding: '0.5rem 0.75rem', border: '1.5px solid #16a34a', borderRadius: 6, fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} />
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..."
                rows={3} style={{ padding: '0.5rem 0.75rem', border: '1.5px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} />
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>{user.name}</h1>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{user.email}</p>
              {user.bio && <p style={{ color: '#4b5563', fontSize: '0.9rem', margin: '0 0 0.5rem', lineHeight: 1.6 }}>{user.bio}</p>}
              <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.2rem 0.6rem', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize' }}>
                {user.role} · {COURSES[user.courseOfInterest] || user.courseOfInterest}
              </span>
            </>
          )}
        </div>

        {/* Edit button */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {editing ? (
            <>
              <button onClick={handleSave} disabled={loading} style={{ padding: '0.5rem 1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit' }}>
                <Save size={15} /> {loading ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} style={{ padding: '0.5rem 0.75rem', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6b7280', fontSize: '0.875rem', fontFamily: 'inherit' }}>
                <X size={15} /> Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={{ padding: '0.5rem 1rem', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#374151', fontFamily: 'inherit' }}>
              <Edit2 size={15} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: <Flame size={20} />, label: 'Day Streak', value: user.streak?.current || 0, color: '#f59e0b' },
          { icon: <Trophy size={20} />, label: 'Longest Streak', value: user.streak?.longest || 0, color: '#8b5cf6' },
          { icon: <BookOpen size={20} />, label: 'In Progress', value: inProgress.length, color: '#3b82f6' },
          { icon: <CheckCircle size={20} />, label: 'Completed', value: completed.length, color: '#16a34a' },
          { icon: <User size={20} />, label: 'Quizzes Taken', value: user.quizResults?.length || 0, color: '#ec4899' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#111827', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0.15rem 0 0' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem', display: 'flex', gap: '0' }}>
        {[['progress', 'Learning Progress'], ['quiz', 'Quiz Results']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '0.75rem 1.25rem', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === key ? '#16a34a' : 'transparent'}`, marginBottom: '-2px', color: activeTab === key ? '#16a34a' : '#6b7280', fontWeight: activeTab === key ? 700 : 400, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit', transition: 'color 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Progress tab */}
      {activeTab === 'progress' && (
        <div>
          {user.progress?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: 10, border: '1.5px dashed #e5e7eb' }}>
              <BookOpen size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ color: '#6b7280', margin: 0 }}>No tutorials started yet. <Link href="/tutorials" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>Browse tutorials →</Link></p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.progress?.map(p => (
                <div key={p._id} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>{p.tutorial?.title || 'Tutorial'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                      <span>{p.pagesCompleted?.length || 0} pages completed</span>
                      <span style={{ fontWeight: 700, color: p.percentComplete >= 100 ? '#16a34a' : '#374151' }}>{p.percentComplete || 0}%</span>
                    </div>
                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${p.percentComplete || 0}%`, height: '100%', background: p.percentComplete >= 100 ? '#16a34a' : 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {p.percentComplete >= 100 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, background: '#f0fdf4', padding: '0.3rem 0.75rem', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                        <CheckCircle size={14} /> Completed
                      </span>
                    ) : p.lastPage && p.tutorial?.slug ? (
                      <Link href={`/tutorials/${p.tutorial.slug}/${p.lastPage.slug}`}
                        style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600, background: '#16a34a', padding: '0.3rem 0.75rem', borderRadius: 20, textDecoration: 'none' }}>
                        Continue →
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quiz results tab */}
      {activeTab === 'quiz' && (
        <div>
          {user.quizResults?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: 10, border: '1.5px dashed #e5e7eb' }}>
              <Trophy size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ color: '#6b7280', margin: 0 }}>No quizzes taken yet. Complete a tutorial page to find a quiz!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {user.quizResults?.slice().reverse().map((r, i) => {
                const pct = Math.round((r.score / r.total) * 100);
                return (
                  <div key={i} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: pct >= 70 ? '#f0fdf4' : '#fef2f2', border: `2px solid ${pct >= 70 ? '#16a34a' : '#dc2626'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: pct >= 70 ? '#16a34a' : '#dc2626' }}>{pct}%</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0 0 0.2rem' }}>
                        {r.score}/{r.total} correct · {pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : 'Needs review'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{new Date(r.takenAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
