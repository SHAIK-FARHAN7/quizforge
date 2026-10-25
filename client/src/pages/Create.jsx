import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeviceId } from '../utils/deviceId.js';
import usePageMeta from '../utils/usePageMeta.js';

const MAX_CHARS = 50000;

const TABS = {
  notes: {
    label: 'Paste notes',
    sourceType: 'notes',
    minChars: 20,
    title: 'Paste your notes',
    placeholder: 'Paste your notes or syllabus topics here...',
    rows: 10,
  },
  topic: {
    label: 'Type a topic',
    sourceType: 'topic',
    minChars: 3,
    title: 'Type a topic',
    placeholder: 'Example: How does photosynthesis work?',
    rows: 3,
  },
  transcript: {
    label: 'YouTube transcript',
    sourceType: 'transcript',
    minChars: 20,
    title: 'Paste a YouTube transcript',
    placeholder: 'Open the video, click "Show transcript", copy the text and paste it here...',
    rows: 10,
  },
};

export default function Create() {
  usePageMeta(
    'Create a Quiz from Your Notes',
    'Paste your study notes, type a topic or paste a video transcript. Get a step by step lesson and a practice quiz in seconds.'
  );

  const navigate = useNavigate();
  const [tab, setTab] = useState('notes');
  const [texts, setTexts] = useState({ notes: '', topic: '', transcript: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = TABS[tab];
  const value = texts[tab];

  const switchTab = (key) => {
    setTab(key);
    setError('');
  };

  const handleGenerate = async () => {
    setError('');

    const text = value.trim();
    if (text.length < config.minChars) {
      setError(tab === 'topic' ? 'Please type a topic name.' : 'Please add a little more text.');
      return;
    }
    if (text.length > MAX_CHARS) {
      setError(`Your text is too long. Please keep it under ${MAX_CHARS} characters.`);
      return;
    }

    setLoading(true);
    try {
        const sendRequest = async () => {
        const r = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            sourceType: config.sourceType,
            deviceId: getDeviceId(),
          }),
        });
        let d = {};
        try {
          d = await r.json();
        } catch {
          // Server did not return JSON
        }
        return { r, d };
      };

      let { r: res, d: data } = await sendRequest();

      // If the AI is busy, wait a little and try again (up to 2 more times)
      for (let i = 0; i < 2 && (res.status === 429 || res.status >= 500); i++) {
        // Do not retry when the daily limit is reached
        if (data.error && data.error.includes('limit')) break;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        ({ r: res, d: data } = await sendRequest());
      }

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again in a few minutes.');
        return;
      }

      navigate(`/learn/${data.id}`);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Please try again in a few minutes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <h1>Create a Quiz</h1>
        <p>Add your study material. We will teach you each topic and then test you.</p>
      </header>

      <div className="topic-tabs">
        {Object.entries(TABS).map(([key, t]) => (
          <button
            key={key}
            className={`topic-tab ${tab === key ? 'current' : ''}`}
            onClick={() => switchTab(key)}
            disabled={loading}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        <h3>{config.title}</h3>
        <textarea
          rows={config.rows}
          placeholder={config.placeholder}
          value={value}
          onChange={(e) => setTexts((t) => ({ ...t, [tab]: e.target.value }))}
          disabled={loading}
        ></textarea>

        <p className="muted small">
          {value.length} / {MAX_CHARS} characters
        </p>
        {tab === 'topic' && (
          <p className="muted small">
            This quiz will be made from AI knowledge, so please double-check important facts.
          </p>
        )}
        <p className="muted small">Please don't paste private or confidential notes.</p>

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Creating your quiz... please wait a few seconds' : 'Create Quiz'}
        </button>
      </div>
    </>
  );
}