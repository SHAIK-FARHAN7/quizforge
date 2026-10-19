import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        QuizForge ⚡
      </Link>
      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/create" className={linkClass}>Create</NavLink>
        <NavLink to="/quizzes" className={linkClass}>My Quizzes</NavLink>
        <NavLink to="/history" className={linkClass}>History</NavLink>
        <NavLink to="/about" className={linkClass}>About</NavLink>
      </div>
    </nav>
  );
}