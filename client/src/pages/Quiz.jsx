import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function loadSaved(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved.answers === 'object') {
      return {
        current: saved.current || 0,
        answers: saved.answers || {},
        marked: Array.isArray(saved.marked) ? saved.marked : [],
      };
    }
  } catch {
    // Ignore broken or blocked storage
  }
  return { current: 0, answers: {}, marked: [] };
}

export default function Quiz() {
  const { id } = useParams();
  const storageKey = `quizforge_test_${id}`;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [state, setState] = useState(() => loadSaved(storageKey));

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
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore blocked storage
    }
  }, [state, storageKey]);

  if (loading) {
    return (
      <div className="card">
        <p className="muted">Loading your test...</p>
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

  const questions = quiz.questions;
  const total = questions.length;
  const current = Math.min(state.current, total - 1);
  const question = questions[current];
  const answeredCount = Object.keys(state.answers).length;
  const markedCount = state.marked.length;
  const isMarked = state.marked.includes(current);

  const goTo = (index) => setState((s) => ({ ...s, current: index }));

  const selectOption = (optIndex) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [current]: optIndex } }));

  const toggleMark = () =>
    setState((s) => ({
      ...s,
      marked: s.marked.includes(current)
        ? s.marked.filter((i) => i !== current)
        : [...s.marked, current],
    }));

  const paletteClass = (index) => {
    let cls = 'palette-btn';
    if (state.marked.includes(index)) cls += ' marked';
    else if (state.answers[index] !== undefined) cls += ' answered';
    if (index === current) cls += ' current';
    return cls;
  };

  return (
    <>
      <header>
        <h1>{quiz.title}</h1>
        <p>Test</p>
      </header>

      <div className="card">
        <p className="muted small">Question palette</p>
        <div className="palette">
          {questions.map((q, index) => (
            <button key={index} className={paletteClass(index)} onClick={() => goTo(index)}>
              {index + 1}
            </button>
          ))}
        </div>
        <p className="muted small">
          <span className="legend answered"></span> Answered{' '}
          <span className="legend marked"></span> Marked{' '}
          <span className="legend"></span> Unanswered
        </p>
      </div>

      <div className="card">
        <p className="muted small">
          Question {current + 1} of {total} · {answeredCount} answered · {markedCount} marked
        </p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(answeredCount / total) * 100}%` }}></div>
        </div>

        <p className="question-text">
          <b>Q{current + 1}:</b> {question.question}
        </p>

        <div className="options-grid">
          {question.options.map((option, optIndex) => (
            <button
              key={optIndex}
              className={`option-btn ${state.answers[current] === optIndex ? 'selected' : ''}`}
              onClick={() => selectOption(optIndex)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="learn-actions">
          <button className="secondary-btn" onClick={() => goTo(current - 1)} disabled={current === 0}>
            Previous
          </button>
          <button className="secondary-btn" onClick={toggleMark}>
            {isMarked ? 'Unmark review' : 'Mark for review'}
          </button>
          <button className="secondary-btn" onClick={() => goTo(current + 1)} disabled={current === total - 1}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}