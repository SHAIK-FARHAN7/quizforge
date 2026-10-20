import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadResult() {
      try {
        const res = await fetch(`/api/result?id=${id}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Something went wrong. Please try again in a few minutes.');
        } else {
          setResult(data);
        }
      } catch {
        if (!cancelled) setError('Could not connect to the server. Please try again in a few minutes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadResult();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleRetry = () => {
    // Clear the old saved test so the retry starts fresh
    try {
      localStorage.removeItem(`quizforge_test_${result.quizId}`);
    } catch {
      // Ignore blocked storage
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p className="muted">Loading your result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="card">
        <h2>Oops</h2>
        <p className="error-text">{error || 'We could not find this result.'}</p>
        <Link to="/create" className="cta-link">Create a new quiz</Link>
      </div>
    );
  }

  const percent = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
  const wrongCount = result.questions.filter(
    (q) => q.yourAnswer !== -1 && q.yourAnswer !== q.answerIndex
  ).length;
  const skippedCount = result.questions.filter((q) => q.yourAnswer === -1).length;

  return (
    <>
      <header>
        <h1>Your Result</h1>
        <p>{result.title}</p>
      </header>

      <div className="score-box">
        {result.score} / {result.total} ({percent}%)
      </div>
      <p className="muted small center-text">
        {result.total - wrongCount - skippedCount} correct · {wrongCount} wrong · {skippedCount} skipped · Time:{' '}
        {formatDuration(result.timeTaken)}
      </p>

      <div className="card">
        <h3>Topics to review</h3>
        {result.weakTopics.length === 0 ? (
          <p className="muted">Great job! You got every topic right. 🎉</p>
        ) : (
          <ul className="points-list">
            {result.weakTopics.map((topic) => (
              <li key={topic.topicId}>
                {topic.title}{' '}
                <Link to={`/learn/${result.quizId}`} className="inline-link">
                  Review this topic
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Review your answers</h2>
      {result.questions.map((q) => {
        const skipped = q.yourAnswer === -1;
        const correct = q.yourAnswer === q.answerIndex;
        return (
          <div key={q.index} className="question-card">
            <p className="question-text">
              <b>Q{q.index + 1}:</b> {q.question}
            </p>
            <div className="options-grid">
              {q.options.map((option, optIndex) => {
                let cls = 'option-btn review';
                if (optIndex === q.answerIndex) cls += ' correct';
                else if (optIndex === q.yourAnswer) cls += ' wrong';
                return (
                  <div key={optIndex} className={cls}>
                    {option}
                    {optIndex === q.answerIndex && ' ✓'}
                    {optIndex === q.yourAnswer && optIndex !== q.answerIndex && ' (your answer)'}
                  </div>
                );
              })}
            </div>
            <p className="muted small">
              {skipped ? 'You skipped this question.' : correct ? 'Correct!' : 'Not quite.'}
            </p>
            <p className="explanation">
              💡 <b>Explanation:</b> {q.explanation}
            </p>
          </div>
        );
      })}

      <div className="learn-actions">
        <Link to={`/quiz/${result.quizId}`} className="cta-link" onClick={handleRetry}>
          Retry this quiz
        </Link>
        <Link to="/create" className="cta-link">
          New quiz
        </Link>
      </div>
    </>
  );
}