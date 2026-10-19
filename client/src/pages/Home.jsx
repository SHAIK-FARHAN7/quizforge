import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero">
      <h1>QuizForge ⚡</h1>
      <p className="hero-text">
        Paste your notes. Learn each topic step by step. Then test yourself.
      </p>
      <Link to="/create" className="cta-link">
        Create a Quiz
      </Link>
    </div>
  );
}