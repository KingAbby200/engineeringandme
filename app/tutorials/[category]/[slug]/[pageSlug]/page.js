import { connectDB } from '@/lib/mongodb';
import { Tutorial, TutorialPage } from '@/lib/models/Tutorial';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/auth';
import User from '@/lib/models/User';
import TutorialSidebar from '@/components/tutorial/TutorialSidebar';
import PageNavigation from '@/components/tutorial/PageNavigation';
import QuizSection from '@/components/tutorial/QuizSection';
import TutorialPageClient from '@/components/tutorial/TutorialPageClient';
//import AdUnit from '@/components/ui/AdUnit';
import AdsterraNative from '@components/ui/AdsterraNative';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, User as UserIcon } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug, pageSlug } = await params;
  try {
    await connectDB();
    const tutorial = await Tutorial.findOne({ slug }).populate('category', 'name');
    const page = await TutorialPage.findOne({ slug: pageSlug, tutorial: tutorial?._id });
    if (!tutorial || !page || !page.content) return { title: 'Tutorial Page Not Found' };
    return {
      title: `${page.title} – ${tutorial.title}`,
      description: page.metaDescription || `Learn about ${page.title} in this ${tutorial.title} tutorial.`,
      openGraph: {
        title: `${page.title} – ${tutorial.title}`,
        description: page.metaDescription || `Learn about ${page.title}`,
        type: 'article',
        images: tutorial.coverImage ? [{ url: tutorial.coverImage }] : [],
      },
      alternates: { canonical: `/tutorials/${tutorial.category?.slug}/${slug}/${pageSlug}` },
    };
  } catch (err) {
    console.error('Metadata generation error:', err);
    return { title: 'Tutorial Page' };
  }
}

export default async function TutorialPageView({ params }) {
  const { category, slug, pageSlug } = await params;
  await connectDB();

  const tutorial = await Tutorial.findOne({ slug, status: 'approved' })
    .populate('category', 'name slug icon color')
    .populate('author', 'name avatar bio');

  if (!tutorial) notFound();

  const pages = await TutorialPage.find({ tutorial: tutorial._id }).sort({ order: 1 });
  if (!pages || pages.length === 0) notFound();
  
  const currentPage = pages.find(p => p.slug === pageSlug);
  if (!currentPage) {
    console.warn(`Page slug not found: ${pageSlug}. Available slugs: ${pages.map(p => p.slug).join(', ')}`);
    notFound();
  }
  
  if (!currentPage.content || currentPage.content.trim() === '') {
    console.error(`Page has empty content: tutorial=${tutorial.slug}, page=${pageSlug}`);
    notFound();
  }

  const currentIndex = pages.findIndex(p => p.slug === pageSlug);
  const prevPage = pages[currentIndex - 1] || null;
  const nextPage = pages[currentIndex + 1] || null;

  // Get user progress
  let userProgress = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (token) {
      const authUser = verifyToken(token);
      if (authUser) {
        const user = await User.findById(authUser.id).select('progress');
        userProgress = user?.progress?.find(p => p.tutorial?.toString() === tutorial._id.toString());
      }
    }
  } catch {}

  const pageUrl = `/tutorials/${category}/${slug}`;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <TutorialSidebar
        tutorial={{ ...tutorial.toObject(), _id: tutorial._id.toString() }}
        pages={pages.map(p => ({ ...p.toObject(), _id: p._id.toString() }))}
        currentPageId={currentPage._id.toString()}
        userProgress={userProgress}
        categorySlug={category}
      />

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100%' }}>
        {/* Progress tracker + page header */}
        <TutorialPageClient
          tutorialId={tutorial._id.toString()}
          pageId={currentPage._id.toString()}
        />

        <article style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: '#9ca3af', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#16a34a', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={12} />
            <Link href={`/tutorials/${category}`} style={{ color: '#16a34a', textDecoration: 'none' }}>{tutorial.category?.name}</Link>
            <ChevronRight size={12} />
            <Link href={`/tutorials/${category}/${slug}`} style={{ color: '#16a34a', textDecoration: 'none' }}>{tutorial.title}</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#374151' }}>{currentPage.title}</span>
          </nav>

          {/* Page title + meta */}
          <header style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#111827', margin: '0 0 0.75rem', fontFamily: 'Merriweather, serif', lineHeight: 1.3 }}>
              {currentPage.title}
            </h1>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#9ca3af', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {currentPage.readingTime || 5} min read</span>
              {tutorial.author && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {tutorial.author.avatar && <Image src={tutorial.author.avatar} alt={tutorial.author.name} width={20} height={20} style={{ borderRadius: '50%', objectFit: 'cover' }} />}
                  <UserIcon size={13} /> {tutorial.author.name}
                </span>
              )}
              <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 4, padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                Page {currentIndex + 1} of {pages.length}
              </span>
            </div>
          </header>

          {/* Ad before content */}
          <div style={{ marginBottom: '1.5rem' }}>
            {/*<AdUnit slot="3456789012" format="horizontal" />*/}
            <AdsterraNative />
          </div>

          {/* Tutorial content */}
          <div
            className="tutorial-content"
            dangerouslySetInnerHTML={{ __html: currentPage.content || '<p>No content available</p>' }}
          />

          {/* Ad after content */}
          <div style={{ margin: '2rem 0' }}>
            {/*<AdUnit slot="4567890123" format="rectangle" style={{ maxWidth: 400, margin: '0 auto' }} />*/}
            <AdsterraNative />
          </div>

          {/* Quiz */}
          <QuizSection quiz={currentPage.quiz} pageId={currentPage._id.toString()} />

          {/* Page navigation */}
          <PageNavigation pageUrl={pageUrl} prevPage={prevPage} nextPage={nextPage} category={category} />

          {/* Structured Data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: currentPage.title,
            description: currentPage.metaDescription,
            author: { '@type': 'Person', name: tutorial.author?.name },
            publisher: { '@type': 'Organization', name: 'Engineering Tutorials' },
            isPartOf: { '@type': 'Course', name: tutorial.title },
          }) }} />
        </article>
      </div>
    </div>
  );
}
