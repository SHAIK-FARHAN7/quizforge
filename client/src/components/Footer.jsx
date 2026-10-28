import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/about">About</Link>
      </nav>
      <div className="footer-credit">
        <span>Built by Shaik Farhan</span>
        <a
          href="https://www.linkedin.com/in/shaik-farhan-ba174a37a"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/SHAIK-FARHAN7"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
