'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { BookOpen, Flame, Trophy, Clock, ArrowRight, Play, CheckCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, fetchUser } = useAuthStore();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser().then(() => {
      fetch('/api/tutorials?status=approved&limit=6')
        .then(r => r.json())
        .then(d => setRecommended(d.tutorials || []))
        .finally(() => setLoading(false));
    });
  }, []);

  if (!user && !loading) {
    router.push('/login');
    return null;
  }

  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'U')}&backgroundColor=16a34a`;
  const inProgress = user?.progress?.filter(p => p.percentComplete > 0 && p.percentComplete < 100) || [];
  const completed = user?.progress?.filter(p => p.percentComplete >= 100) || [];

  const StatCard = ({ icon, label, value, color }) => (
    <div style={{ padding: '1.25rem', background: 'white', borderRadius: 10, border: '1.5px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.15rem 0 0' }}>{label}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      {/* Welcome header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <Image src={avatarUrl} alt={user?.name || ''} width={64} height={64} style={{ borderRadius: '50%', border: '3px solid #16a34a', objectFit: 'cover' }} />
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            {user?.streak?.current > 0 ? `🔥 ${user.streak.current}-day streak! Keep it up!` : "Start learning today to build your streak!"}
          </p>
        </div>
        {user?.streak?.current >= 3 && (
          <div className="streak-pulse" style={{ marginLeft: 'auto', padding: '0.5rem 1rem', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 20, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>
            <Flame size={16} /> {user.streak.current} Day Streak
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard icon={<Flame size={20} />} label="Current Streak" value={user?.streak?.current || 0} color="#f59e0b" />
        <StatCard icon={<BookOpen size={20} />} label="In Progress" value={inProgress.length} color="#3b82f6" />
        <StatCard icon={<CheckCircle size={20} />} label="Completed" value={completed.length} color="#16a34a" />
        <StatCard icon={<Trophy size={20} />} label="Longest Streak" value={user?.streak?.longest || 0} color="#8b5cf6" />
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#16a34a" /> Continue Learning
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {inProgress.slice(0, 3).map(p => (
              <div key={p.tutorial?._id} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: '0 0 0.75rem', lineHeight: 1.4 }}>{p.tutorial?.title}</h3>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.3rem' }}>
                    <span>Progress</span><span style={{ fontWeight: 600, color: '#16a34a' }}>{p.percentComplete}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${p.percentComplete}%`, height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: 3 }} />
                  </div>
                </div>
                {p.lastPage && (
                  <Link href={`/tutorials/${p.tutorial?.slug}/${p.lastPage?.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                    <Play size={14} /> Continue from "{p.lastPage?.title}"
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="#16a34a" /> Recommended for You
          </h2>
          <Link href="/tutorials" style={{ fontSize: '0.875rem', color: '#16a34a', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Browse all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>Loading tutorials...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {recommended.map(t => (
              <Link key={t._id} href={`/tutorials/${t.category?.slug}/${t.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '1.25rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{t.category?.name}</div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', margin: '0 0 0.4rem', lineHeight: 1.4 }}>{t.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                    <BookOpen size={12} /> {t.totalPages} pages
                    <span style={{ marginLeft: '0.5rem', textTransform: 'capitalize', background: '#f0fdf4', color: '#16a34a', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600 }}>{t.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
