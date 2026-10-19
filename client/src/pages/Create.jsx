import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeviceId } from '../utils/deviceId.js';

const MIN_CHARS = 20;
const MAX_CHARS = 8000;

export default function Create() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');

    const text = notes.trim();
    if (text.length < MIN_CHARS) {
      setError('Please add a little more text.');
      return;
    }
    if (text.length > MAX_CHARS) {
      setError(`Your text is too long. Please keep it under ${MAX_CHARS} characters.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceType: 'notes',
          deviceId: getDeviceId(),
        }),
      });

      const data = await res.json();

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
        <p>Paste your notes. We will teach you each topic and then test you.</p>
      </header>

      <div className="card">
        <h3>Paste your notes</h3>
        <textarea
          rows="10"
          placeholder="Paste your notes or syllabus topics here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={loading}
        ></textarea>

        <p className="muted small">
          {notes.length} / {MAX_CHARS} characters
        </p>
        <p className="muted small">Please don't paste private or confidential notes.</p>

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Creating your quiz... this can take up to 30 seconds' : 'Create Quiz'}
        </button>
      </div>
    </>
  );
}