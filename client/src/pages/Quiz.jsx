import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDeviceId } from '../utils/deviceId.js';
import usePageMeta from '../utils/usePageMeta.js';

function loadSaved(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved.answers === 'object') {
      return {
        current: saved.current || 0,
        answers: saved.answers || {},
        marked: Array.isArray(saved.marked) ? saved.marked : [],
        startedAt: saved.startedAt || null,
      };
    }
  } catch {
    // Ignore broken or blocked storage
  }
  return { current: 0, answers: {}, marked: [], startedAt: null };
}

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Quiz is ready only when it has questions and is not still being built
function isQuizReady(quiz) {
  if (!quiz) return false;
  if (quiz.status === 'building') return false;
  return Array.isArray(quiz.questions) && quiz.questions.length > 0;
}

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  usePageMeta('Test', 'Take your practice test.', true);
  const storageKey = `quizforge_test_${id}`;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [state, setState] = useState(() => loadSaved(storageKey));
  const [now, setNow] = useState(() => Date.now());
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submittedRef = useRef(false);

  const ready = isQuizReady(quiz);

  // Load the quiz, and keep checking every 4 seconds until it is ready
  useEffect(() => {
    let cancelled = false;
    let timer = null;

    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quiz?id=${id}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Something went wrong. Please try again in a few minutes.');
          setLoading(false);
          return;
        }
        setQuiz(data);
        setLoading(false);
        if (!isQuizReady(data)) {
          timer = setTimeout(loadQuiz, 4000);
        }
      } catch {
        if (!cancelled) {
          setError('Could not connect to the server. Please try again in a few minutes.');
          setLoading(false);
        }
      }
    }

    loadQuiz();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [id]);

  // Start the timer only when the quiz is fully ready
  useEffect(() => {
    if (ready && !state.startedAt) {
      setState((s) => ({ ...s, startedAt: Date.now() }));
    }
  }, [ready, state.startedAt]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore blocked storage
    }
  }, [state, storageKey]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeLimit = quiz && quiz.timeLimit ? quiz.timeLimit : 0;
  const elapsed = state.startedAt ? Math.floor((now - state.startedAt) / 1000) : 0;
  const secondsLeft = ready && state.startedAt ? timeLimit - elapsed : timeLimit;

  const submitTest = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setSubmitError('');
    setShowConfirm(false);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: id,
          deviceId: getDeviceId(),
          answers: state.answers,
          marked: state.marked,
          timeTaken: Math.min(elapsed, timeLimit),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        submittedRef.current = false;
        setSubmitError(data.error || 'Something went wrong. Please try again in a few minutes.');
        setSubmitting(false);
        return;
      }
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore blocked storage
      }
      navigate(`/result/${data.attemptId}`);
    } catch {
      submittedRef.current = false;
      setSubmitError('Could not connect to the server. Please try again in a few minutes.');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (ready && state.startedAt && timeLimit > 0 && secondsLeft <= 0 && !submittedRef.current) {
      submitTest();
    }
  }, [secondsLeft, ready, state.startedAt]);

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

  if (!ready) {
    return (
      <div className="card">
        <h2>{quiz.title || 'Your test'}</h2>
        <p className="muted">Your questions are still being made... This page will update by itself.</p>
        <Link to={`/learn/${id}`} className="cta-link">Back to learning</Link>
      </div>
    );
  }

  const questions = quiz.questions;
  const total = questions.length;
  const current = Math.max(0, Math.min(state.current, total - 1));
  const question = questions[current];

  if (!question) {
    return (
      <div className="card">
        <p className="muted">Loading your test...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(state.answers).length;
  const markedCount = state.marked.length;
  const unansweredCount = total - answeredCount;
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

      <div className="timer-bar">
        <span>Time left</span>
        <span className={`timer ${secondsLeft <= 60 ? 'low' : ''}`}>{formatTime(secondsLeft)}</span>
      </div>

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
          {(question.options || []).map((option, optIndex) => (
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

      {submitError && <p className="error-text">{submitError}</p>}

      <button className="submit-btn" onClick={() => setShowConfirm(true)} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Test'}
      </button>

      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Submit your test?</h3>
            <p className="muted">
              You have {unansweredCount} unanswered and {markedCount} marked questions. Submit anyway?
            </p>
            <div className="learn-actions">
              <button className="secondary-btn" onClick={() => setShowConfirm(false)}>
                Keep working
              </button>
              <button onClick={submitTest}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}