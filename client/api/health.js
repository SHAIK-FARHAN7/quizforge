import { connectDB } from './_lib/db.js';

export default async function handler(req, res) {
  try {
    const conn = await connectDB();
    res.status(200).json({
      ok: true,
      message: 'Backend is running and MongoDB is connected.',
      database: conn.connection.name,
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(500).json({
      ok: false,
      message: 'Could not connect to the database.',
    });
  }
}