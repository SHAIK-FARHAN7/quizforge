import { GoogleGenAI } from '@google/genai';

const MODELS = ['gemini-3.8-flash', 'gemini-3.8-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

export default async function handler(req, res) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const results = await Promise.all(
    MODELS.map(async (model) => {
      const t0 = Date.now();
      try {
        const r = await ai.models.generateContent({
          model,
          contents: 'Say hello in one short sentence.',
        });
        return { model, ok: true, seconds: (Date.now() - t0) / 1000, text: r.text };
      } catch (error) {
        return { model, ok: false, status: error.status || null };
      }
    })
  );
  res.status(200).json(results);
}