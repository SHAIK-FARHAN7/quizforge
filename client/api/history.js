import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';
import Attempt from './_lib/Attempt.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Please use GET.' });
  }

  try {
    const deviceId = typeof req.query.deviceId === 'string' ? req.query.deviceId.slice(0, 100) : '';
    if (!deviceId) {
      return res.status(400).json({ error: 'Something went wrong. Please refresh the page.' });
    }

    await connectDB();

    // Latest 50 attempts of this device
    const attempts = await Attempt.find({ deviceId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const quizIds = [...new Set(attempts.map((a) => String(a.quizId)))];
    const quizzes = await Quiz.find({ _id: { $in: quizIds } })
      .select('title')
      .lean();
    const titleById = new Map(quizzes.map((q) => [String(q._id), q.title]));

    const items = attempts.map((a) => ({
      attemptId: a._id,
      quizId: a.quizId,
      title: titleById.get(String(a.quizId)) || 'Quiz',
      score: a.score,
      total: a.total,
      timeTaken: a.timeTaken,
      createdAt: a.createdAt,
    }));

    return res.status(200).json({ attempts: items });
  } catch (error) {
    console.error('History fetch failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}