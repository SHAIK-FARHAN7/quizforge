import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import FeedbackButton from './components/FeedbackButton.jsx';
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
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="container route-transition"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition }}
          exit={{ opacity: 0, y: -8, transition }}
        >
          <Routes location={location}>
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
        </motion.div>
      </AnimatePresence>
      <FeedbackButton />
      <Footer />
    </>
  );
}