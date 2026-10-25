import { useEffect, useRef, useState } from 'react';
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
  const [buildError, setBuildError] = useState('');
  const [progress, setProgress] = useState(() => loadProgress(storageKey));
  const continueStarted = useRef(false);

  const fetchQuiz = async () => {
    const res = await fetch(`/api/quiz?id=${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again in a few minutes.');
    return data;
  };

  const startContinue = async () => {
    setBuildError('');
    try {
      const res = await fetch('/api/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        setBuildError(data.error || 'Something went wrong. Please try again in a few minutes.');
      }
    } catch {
      setBuildError('Could not connect to the server. Please try again in a few minutes.');
    }
  };

  // Load the quiz
  useEffect(() => {
    let cancelled = false;
    fetchQuiz()
      .then((data) => {
        if (!cancelled) setQuiz(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // If the quiz is still being built, start the build once and keep checking
  const isPartial = quiz && quiz.status === 'partial';
  useEffect(() => {
    if (!isPartial) return undefined;
    if (!continueStarted.current) {
      continueStarted.current = true;
      startContinue();
    }
    const timer = setInterval(async () => {
      try {
        const data = await fetchQuiz();
        setQuiz(data);
      } catch {
        // Try again on the next tick
      }
    }, 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPartial, id]);
  // If the build got stuck, ask again every 30 seconds
  useEffect(() => {
    if (!isPartial) return undefined;
    const retry = setInterval(() => {
      startContinue();
    },8000);
    return () => clearInterval(retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPartial, id]);
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
  const ready = quiz.status !== 'partial';
  const names = quiz.topicNames && quiz.topicNames.length ? quiz.topicNames : topics.map((t) => t.title);
  const total = Math.max(names.length, topics.length);
  const current = Math.min(progress.current, total - 1);
  const topic = topics.find((t) => t.topicId === current);
  const understood = progress.understood;
  const isDone = (topicId) => understood.includes(topicId);
  const doneCount = understood.filter((tid) => tid < total).length;
  const allDone = ready && doneCount >= total;

  const goTo = (index) => setProgress((p) => ({ ...p, current: index }));

  const handleGotIt = () => {
    setProgress((p) => ({
      current: Math.min(current + 1, total - 1),
      understood: p.understood.includes(current) ? p.understood : [...p.understood, current],
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
        {names.map((name, index) => {
          const loaded = topics.some((t) => t.topicId === index);
          return (
            <button
              key={index}
              className={`topic-tab ${index === current ? 'current' : ''} ${isDone(index) ? 'done' : ''}`}
              onClick={() => goTo(index)}
            >
              {isDone(index) ? '✓ ' : ''}{index + 1}. {name}{loaded ? '' : ' ⏳'}
            </button>
          );
        })}
      </div>

      <div className="card">
        <p className="muted small">
          Topic {current + 1} of {total} · {doneCount} of {total} completed
        </p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(doneCount / total) * 100}%` }}></div>
        </div>

        {topic ? (
          <>
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
          </>
        ) : (
          <>
            <h2>{names[current]}</h2>
            <p className="muted">Loading this topic...</p>
          </>
        )}

        <div className="learn-actions">
          <button className="secondary-btn" onClick={() => goTo(current - 1)} disabled={current === 0}>
            Previous
          </button>
          <button onClick={handleGotIt} disabled={!topic}>Got it</button>
          <button className="secondary-btn" onClick={() => goTo(current + 1)} disabled={current === total - 1}>
            Next
          </button>
        </div>
      </div>

      {buildError && (
        <div className="card">
          <p className="error-text">{buildError}</p>
          <button onClick={startContinue}>Try again</button>
        </div>
      )}

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
              {ready
                ? `Finish all ${total} topics to unlock the test. ${total - doneCount} left.`
                : 'We are still preparing the rest of your lesson and the test. Keep reading!'}
            </p>
          </>
        )}
      </div>
    </>
  );
}