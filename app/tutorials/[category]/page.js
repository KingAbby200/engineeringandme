import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import Category from '@/lib/models/Category';
import TutorialCard from '@/components/tutorial/TutorialCard';
//import AdUnit from '@/components/ui/AdUnit';
import AdsterraNative from '@/components/ui/AdsterraNative';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, Filter, Layers } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { category } = await params;
  try {
    await connectDB();
    const cat = await Category.findOne({ slug: category });
    if (!cat) return { title: 'Tutorials' };
    return {
      title: `${cat.name} Tutorials`,
      description: `Free ${cat.name} tutorials covering all key topics and concepts. Learn step by step with quizzes and progress tracking.`,
      openGraph: { title: `${cat.name} Tutorials | Engineering Tutorials`, description: cat.description || `Free ${cat.name} tutorials` },
    };
  } catch { return { title: 'Tutorials' }; }
}

async function getData(categorySlug, page = 1, difficulty = '') {
  await connectDB();
  const cat = await Category.findOne({ slug: categorySlug });
  if (!cat) return null;

  const query = { status: 'approved', category: cat._id };
  if (difficulty) query.difficulty = difficulty;

  const limit = 12;
  const skip = (page - 1) * limit;
  const [tutorials, total, allCats] = await Promise.all([
    Tutorial.find(query).populate('author', 'name').sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Tutorial.countDocuments(query),
    Category.find({ isActive: true }).sort({ order: 1 }).lean(),
  ]);

  return { cat, tutorials, total, totalPages: Math.ceil(total / limit), allCats };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const sp = await searchParams;
  const page = parseInt(sp?.page || '1');
  const difficulty = sp?.difficulty || '';

  const data = await getData(category, page, difficulty);
  if (!data) notFound();

  const { cat, tutorials, total, totalPages, allCats } = data;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Link href="/" style={{ color: '#16a34a', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/tutorials" style={{ color: '#16a34a', textDecoration: 'none' }}>Tutorials</Link>
        <span>/</span>
        <span style={{ color: '#374151', fontWeight: 500 }}>{cat.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar - categories */}
        <aside style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', position: 'sticky', top: '80px' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#f0fdf4', borderBottom: '1px solid #e5e7eb' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#15803d' }}>All Disciplines</p>
          </div>
          {allCats.map(c => (
            <Link key={c._id} href={`/tutorials/${c.slug}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: c.slug === category ? '#16a34a' : '#374151', background: c.slug === category ? '#f0fdf4' : 'white', borderLeft: `3px solid ${c.slug === category ? '#16a34a' : 'transparent'}`, borderBottom: '1px solid #f3f4f6', fontWeight: c.slug === category ? 600 : 400, transition: 'background 0.1s' }}>
              <Layers size={16} color={c.slug === category ? '#16a34a' : '#9ca3af'} />
              <span style={{ lineHeight: 1.3 }}>{c.name}</span>
            </Link>
          ))}
        </aside>

        {/* Main content */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Layers size={28} color="#16a34a" />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>{cat.name}</h1>
            </div>
            {cat.description && <p style={{ color: '#6b7280', margin: '0 0 1rem', lineHeight: 1.7 }}>{cat.description}</p>}
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>{total} tutorial{total !== 1 ? 's' : ''} available</p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} color="#9ca3af" />
            {['', 'beginner', 'intermediate', 'advanced'].map(d => (
              <Link key={d} href={`/tutorials/${category}${d ? `?difficulty=${d}` : ''}`}
                style={{ padding: '0.3rem 0.85rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', background: difficulty === d ? '#16a34a' : 'white', color: difficulty === d ? 'white' : '#6b7280', border: `1.5px solid ${difficulty === d ? '#16a34a' : '#e5e7eb'}`, textTransform: 'capitalize', transition: 'all 0.15s' }}>
                {d || 'All Levels'}
              </Link>
            ))}
          </div>

          {/* Ad */}
          <div style={{ marginBottom: '1.5rem' }}>
            {/*<AdUnit slot="2345678901" format="horizontal" />*/}
            <AdsterraNative />
          </div>

          {/* Tutorials grid */}
          {tutorials.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
              {tutorials.map(t => <TutorialCard key={t._id} tutorial={{ ...t, category: cat }} categorySlug={category} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f9fafb', borderRadius: 12, border: '1.5px dashed #e5e7eb' }}>
              <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ color: '#6b7280', margin: 0 }}>No tutorials yet in this category. Check back soon!</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {page > 1 && (
                <Link href={`/tutorials/${category}?page=${page - 1}${difficulty ? `&difficulty=${difficulty}` : ''}`}
                  style={{ padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 6, textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>← Prev</Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p;
                if (totalPages <= 7) p = i + 1;
                else if (page <= 4) p = i + 1;
                else if (page >= totalPages - 3) p = totalPages - 6 + i;
                else p = page - 3 + i;
                return (
                  <Link key={p} href={`/tutorials/${category}?page=${p}${difficulty ? `&difficulty=${difficulty}` : ''}`}
                    style={{ padding: '0.5rem 0.85rem', border: `1.5px solid ${p === page ? '#16a34a' : '#e5e7eb'}`, borderRadius: 6, textDecoration: 'none', color: p === page ? 'white' : '#374151', background: p === page ? '#16a34a' : 'white', fontSize: '0.875rem', fontWeight: p === page ? 700 : 400 }}>
                    {p}
                  </Link>
                );
              })}
              {page < totalPages && (
                <Link href={`/tutorials/${category}?page=${page + 1}${difficulty ? `&difficulty=${difficulty}` : ''}`}
                  style={{ padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 6, textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>Next →</Link>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { aside { display: none; } }`}</style>
    </div>
  );
}
