import { connectDB } from './_lib/db.js';
import Feedback from './_lib/Feedback.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Please use POST.' });
  }

  try {
    const body = req.body || {};
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.slice(0, 100) : '';
    const page = typeof body.page === 'string' ? body.page.slice(0, 100) : '';
    const type = ['bug', 'idea', 'other'].includes(body.type) ? body.type : 'other';

    if (message.length < 5) {
      return res.status(400).json({ error: 'Please write a little more.' });
    }

    await connectDB();
    await Feedback.create({ type, message, email, deviceId, page });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Feedback failed:', error.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again in a few minutes.' });
  }
}