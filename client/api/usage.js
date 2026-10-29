import { connectDB } from './_lib/db.js';
import Usage from './_lib/Usage.js';
import { DAILY_LIMIT_PER_DEVICE } from './_lib/config.js';

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

    const day = new Date().toISOString().slice(0, 10);
    const usage = await Usage.findOne({ deviceId, day }).lean();
    const used = usage ? usage.count : 0;

    return res.status(200).json({
      limit: DAILY_LIMIT_PER_DEVICE,
      used,
      left: Math.max(0, DAILY_LIMIT_PER_DEVICE - used),
    });
  } catch (error) {
    console.error('Usage fetch failed:', error.message);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}