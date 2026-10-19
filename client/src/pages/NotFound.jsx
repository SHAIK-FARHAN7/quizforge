import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card">
      <h2>Page not found</h2>
      <p className="muted">Sorry, we could not find that page.</p>
      <Link to="/" className="cta-link">Go to Home</Link>
    </div>
  );
}