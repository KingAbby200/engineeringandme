import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import Category from '@/lib/models/Category';
import TutorialsPageClient from '@/components/tutorials/TutorialsPageClient';

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

  // Serialize objects to plain JSON
  const serializedTutorials = tutorials.map(t => {
    const serialized = {
      _id: t._id.toString(),
      title: t.title,
      slug: t.slug,
      description: t.description,
      featured: t.featured,
      difficulty: t.difficulty,
      coverImage: t.coverImage || null,
      category: t.category ? {
        _id: t.category._id.toString(),
        name: t.category.name,
        slug: t.category.slug,
        color: t.category.color,
        icon: t.category.icon,
      } : null,
      author: t.author ? {
        _id: t.author._id?.toString() || '',
        name: t.author.name,
      } : null,
    };
    return JSON.parse(JSON.stringify(serialized));
  });

  const serializedCategories = categories.map(cat => {
    const serialized = {
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
    };
    return JSON.parse(JSON.stringify(serialized));
  });

  return <TutorialsPageClient tutorials={serializedTutorials} total={total} totalPages={totalPages} categories={serializedCategories} page={page} categorySlug={categorySlug} difficulty={difficulty} />;
}
