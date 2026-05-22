import Link from 'next/link';
import NewsletterForm from '@/components/ui/NewsletterForm';
import { BookOpen, Users, Globe, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Engineering Tutorials — our mission to make quality engineering education free and accessible to everyone.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%)', color: 'white', padding: '5rem 1.25rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, background: '#16a34a', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <BookOpen size={30} color="white" />
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2 }}>
            Free Engineering Education<br />for Everyone
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
            Engineering Tutorials was built with a simple belief: high-quality engineering education should not be locked behind expensive textbooks or paywalls. Our platform provides structured, expert-written tutorials across all engineering disciplines — completely free.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '4rem 1.25rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { icon: <BookOpen size={22} />, label: 'Free Tutorials', value: '100%', desc: 'All content is free, always' },
              { icon: <Globe size={22} />, label: 'Disciplines', value: '10+', desc: 'Engineering fields covered' },
              { icon: <Users size={22} />, label: 'Community', value: 'Growing', desc: 'Engineers learning daily' },
              { icon: <Award size={22} />, label: 'Quizzes', value: 'Every page', desc: 'Test your knowledge' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: 10, border: '1.5px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ color: '#16a34a', display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>{stat.icon}</div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 0.2rem' }}>{stat.value}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: '0 0 0.2rem' }}>{stat.label}</p>
                <p style={{ fontSize: '0.775rem', color: '#9ca3af', margin: 0 }}>{stat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>Our Mission</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.9, margin: '0 0 1rem' }}>
              Engineering is the backbone of modern civilisation — from the bridges we cross to the circuits in our phones. Yet quality engineering education remains inaccessible to millions of students and professionals who cannot afford premium courses or university resources.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.9, margin: '0 0 1rem' }}>
              Engineering Tutorials bridges that gap. We work with experienced engineers and educators to produce structured, technically accurate tutorials that anyone can access for free — with progress tracking, interactive quizzes, and a clean reading experience designed for deep learning.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.9, margin: '0 0 2rem' }}>
              Whether you're a student preparing for exams, a professional refreshing your knowledge, or a curious learner exploring a new field — Engineering Tutorials is built for you.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>Want to Contribute?</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.9, margin: '0 0 1rem' }}>
              We welcome expert authors across all engineering disciplines. If you have domain expertise and want to help other engineers learn, we'd love to hear from you.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ padding: '0.7rem 1.5rem', background: '#16a34a', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                Become an Author
              </Link>
              <Link href="/tutorials" style={{ padding: '0.7rem 1.5rem', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
                Browse Tutorials
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ background: '#f0fdf4', borderTop: '1px solid #bbf7d0', padding: '3.5rem 1.25rem' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>Stay in the Loop</h2>
          <p style={{ color: '#6b7280', margin: '0 0 1.5rem' }}>Get new tutorials and engineering insights delivered to your inbox.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
