import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Create from './pages/Create.jsx';
import Quizzes from './pages/Quizzes.jsx';
import Learn from './pages/Learn.jsx';
import Quiz from './pages/Quiz.jsx';
import Result from './pages/Result.jsx';
import History from './pages/History.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/learn/:id" element={<Learn />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}