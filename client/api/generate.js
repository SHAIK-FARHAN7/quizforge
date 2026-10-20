import crypto from 'crypto';
import { connectDB } from './_lib/db.js';
import Quiz from './_lib/Quiz.js';
import Usage from './_lib/Usage.js';
import { generateTopics, generateQuestions } from './_lib/gemini.js';
import {
  MAX_INPUT_CHARS,
  MIN_INPUT_CHARS,
  DAILY_LIMIT_PER_DEVICE,
} from './_lib/config.js';

const VALID_SOURCES = ['notes', 'topic', 'transcript'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Please use POST.' });
  }

  try {
    const body = req.body || {};
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.slice(0, 100) : '';
    const sourceType = VALID_SOURCES.includes(body.sourceType) ? body.sourceType : 'notes';

    // 1. Check the input
    if (!deviceId) {
      return res.status(400).json({ error: 'Something went wrong. Please refresh the page.' });
    }
    if (text.length < MIN_INPUT_CHARS) {
      return res.status(400).json({ error: 'Please add a little more text.' });
    }
    if (text.length > MAX_INPUT_CHARS) {
      return res.status(400).json({
        error: `Your text is too long. Please keep it under ${MAX_INPUT_CHARS} characters.`,
      });
    }

    await connectDB();

    // 2. Cache: same text and same type means we reuse the old quiz
    const inputHash = crypto
      .createHash('sha256')
      .update(`${sourceType}:${text}`)
      .digest('hex');

    const cached = await Quiz.findOne({ inputHash }).select('_id');
    if (cached) {
      return res.status(200).json({ id: cached._id, cached: true });
    }

    // 3. Daily limit per device
    const day = new Date().toISOString().slice(0, 10);
    const usage = await Usage.findOneAndUpdate(
      { deviceId, day },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    if (usage.count > DAILY_LIMIT_PER_DEVICE) {
      return res.status(429).json({
        error: 'You have reached today\'s limit. Please come back tomorrow.',
      });
    }

    // 4. Ask Gemini (topics first, then questions)
    const topicData = await generateTopics(text, sourceType);
    const questions = await generateQuestions(topicData.topics);

    if (!topicData.topics.length || !questions.length) {
      return res.status(502).json({
        error: 'Could not create the quiz. Please try again.',
      });
    }

    // 5. Save the quiz
    const quiz = await Quiz.create({
      title: topicData.title,
      sourceType,
      contentOrigin: sourceType === 'topic' ? 'from_ai_knowledge' : 'from_notes',
      topics: topicData.topics,
      questions,
      inputHash,
      deviceId,
    });

    return res.status(200).json({ id: quiz._id, cached: false });
  } catch (error) {
    console.error('Generate failed:', error.message);

    if (error.code === 'QUOTA_EXCEEDED') {
      return res.status(429).json({
        error: 'Our AI is very busy right now. Please try again in a few minutes.',
      });
    }
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}