import mongoose from 'mongoose';
import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';
import { generateRestTopics, generateQuestions } from './_lib/gemini.js';

const LOCK_SECONDS = 90;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Please use POST.' });
  }

  try {
    const id = typeof req.body?.id === 'string' ? req.body.id : '';
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'This quiz link is not valid.' });
    }

    await connectDB();

    // Lock: only one request builds this quiz. An old lock (older than 90s) is ignored,
    // so a cut-off request can never block the quiz forever.
    const staleBefore = new Date(Date.now() - LOCK_SECONDS * 1000);
    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: id,
        status: 'partial',
        $or: [{ building: { $ne: true } }, { buildStartedAt: { $lt: staleBefore } }],
      },
      { $set: { building: true, buildStartedAt: new Date() } },
      { returnDocument: 'after', strict: false }
    ).lean();

    if (!quiz) {
      return res.status(200).json({ status: 'busy-or-ready' });
    }

    try {
      const first = quiz.topics[0];
      const rest = await generateRestTopics(quiz.sourceText, quiz.sourceType, quiz.topicNames);
      const topics = [first, ...rest].sort((a, b) => a.topicId - b.topicId);
      const questions = await generateQuestions(topics);

      if (!questions.length) {
        throw new Error('No questions created');
      }

      await Quiz.updateOne(
        { _id: id },
        { $set: { topics, questions, status: 'ready', sourceText: '', building: false } }
      );
      return res.status(200).json({ status: 'ready' });
    } catch (error) {
      await Quiz.updateOne({ _id: id }, { $set: { building: false } });
      throw error;
    }
  } catch (error) {
    console.error('Continue failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
      debug: String(error.message || '').slice(0, 300),
    });
  }
}