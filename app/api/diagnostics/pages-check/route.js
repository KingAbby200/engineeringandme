import { connectDB } from '@/lib/mongodb';
import { Tutorial, TutorialPage } from '@/lib/models/Tutorial';
import { apiError, apiResponse } from '@/lib/utils/auth';

export async function GET(request) {
  // Only allow in development or with admin token
  if (process.env.NODE_ENV === 'production') {
    return apiError('Not available in production', 403);
  }

  try {
    await connectDB();

    // Find all tutorials with their pages
    const tutorials = await Tutorial.find({ status: 'approved' })
      .select('title slug')
      .lean();

    const diagnostics = [];

    for (const tutorial of tutorials) {
      const pages = await TutorialPage.find({ tutorial: tutorial._id })
        .select('title slug content order')
        .lean();

      const issuesFound = pages.filter(p => !p.content || p.content.trim() === '');

      if (issuesFound.length > 0) {
        diagnostics.push({
          tutorial: {
            id: tutorial._id.toString(),
            title: tutorial.title,
            slug: tutorial.slug,
            totalPages: pages.length,
          },
          pagesWithMissingContent: issuesFound.map(p => ({
            id: p._id.toString(),
            title: p.title,
            slug: p.slug,
            order: p.order,
            hasContent: !!p.content && p.content.trim() !== '',
          })),
        });
      }
    }

    return apiResponse({
      totalTutorialsChecked: tutorials.length,
      tutorialsWithIssues: diagnostics.length,
      issues: diagnostics,
    });
  } catch (err) {
    console.error('Diagnostics error:', err);
    return apiError(err.message, 500);
  }
}
