import mongoose from 'mongoose';
import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Please use GET.' });
  }

  try {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    const withAnswers = req.query.withAnswers === '1';

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'This quiz link is not valid.' });
    }

    await connectDB();

    const quiz = await Quiz.findById(id).lean();
    if (!quiz) {
      return res.status(404).json({ error: 'We could not find this quiz.' });
    }

    // Hide the answers while the student is taking the test
    const questions = quiz.questions.map((q, index) => {
      const base = {
        index,
        topicId: q.topicId,
        question: q.question,
        options: q.options,
      };
      return withAnswers
        ? { ...base, answerIndex: q.answerIndex, explanation: q.explanation }
        : base;
    });

    return res.status(200).json({
      id: quiz._id,
      title: quiz.title,
      sourceType: quiz.sourceType,
      contentOrigin: quiz.contentOrigin,
      timeLimit: quiz.timeLimit,
      topics: quiz.topics,
      questions,
    });
  } catch (error) {
    console.error('Quiz fetch failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}