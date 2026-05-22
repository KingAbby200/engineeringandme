import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import TutorialCard from '@/components/tutorial/TutorialCard';
import { Search } from 'lucide-react';

export function generateMetadata({ searchParams }) {
  const q = searchParams?.q || '';
  return { title: q ? `Search: "${q}"` : 'Search Tutorials', description: `Search results for engineering tutorials` };
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q?.trim() || '';
  const page = parseInt(sp?.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  let tutorials = [], total = 0, totalPages = 0;

  if (q) {
    await connectDB();
    const query = { status: 'approved', $text: { $search: q } };
    [tutorials, total] = await Promise.all([
      Tutorial.find(query, { score: { $meta: 'textScore' } })
        .populate('category', 'name slug color icon')
        .populate('author', 'name')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip).limit(limit).lean(),
      Tutorial.countDocuments(query),
    ]);
    totalPages = Math.ceil(total / limit);
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Search size={24} color="#16a34a" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            {q ? `Results for "${q}"` : 'Search Tutorials'}
          </h1>
        </div>
        {q && <p style={{ color: '#6b7280', margin: 0 }}>{total} result{total !== 1 ? 's' : ''} found</p>}
      </div>

      {!q ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9fafb', borderRadius: 12, border: '1.5px dashed #e5e7eb' }}>
          <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ color: '#6b7280', margin: 0 }}>Use the search bar above to find tutorials</p>
        </div>
      ) : tutorials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9fafb', borderRadius: 12, border: '1.5px dashed #e5e7eb' }}>
          <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p style={{ color: '#374151', fontWeight: 600, margin: '0 0 0.5rem' }}>No results for "{q}"</p>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>Try different keywords or browse tutorials by category</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {tutorials.map(t => <TutorialCard key={t._id} tutorial={t} categorySlug={t.category?.slug} />)}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {page > 1 && <a href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`} style={{ padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 6, textDecoration: 'none', color: '#374151', fontSize: '0.875rem' }}>← Prev</a>}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(pg => (
                <a key={pg} href={`/search?q=${encodeURIComponent(q)}&page=${pg}`}
                  style={{ padding: '0.5rem 0.85rem', border: `1.5px solid ${pg === page ? '#16a34a' : '#e5e7eb'}`, borderRadius: 6, textDecoration: 'none', color: pg === page ? 'white' : '#374151', background: pg === page ? '#16a34a' : 'white', fontSize: '0.875rem', fontWeight: pg === page ? 700 : 400 }}>
                  {pg}
                </a>
              ))}
              {page < totalPages && <a href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`} style={{ padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 6, textDecoration: 'none', color: '#374151', fontSize: '0.875rem' }}>Next →</a>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
