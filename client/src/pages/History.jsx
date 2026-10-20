import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDeviceId } from '../utils/deviceId.js';

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

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

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      try {
        const res = await fetch(`/api/history?deviceId=${encodeURIComponent(getDeviceId())}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Something went wrong. Please try again in a few minutes.');
        } else {
          setAttempts(data.attempts);
        }
      } catch {
        if (!cancelled) setError('Could not connect to the server. Please try again in a few minutes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <header>
        <h1>History</h1>
        <p>Your past test attempts on this device</p>
      </header>

      {loading && (
        <div className="card">
          <p className="muted">Loading your history...</p>
        </div>
      )}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && attempts.length === 0 && (
        <div className="card">
          <h3>No attempts yet</h3>
          <p className="muted">Take a test and your results will show up here.</p>
          <Link to="/create" className="cta-link">Create a quiz</Link>
        </div>
      )}

      {!loading &&
        !error &&
        attempts.map((a) => {
          const percent = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
          return (
            <div key={a.attemptId} className="card history-item">
              <div>
                <h3>{a.title}</h3>
                <p className="muted small">
                  {formatDate(a.createdAt)} · Time: {formatDuration(a.timeTaken)}
                </p>
              </div>
              <div className="history-right">
                <div className="history-score">
                  {a.score} / {a.total} ({percent}%)
                </div>
                <Link to={`/result/${a.attemptId}`} className="inline-link">
                  View result
                </Link>
              </div>
            </div>
          );
        })}
    </>
  );
}