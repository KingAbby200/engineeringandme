import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import Category from '@/lib/models/Category';
import TutorialCard from '@/components/tutorial/TutorialCard';
import NewsletterForm from '@/components/ui/NewsletterForm';
import AdUnit from '@/components/ui/AdUnit';
import CategoryCard from '@/components/ui/CategoryCard';
import { BookOpen, Zap, Trophy, Users, ArrowRight, CheckCircle } from 'lucide-react';

async function getData() {
  try {
    await connectDB();
    const [categories, featured, recent] = await Promise.all([
      Category.find({ isActive: true }).sort({ order: 1 }).limit(10),
      Tutorial.find({ status: 'approved', featured: true }).populate('category', 'name slug').populate('author', 'name').limit(6),
      Tutorial.find({ status: 'approved' }).populate('category', 'name slug').populate('author', 'name').sort({ createdAt: -1 }).limit(8),
    ]);
    return { categories, featured, recent };
  } catch { return { categories: [], featured: [], recent: [] }; }
}

export default async function HomePage() {
  const { categories, featured, recent } = await getData();

  const allTutorials = featured.length >= 4 ? featured : recent;

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a2f 50%, #0f172a 100%)', color: 'white', padding: '5rem 1.25rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(22,163,74,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.1) 0%, transparent 40%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 20, padding: '0.3rem 0.9rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#4ade80' }}>
            <Zap size={13} /> Free Engineering Education Platform
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 1.25rem', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Master Engineering Concepts<br />
            <span style={{ color: '#22c55e' }}>One Tutorial at a Time</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#94a3b8', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Structured, in-depth tutorials across all engineering disciplines. From circuit theory to structural analysis — learn at your own pace, track your progress, test your knowledge.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tutorials" style={{ padding: '0.85rem 2rem', background: '#16a34a', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', transition: 'background 0.15s', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Browse Tutorials <ArrowRight size={18} />
            </Link>
            <Link href="/signup" style={{ padding: '0.85rem 2rem', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
              Create Free Account
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
            {[['Free Forever', CheckCircle], ['Quiz System', Trophy], ['Progress Tracking', BookOpen], ['All Disciplines', Zap]].map(([label, Icon]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                <Icon size={16} color="#22c55e" /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '3.5rem 1.25rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>Engineering Disciplines</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Choose your field and start learning today</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {categories.map(cat => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
            {categories.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                Categories will appear here once configured by admin.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ad banner */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <AdUnit slot="1234567890" format="horizontal" style={{ marginTop: '1rem' }} />
      </div>

      {/* Featured / Recent tutorials */}
      <section style={{ padding: '3.5rem 1.25rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>
                {featured.length ? 'Featured Tutorials' : 'Latest Tutorials'}
              </h2>
              <p style={{ color: '#6b7280', margin: 0 }}>Carefully curated engineering content</p>
            </div>
            <Link href="/tutorials" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {allTutorials.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {allTutorials.map(t => <TutorialCard key={t._id} tutorial={t} categorySlug={t.category?.slug} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af', background: '#f9fafb', borderRadius: 12, border: '1.5px dashed #e5e7eb' }}>
              <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 0.5rem', color: '#6b7280' }}>No tutorials yet</p>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Tutorials will appear here once published by authors.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why section */}
      <section style={{ padding: '3.5rem 1.25rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem', textAlign: 'center' }}>Why Engineering Tutorials?</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', margin: '0 0 2.5rem' }}>Built for serious engineering learners</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '📚', title: 'Structured Learning', desc: 'Organized tutorials with clear progression from basic to advanced concepts.' },
              { icon: '🏆', title: 'Knowledge Quizzes', desc: 'Test your understanding at the end of each tutorial page with interactive quizzes.' },
              { icon: '📊', title: 'Progress Tracking', desc: 'Track your learning journey with detailed progress reports and completion stats.' },
              { icon: '🔥', title: 'Daily Streaks', desc: 'Build consistent habits with daily login streaks and learning momentum.' },
              { icon: '🌍', title: 'All Disciplines', desc: 'Coverage across Electrical, Civil, Mechanical, Chemical, Computer Engineering and more.' },
              { icon: '🆓', title: 'Completely Free', desc: 'All tutorials are free. No paywalls, no subscriptions, no hidden fees — ever.' },
            ].map(item => (
              <div key={item.title} style={{ padding: '1.5rem', background: 'white', borderRadius: 10, border: '1.5px solid #e5e7eb' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 0.4rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '4rem 1.25rem', background: 'linear-gradient(135deg, #0f172a, #1e3a2f)', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Stay Updated</h2>
          <p style={{ color: '#94a3b8', margin: '0 0 2rem', lineHeight: 1.7 }}>
            Get the latest engineering tutorials, tips, and resources delivered to your inbox. Join thousands of engineers learning every week.
          </p>
          <NewsletterForm dark />
        </div>
      </section>
    </>
  );
}
