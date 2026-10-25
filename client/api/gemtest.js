import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const t0 = Date.now();
  try {
    const r = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Say hello in one short sentence.',
    });
    res.status(200).json({ ok: true, seconds: (Date.now() - t0) / 1000, text: r.text });
  } catch (error) {
    res.status(200).json({
      ok: false,
      status: error.status || null,
      message: String(error.message || '').slice(0, 500),
    });
  }
}