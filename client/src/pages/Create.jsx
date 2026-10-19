import React, { useState } from 'react';

export default function Create() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return alert('Please paste some notes or a topic outline first.');
    setLoading(true);
    setScore(null);
    setUserAnswers({});

    try {
      const res = await fetch('https://quizforge-backend-hnxh.onrender.com/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: notes }),
      });

      const data = await res.json();
      if (data.quiz) {
        setQuiz(data.quiz);
      } else {
        alert('Could not create the quiz. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not connect to the server. Please try again in a few minutes.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIndex, optIndex) => {
    setUserAnswers({ ...userAnswers, [qIndex]: optIndex });
  };

  const calculateScore = () => {
    let currentScore = 0;
    quiz.forEach((q, index) => {
      if (userAnswers[index] === q.answerIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
  };

  return (
    <>
      <header>
        <h1>Create a Quiz</h1>
        <p>AI-Powered Flashcard & Quiz Generator for Engineering Students</p>
      </header>

      <main>
        {/* Input Section */}
        <div className="card">
          <h3>Paste Lecture Notes / Topic Outline</h3>
          <textarea
            rows="6"
            placeholder="Paste your syllabus topics or notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? 'AI Processing...' : 'Generate Practice Quiz'}
          </button>
        </div>

        {/* Quiz Display Section */}
        {quiz.length > 0 && (
          <div className="quiz-section">
            <h2>Generated Quiz ({quiz.length} Questions)</h2>

            {quiz.map((q, qIndex) => (
              <div key={qIndex} className="question-card">
                <p className="question-text"><b>Q{qIndex + 1}:</b> {q.question}</p>
                <div className="options-grid">
                  {q.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      className={`option-btn ${
                        userAnswers[qIndex] === optIndex ? 'selected' : ''
                      }`}
                      onClick={() => handleOptionSelect(qIndex, optIndex)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {score !== null && (
                  <p className="explanation">
                    💡 <b>Explanation:</b> {q.explanation}
                  </p>
                )}
              </div>
            ))}

            {score === null ? (
              <button className="submit-btn" onClick={calculateScore}>
                Submit Answers
              </button>
            ) : (
              <div className="score-box">
                Your Score: {score} / {quiz.length}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}