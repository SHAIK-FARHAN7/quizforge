import { Link } from 'react-router-dom';
import usePageMeta from '../utils/usePageMeta.js';

export default function Home() {
  usePageMeta(
    'Learn Topic by Topic, Then Take a Quiz',
    'Paste your notes and QuizForge teaches you each topic step by step. Then test yourself with a practice quiz made just for you.'
  );

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