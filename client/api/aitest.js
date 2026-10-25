const MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'openrouter/free',
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
            messages: [
              {
                role: 'user',
                content: 'Return JSON only: {"topics":["a","b"]}. No other text.',
              },
            ],
            max_tokens: 60,
          }),
        });
        const data = await r.json();
        return {
          model,
          status: r.status,
          seconds: (Date.now() - t0) / 1000,
          text: data?.choices?.[0]?.message?.content || null,
          error: data?.error?.message ? String(data.error.message).slice(0, 100) : null,
        };
      } catch (error) {
        return { model, status: null, error: String(error.message).slice(0, 100) };
      }
    })
  );

  res.status(200).json(results);
}