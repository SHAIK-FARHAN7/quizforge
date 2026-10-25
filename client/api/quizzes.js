import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';

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

    const quizzes = await Quiz.find({ deviceId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('title sourceType contentOrigin status topicNames createdAt')
      .lean();

    const items = quizzes.map((q) => ({
      id: q._id,
      id: q._id,
      title: q.title,
      sourceType: q.sourceType,
      contentOrigin: q.contentOrigin,
      status: q.status || 'ready',
      topicCount: (q.topicNames || []).length,
      createdAt: q.createdAt,
    }));

    return res.status(200).json({ quizzes: items });
  } catch (error) {
    console.error('Quizzes fetch failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}