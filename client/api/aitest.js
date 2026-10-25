const MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
];

export default async function handler(req, res) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return res.status(200).json({ error: 'OPENROUTER_API_KEY is missing' });
  }

  const results = await Promise.all(
    MODELS.map(async (model) => {
      const t0 = Date.now();
      try {
        const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: 'Say hello in one short sentence.' }],
            max_tokens: 30,
          }),
        });
        const data = await r.json();
        return {
          model,
          status: r.status,
          seconds: (Date.now() - t0) / 1000,
          text: data?.choices?.[0]?.message?.content || null,
          error: data?.error?.message ? String(data.error.message).slice(0, 120) : null,
        };
      } catch (error) {
        return { model, status: null, error: String(error.message).slice(0, 120) };
      }
    })
  );

  res.status(200).json(results);
}