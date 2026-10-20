import mongoose from 'mongoose';
import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';
import Attempt from './_lib/Attempt.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Please use GET.' });
  }

  try {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'This result link is not valid.' });
    }

    await connectDB();

    const attempt = await Attempt.findById(id).lean();
    if (!attempt) {
      return res.status(404).json({ error: 'We could not find this result.' });
    }

    const quiz = await Quiz.findById(attempt.quizId).lean();
    if (!quiz) {
      return res.status(404).json({ error: 'We could not find this quiz.' });
    }

    const questions = quiz.questions.map((q, index) => ({
      index,
      topicId: q.topicId,
      question: q.question,
      options: q.options,
      answerIndex: q.answerIndex,
      explanation: q.explanation,
      yourAnswer: attempt.answers[index] ?? -1,
    }));

    const weakTopics = quiz.topics
      .filter((t) => attempt.weakTopics.includes(t.topicId))
      .map((t) => ({ topicId: t.topicId, title: t.title }));

    return res.status(200).json({
      attemptId: attempt._id,
      quizId: quiz._id,
      title: quiz.title,
      score: attempt.score,
      total: attempt.total,
      timeTaken: attempt.timeTaken,
      markedQuestions: attempt.markedQuestions,
      weakTopics,
      questions,
    });
  } catch (error) {
    console.error('Result fetch failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}