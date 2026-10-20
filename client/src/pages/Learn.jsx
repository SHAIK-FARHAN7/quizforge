import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import usePageMeta from '../utils/usePageMeta.js';

function loadProgress(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Array.isArray(saved.understood)) {
      return { current: saved.current || 0, understood: saved.understood };
    }
  } catch {
    // Ignore broken or blocked storage
  }
  return { current: 0, understood: [] };
}

export default function Learn() {
  const { id } = useParams();
  usePageMeta('Learn', 'Learn each topic step by step.', true);
  const storageKey = `quizforge_progress_${id}`;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(() => loadProgress(storageKey));

  useEffect(() => {
    let cancelled = false;
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quiz?id=${id}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Something went wrong. Please try again in a few minutes.');
        } else {
          setQuiz(data);
        }
      } catch {
        if (!cancelled) setError('Could not connect to the server. Please try again in a few minutes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadQuiz();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Ignore blocked storage
    }
  }, [progress, storageKey]);

  if (loading) {
    return (
      <div className="card">
        <p className="muted">Loading your lesson...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="card">
        <h2>Oops</h2>
        <p className="error-text">{error || 'We could not find this quiz.'}</p>
        <Link to="/create" className="cta-link">Create a new quiz</Link>
      </div>
    );
  }

  const topics = quiz.topics;
  const total = topics.length;
  const current = Math.min(progress.current, total - 1);
  const topic = topics[current];
  const understood = progress.understood;
  const isDone = (topicId) => understood.includes(topicId);
  const allDone = topics.every((t) => isDone(t.topicId));
  const doneCount = topics.filter((t) => isDone(t.topicId)).length;

  const goTo = (index) => setProgress((p) => ({ ...p, current: index }));

  const handleGotIt = () => {
    setProgress((p) => ({
      current: Math.min(current + 1, total - 1),
      understood: p.understood.includes(topic.topicId)
        ? p.understood
        : [...p.understood, topic.topicId],
    }));
  };

  const originLabel =
    quiz.contentOrigin === 'from_ai_knowledge'
      ? 'Created from AI knowledge'
      : 'Created from your notes';

  return (
    <>
      <header>
        <h1>{quiz.title}</h1>
        <p>{originLabel}. AI can make mistakes, so please double-check important facts.</p>
      </header>

      <div className="topic-tabs">
        {topics.map((t, index) => (
          <button
            key={t.topicId}
            className={`topic-tab ${index === current ? 'current' : ''} ${isDone(t.topicId) ? 'done' : ''}`}
            onClick={() => goTo(index)}
          >
            {isDone(t.topicId) ? '✓ ' : ''}{index + 1}. {t.title}
          </button>
        ))}
      </div>

      <div className="card">
        <p className="muted small">
          Topic {current + 1} of {total} · {doneCount} of {total} completed
        </p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(doneCount / total) * 100}%` }}></div>
        </div>

        <h2>{topic.title}</h2>

        <ul className="points-list">
          {topic.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        <div className="info-box">
          <b>Example:</b> {topic.example}
        </div>

        <p>
          <b>Key terms:</b>{' '}
          {topic.keyTerms.map((term) => (
            <span key={term} className="term-chip">{term}</span>
          ))}
        </p>

        <div className="info-box trick">
          <b>Memory trick:</b> {topic.memoryTrick}
        </div>

        <div className="learn-actions">
          <button className="secondary-btn" onClick={() => goTo(current - 1)} disabled={current === 0}>
            Previous
          </button>
          <button onClick={handleGotIt}>Got it</button>
          <button className="secondary-btn" onClick={() => goTo(current + 1)} disabled={current === total - 1}>
            Next
          </button>
        </div>
      </div>

      <div className="card">
        {allDone ? (
          <>
            <h3>You finished all topics! 🎉</h3>
            <p className="muted">Your test is ready.</p>
            <Link to={`/quiz/${id}`} className="cta-link">Start the Test</Link>
          </>
        ) : (
          <>
            <h3>Test locked 🔒</h3>
            <p className="muted">
              Finish all {total} topics to unlock the test. {total - doneCount} left.
            </p>
          </>
        )}
      </div>
    </>
  );
}