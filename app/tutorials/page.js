import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import Category from '@/lib/models/Category';
import TutorialCard from '@/components/tutorial/TutorialCard';
import Link from 'next/link';
import { BookOpen, Search } from 'lucide-react';

export const metadata = {
  title: 'All Engineering Tutorials',
  description: 'Browse all free engineering tutorials across Electrical, Civil, Mechanical, Computer, Chemical Engineering and more.',
};

async function getData(page = 1, categorySlug = '', difficulty = '') {
  await connectDB();
  const limit = 12;
  const skip = (page - 1) * limit;

  let categoryId;
  if (categorySlug) {
    const cat = await Category.findOne({ slug: categorySlug });
    categoryId = cat?._id;
  }

  const query = { status: 'approved' };
  if (categoryId) query.category = categoryId;
  if (difficulty) query.difficulty = difficulty;

  const [tutorials, total, categories] = await Promise.all([
    Tutorial.find(query)
      .populate('category', 'name slug color icon')
      .populate('author', 'name')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Tutorial.countDocuments(query),
    Category.find({ isActive: true }).sort({ order: 1 }).lean(),
  ]);

  return { tutorials, total, totalPages: Math.ceil(total / limit), categories };
}

export default async function TutorialsPage({ searchParams }) {
  const sp = await searchParams;
  const page = parseInt(sp?.page || '1');
  const categorySlug = sp?.category || '';
  const difficulty = sp?.difficulty || '';

  const { tutorials, total, totalPages, categories } = await getData(page, categorySlug, difficulty);

  const buildUrl = (overrides) => {
    const p = { page: page.toString(), ...(categorySlug && { category: categorySlug }), ...(difficulty && { difficulty }), ...overrides };
    const qs = new URLSearchParams(p).toString();
    return `/tutorials?${qs}`;
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem' }}>Engineering Tutorials</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>{total} tutorial{total !== 1 ? 's' : ''} available across all disciplines</p>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>Filter by:</span>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Link href={buildUrl({ category: '', page: '1' })}
            style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', background: !categorySlug ? '#16a34a' : 'white', color: !categorySlug ? 'white' : '#6b7280', border: `1.5px solid ${!categorySlug ? '#16a34a' : '#e5e7eb'}` }}>
            All
          </Link>
          {categories.map(cat => (
            <Link key={cat._id} href={buildUrl({ category: cat.slug, page: '1' })}
              style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', background: categorySlug === cat.slug ? '#16a34a' : 'white', color: categorySlug === cat.slug ? 'white' : '#6b7280', border: `1.5px solid ${categorySlug === cat.slug ? '#16a34a' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{cat.icon}</span> {cat.name}
            </Link>
          ))}
        </div>

        <div style={{ width: 1, background: '#e5e7eb', alignSelf: 'stretch', margin: '0 0.25rem' }} />

        {/* Difficulty filter */}
        {['', 'beginner', 'intermediate', 'advanced'].map(d => (
          <Link key={d} href={buildUrl({ difficulty: d, page: '1' })}
            style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', background: difficulty === d ? '#0f172a' : 'white', color: difficulty === d ? 'white' : '#6b7280', border: `1.5px solid ${difficulty === d ? '#0f172a' : '#e5e7eb'}`, textTransform: 'capitalize' }}>
            {d || 'Any Level'}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {tutorials.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {tutorials.map(t => <TutorialCard key={t._id} tutorial={t} categorySlug={t.category?.slug} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9fafb', borderRadius: 12, border: '1.5px dashed #e5e7eb' }}>
          <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ color: '#6b7280', fontSize: '1rem', margin: '0 0 0.5rem', fontWeight: 500 }}>No tutorials found</p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Try adjusting your filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })}
              style={{ padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 6, textDecoration: 'none', color: '#374151', fontSize: '0.875rem' }}>← Prev</Link>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
            return (
              <Link key={pg} href={buildUrl({ page: String(pg) })}
                style={{ padding: '0.5rem 0.85rem', border: `1.5px solid ${pg === page ? '#16a34a' : '#e5e7eb'}`, borderRadius: 6, textDecoration: 'none', color: pg === page ? 'white' : '#374151', background: pg === page ? '#16a34a' : 'white', fontSize: '0.875rem', fontWeight: pg === page ? 700 : 400 }}>
                {pg}
              </Link>
            );
          })}
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })}
              style={{ padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 6, textDecoration: 'none', color: '#374151', fontSize: '0.875rem' }}>Next →</Link>
          )}
        </div>
      )}
    </div>
  );
}
