import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { TutorialPage } from '@/lib/models/Tutorial';
import { getAuthUser, apiError, apiResponse } from '@/lib/utils/auth';

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return apiError('Login required to take quizzes', 401);

    await connectDB();
    const { pageId, answers } = await request.json();
    if (!pageId || !answers) return apiError('pageId and answers required');

    const page = await TutorialPage.findById(pageId);
    if (!page || !page.quiz.enabled) return apiError('Quiz not found or not enabled', 404);

    const questions = page.quiz.questions;
    let score = 0;
    const results = answers.map((selectedOption, i) => {
      const q = questions[i];
      const correct = q && selectedOption === q.correctOption;
      if (correct) score++;
      return { questionIndex: i, selectedOption, correct, explanation: q?.explanation };
    });

    const user = await User.findById(authUser.id);
    user.quizResults.push({
      quiz: pageId,
      tutorialPage: pageId,
      score, total: questions.length,
      answers: results.map(r => ({ questionIndex: r.questionIndex, selectedOption: r.selectedOption, correct: r.correct })),
    });
    await user.save();

    return apiResponse({ score, total: questions.length, results, percentage: Math.round(score / questions.length * 100) });
  } catch (err) {
    console.error('Quiz error:', err);
    return apiError('Server error', 500);
  }
}
