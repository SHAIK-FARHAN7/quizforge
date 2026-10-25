import mongoose from 'mongoose';
import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';
import { generateRestTopics, generateQuestions } from './_lib/gemini.js';

const LOCK_SECONDS = 70;

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

    // Lock: only one request works on this quiz. An old lock is ignored.
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
      const totalTopics = (quiz.topicNames || []).length;

      // Part A: the remaining topics
      if (quiz.topics.length < totalTopics) {
        const rest = await generateRestTopics(quiz.sourceText, quiz.sourceType, quiz.topicNames);
        const topics = [quiz.topics[0], ...rest].sort((a, b) => a.topicId - b.topicId);
        await Quiz.updateOne({ _id: id }, { $set: { topics, building: false } });
        return res.status(200).json({ status: 'topics-done' });
      }

      // Part B: the questions
      const questions = await generateQuestions(quiz.topics);
      if (!questions.length) {
        throw new Error('No questions created');
      }
      await Quiz.updateOne(
        { _id: id },
        { $set: { questions, status: 'ready', sourceText: '', building: false } }
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