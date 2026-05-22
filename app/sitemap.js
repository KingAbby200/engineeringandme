import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import Category from '@/lib/models/Category';
import { TutorialPage } from '@/lib/models/Tutorial';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://engineeringtutorials.com';
  const now = new Date();

  // Static pages
  const staticPages = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/tutorials`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    await connectDB();

    // Category pages
    const categories = await Category.find({ isActive: true }).lean();
    const categoryPages = categories.map(cat => ({
      url: `${base}/tutorials/${cat.slug}`,
      lastModified: cat.updatedAt || now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Tutorial overview pages
    const tutorials = await Tutorial.find({ status: 'approved' })
      .populate('category', 'slug')
      .select('slug category updatedAt')
      .lean();

    const tutorialPages = tutorials.map(t => ({
      url: `${base}/tutorials/${t.category?.slug}/${t.slug}`,
      lastModified: t.updatedAt || now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    // Individual tutorial content pages
    const pages = await TutorialPage.find({})
      .populate({ path: 'tutorial', select: 'slug status category', populate: { path: 'category', select: 'slug' } })
      .select('slug tutorial updatedAt')
      .lean();

    const contentPages = pages
      .filter(p => p.tutorial?.status === 'approved' && p.tutorial?.category?.slug)
      .map(p => ({
        url: `${base}/tutorials/${p.tutorial.category.slug}/${p.tutorial.slug}/${p.slug}`,
        lastModified: p.updatedAt || now,
        changeFrequency: 'monthly',
        priority: 0.75,
      }));

    return [...staticPages, ...categoryPages, ...tutorialPages, ...contentPages];
  } catch (err) {
    console.error('Sitemap error:', err);
    return staticPages;
  }
}
