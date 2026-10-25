export default async function handler(req, res) {
  try {
    const r = await fetch('https://openrouter.ai/api/v1/models');
    const data = await r.json();
    const free = (data.data || [])
      .filter((m) => m.pricing && Number(m.pricing.prompt) === 0 && Number(m.pricing.completion) === 0)
      .map((m) => ({ id: m.id, context: m.context_length }));
    res.status(200).json({ count: free.length, free });
  } catch (error) {
    res.status(200).json({ error: String(error.message).slice(0, 150) });
  }
}