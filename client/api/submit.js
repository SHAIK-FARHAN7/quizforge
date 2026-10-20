import mongoose from 'mongoose';
import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';
import Attempt from './_lib/Attempt.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Please use POST.' });
  }

  try {
    const body = req.body || {};
    const quizId = typeof body.quizId === 'string' ? body.quizId : '';
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.slice(0, 100) : '';
    const timeTaken = Number.isFinite(body.timeTaken) ? Math.max(0, Math.floor(body.timeTaken)) : 0;

    if (!mongoose.isValidObjectId(quizId) || !deviceId) {
      return res.status(400).json({ error: 'Something went wrong. Please refresh the page.' });
    }

    await connectDB();

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res.status(404).json({ error: 'We could not find this quiz.' });
    }

    const total = quiz.questions.length;

    // answers: object like { "0": 2, "3": 1 } (question number -> option number)
    const rawAnswers = body.answers && typeof body.answers === 'object' ? body.answers : {};
    const answers = quiz.questions.map((_, index) => {
      const value = rawAnswers[index];
      return Number.isInteger(value) && value >= 0 && value < 4 ? value : -1;
    });

    const markedQuestions = Array.isArray(body.marked)
      ? body.marked.filter((i) => Number.isInteger(i) && i >= 0 && i < total)
      : [];

    // Score and weak topics are calculated here on the server
    let score = 0;
    const weakSet = new Set();
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.answerIndex) {
        score += 1;
      } else {
        weakSet.add(q.topicId);
      }
    });

    const attempt = await Attempt.create({
      quizId,
      deviceId,
      score,
      total,
      answers,
      markedQuestions,
      weakTopics: [...weakSet],
      timeTaken,
    });

    return res.status(200).json({ attemptId: attempt._id, score, total });
  } catch (error) {
    console.error('Submit failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}