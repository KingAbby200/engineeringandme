import { connectDB } from '@/lib/mongodb';
import { Tutorial, TutorialPage } from '@/lib/models/Tutorial';
import Category from '@/lib/models/Category';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, BarChart2, User, ChevronRight, Tag } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  try {
    await connectDB();
    const tutorial = await Tutorial.findOne({ slug, status: 'approved' }).populate('category', 'name');
    if (!tutorial) return { title: 'Tutorial Not Found' };
    return {
      title: tutorial.metaTitle || tutorial.title,
      description: tutorial.metaDescription || tutorial.description,
      keywords: tutorial.metaKeywords || tutorial.tags,
      openGraph: {
        title: tutorial.metaTitle || tutorial.title,
        description: tutorial.metaDescription || tutorial.description,
        type: 'article',
        images: tutorial.coverImage ? [{ url: tutorial.coverImage }] : [],
      },
    };
  } catch { return { title: 'Tutorial' }; }
}

export default async function TutorialIndexPage({ params }) {
  const { category, slug } = await params;
  await connectDB();

  const tutorial = await Tutorial.findOne({ slug, status: 'approved' })
    .populate('category', 'name slug icon')
    .populate('author', 'name avatar bio');

  if (!tutorial) notFound();

  const pages = await TutorialPage.find({ tutorial: tutorial._id }).sort({ order: 1 });
  if (pages.length > 0) {
    redirect(`/tutorials/${category}/${slug}/${pages[0].slug}`);
  }

  // No pages yet — show overview
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#9ca3af', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#16a34a', textDecoration: 'none' }}>Home</Link> /
        <Link href={`/tutorials/${category}`} style={{ color: '#16a34a', textDecoration: 'none' }}>{tutorial.category?.name}</Link> /
        <span style={{ color: '#374151' }}>{tutorial.title}</span>
      </nav>

      {tutorial.coverImage && (
        <div style={{ borderRadius: 12, overflow: 'hidden', height: 300, position: 'relative', marginBottom: '2rem' }}>
          <Image src={tutorial.coverImage} alt={tutorial.title} fill style={{ objectFit: 'cover' }} />
        </div>
      )}

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 1rem', fontFamily: 'Merriweather, serif' }}>{tutorial.title}</h1>
      <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 0 1.5rem' }}>{tutorial.description}</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: '#6b7280' }}><BookOpen size={15} /> {tutorial.totalPages} pages</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}><BarChart2 size={15} /> {tutorial.difficulty}</span>
        {tutorial.author && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: '#6b7280' }}><User size={15} /> {tutorial.author.name}</span>}
      </div>

      <div style={{ textAlign: 'center', padding: '3rem', background: '#f0fdf4', borderRadius: 12, border: '1.5px dashed #bbf7d0' }}>
        <p style={{ color: '#6b7280' }}>Content pages are being added. Check back soon!</p>
      </div>
    </div>
  );
}
