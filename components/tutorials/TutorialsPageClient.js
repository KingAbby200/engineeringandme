'use client';
import Link from 'next/link';
import { BookOpen, Layers } from 'lucide-react';
import TutorialCard from '@/components/tutorial/TutorialCard';
import { useLanguageStore, getTranslation } from '@/lib/store/languageStore';

export default function TutorialsPageClient({ tutorials, total, totalPages, categories, page = 1, categorySlug = '', difficulty = '' }) {
  const language = useLanguageStore(state => state.language);
  const t = (key) => getTranslation(language, key);

  // Build URL function on client side
  const buildUrl = (overrides) => {
    const p = { page: (page || 1).toString(), ...(categorySlug && { category: categorySlug }), ...(difficulty && { difficulty }), ...overrides };
    const qs = new URLSearchParams(p).toString();
    return `/tutorials?${qs}`;
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>{t('allTutorials')}</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{total} {t('tutorials')} {total !== 1 ? 'available' : 'available'} across all disciplines</p>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{t('filterBy')}</span>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Link href={buildUrl({ category: '', page: '1' })}
            style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', background: !categorySlug ? '#16a34a' : 'var(--bg-primary)', color: !categorySlug ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${!categorySlug ? '#16a34a' : 'var(--border)'}` }}>
            {t('all')}
          </Link>
          {categories.map(cat => (
            <Link key={cat._id} href={buildUrl({ category: cat.slug, page: '1' })}
              style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', background: categorySlug === cat.slug ? '#16a34a' : 'var(--bg-primary)', color: categorySlug === cat.slug ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${categorySlug === cat.slug ? '#16a34a' : 'var(--border)'}`, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Layers size={14} color={cat.color || '#16a34a'} /> {cat.name}</span>
            </Link>
          ))}
        </div>

        <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', margin: '0 0.25rem' }} />

        {/* Difficulty filter */}
        {['', 'beginner', 'intermediate', 'advanced'].map(d => (
          <Link key={d} href={buildUrl({ difficulty: d, page: '1' })}
            style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', background: difficulty === d ? '#0f172a' : 'var(--bg-primary)', color: difficulty === d ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${difficulty === d ? '#0f172a' : 'var(--border)'}`, textTransform: 'capitalize' }}>
            {d || t('allLevels')}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {tutorials.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {tutorials.map(t => <TutorialCard key={t._id} tutorial={t} categorySlug={t.category?.slug} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-secondary)', borderRadius: 12, border: '1.5px dashed var(--border)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 0.5rem', fontWeight: 500 }}>{t('noTutorials')}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{t('tryAdjusting')}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })}
              style={{ padding: '0.5rem 1rem', border: '1.5px solid var(--border)', borderRadius: 6, textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('prev')}</Link>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
            return (
              <Link key={pg} href={buildUrl({ page: String(pg) })}
                style={{ padding: '0.5rem 0.85rem', border: `1.5px solid ${pg === page ? '#16a34a' : 'var(--border)'}`, borderRadius: 6, textDecoration: 'none', color: pg === page ? 'white' : 'var(--text-secondary)', background: pg === page ? '#16a34a' : 'var(--bg-primary)', fontSize: '0.875rem', fontWeight: pg === page ? 700 : 400 }}>
                {pg}
              </Link>
            );
          })}
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })}
              style={{ padding: '0.5rem 1rem', border: '1.5px solid var(--border)', borderRadius: 6, textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('next')}</Link>
          )}
        </div>
      )}
    </div>
  );
}
