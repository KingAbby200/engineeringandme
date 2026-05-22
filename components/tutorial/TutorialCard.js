'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, BarChart2, User } from 'lucide-react';

const DIFFICULTY_COLORS = {
  beginner: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  intermediate: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  advanced: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
};

export default function TutorialCard({ tutorial, categorySlug }) {
  const diff = DIFFICULTY_COLORS[tutorial.difficulty] || DIFFICULTY_COLORS.beginner;
  const href = `/tutorials/${categorySlug || tutorial.category?.slug}/${tutorial.slug}`;

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{ border: '1.5px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: 'white', transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#16a34a'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
        {/* Cover image */}
        <div style={{ height: 160, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', position: 'relative', overflow: 'hidden' }}>
          {tutorial.coverImage ? (
            <Image src={tutorial.coverImage} alt={tutorial.title} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <BookOpen size={48} color="#16a34a" style={{ opacity: 0.3 }} />
            </div>
          )}
          {/* Category badge */}
          {tutorial.category && (
            <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.95)', borderRadius: 6, padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: 600, color: '#16a34a', border: '1px solid #bbf7d0' }}>
              {tutorial.category.name}
            </div>
          )}
        </div>

        <div style={{ padding: '1rem' }}>
          {/* Difficulty */}
          <span style={{ fontSize: '0.7rem', fontWeight: 600, background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, borderRadius: 4, padding: '0.15rem 0.4rem', textTransform: 'capitalize' }}>
            {tutorial.difficulty}
          </span>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: '0.6rem 0 0.4rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {tutorial.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {tutorial.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', borderTop: '1px solid #f3f4f6', paddingTop: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <BookOpen size={12} />
              <span>{tutorial.totalPages || 0} pages</span>
            </div>
            {tutorial.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={12} />
                <span>{tutorial.author.name?.split(' ')[0]}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
