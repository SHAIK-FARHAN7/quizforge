import { Link } from 'react-router-dom';
import usePageMeta from '../utils/usePageMeta.js';

export default function About() {
  usePageMeta(
    'About QuizForge',
    'QuizForge helps students learn faster. Paste your notes, learn each topic step by step, and then test yourself with practice questions.'
  );

  return (
    <>
      <header>
        <h1>About QuizForge</h1>
        <p>Learn first. Then test yourself.</p>
      </header>

      <div className="card">
        <h3>What is QuizForge?</h3>
        <p className="muted">
          QuizForge helps students learn faster. Paste your notes or a topic, and we turn
          them into a simple lesson and a practice test.
        </p>
      </div>

      <div className="card">
        <h3>How it works</h3>
        <ul className="points-list">
          <li>Paste your notes on the Create page.</li>
          <li>Learn each topic step by step with points, an example and a memory trick.</li>
          <li>Finish all topics to unlock the test.</li>
          <li>Take the timed test and see which topics you need to review.</li>
        </ul>
      </div>

      <div className="card">
        <h3>Good to know</h3>
        <ul className="points-list">
          <li>AI can make mistakes, so please double-check important facts.</li>
          <li>Please don't paste private or confidential notes.</li>
          <li>Your history is saved in this browser. No login is needed.</li>
        </ul>
        <Link to="/create" className="cta-link">Create a Quiz</Link>
      </div>

      <div className="card built-by">
        <h3>Built by</h3>
        <p><b>Shaik Farhan</b></p>
        <p className="muted">
          Student developer building free, simple tools that help students learn faster.
          QuizForge started as a personal project and is made to be fast, free and easy to use.
        </p>
        <p>
          <a
            href="https://www.linkedin.com/in/shaik-farhan-ba174a37a"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-link"
          >
            LinkedIn
          </a>{' '}
          <a
            href="https://github.com/SHAIK-FARHAN7"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-link"
          >
            GitHub
          </a>
        </p>
      </div>
    </>
  );
}