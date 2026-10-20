import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDeviceId } from '../utils/deviceId.js';
import usePageMeta from '../utils/usePageMeta.js';

function formatDate(value) {
  try {
    return new Date(value).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function Quizzes() {
  usePageMeta('My Quizzes', 'View and manage your created quizzes.', true);

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadQuizzes() {
      try {
        const res = await fetch(`/api/quizzes?deviceId=${encodeURIComponent(getDeviceId())}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Something went wrong. Please try again in a few minutes.');
        } else {
          setQuizzes(data.quizzes);
        }
      } catch {
        if (!cancelled) setError('Could not connect to the server. Please try again in a few minutes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadQuizzes();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <header>
        <h1>My Quizzes</h1>
        <p>All the quizzes created on this device</p>
      </header>

      {loading && (
        <div className="card">
          <p className="muted">Loading your quizzes...</p>
        </div>
      )}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && quizzes.length === 0 && (
        <div className="card">
          <h3>No quizzes yet</h3>
          <p className="muted">Create your first quiz to see it listed here.</p>
          <Link to="/create" className="cta-link">Create a quiz</Link>
        </div>
      )}

      {!loading &&
        !error &&
        quizzes.map((q) => (
          <div key={q.quizId} className="card history-item">
            <div>
              <h3>{q.title}</h3>
              <p className="muted small">
                {formatDate(q.createdAt)} · Source: {q.sourceType}
              </p>
            </div>
            <div className="history-right">
              <Link to={`/learn/${q.quizId}`} className="inline-link">
                Learn
              </Link>
              <Link to={`/quiz/${q.quizId}`} className="inline-link" style={{ marginLeft: '12px' }}>
                Test
              </Link>
            </div>
          </div>
        ))}
    </>
  );
}