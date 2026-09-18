import React, { useState, useEffect, useCallback } from 'react';
import { getTriviaQuestion } from '../api/api';
import '../static/Quiz.css';

const Quiz = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selected, setSelected] = useState(null); // The option the user picked
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0); // Number of correct answers
  const [answered, setAnswered] = useState(0); // Number of questions answered

  // Memoized fetchTrivia function
  const fetchTrivia = useCallback(async () => {
    setLoading(true);
    setError('');
    const data = await getTriviaQuestion();
    if (data) {
      setQuestion(data.question);
      setOptions(data.options || []);
      setCorrectAnswer(data.correctAnswer || '');
      setSelected(null); // Reset the chosen answer for each new question
    } else {
      setError("We couldn't load a trivia question right now.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrivia();
  }, [fetchTrivia]);

  const hasAnswered = selected !== null;

  const handleAnswer = (answer) => {
    if (hasAnswered) return;
    setSelected(answer);
    setAnswered((count) => count + 1);
    if (answer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const optionClass = (option) => {
    if (!hasAnswered) return 'option';
    if (option === correctAnswer) return 'option option--correct';
    if (option === selected) return 'option option--wrong';
    return 'option option--dim';
  };

  const optionMark = (option, index) => {
    if (hasAnswered && option === correctAnswer) return '✓';
    if (hasAnswered && option === selected) return '✕';
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <main className="page">
      <div className="quiz-head">
        <h1>Food Trivia</h1>
        <p className="score-chip" aria-live="polite">
          Score{' '}
          <strong>
            {score}/{answered}
          </strong>
        </p>
      </div>

      {loading ? (
        <div className="card quiz-card" aria-busy="true">
          <div className="quiz-skeleton" aria-hidden="true">
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
          <span className="sr-only">Loading trivia…</span>
        </div>
      ) : error ? (
        <div className="card state" role="alert">
          <div className="state__icon" aria-hidden="true">
            🍽️
          </div>
          <h2>Something's off in the kitchen</h2>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={fetchTrivia}>
            Try again
          </button>
        </div>
      ) : (
        <div className="card quiz-card">
          <h2 className="quiz-question">{question}</h2>

          <div className="options" role="group" aria-label="Answer choices">
            {options.map((option, index) => (
              <button
                type="button"
                key={`${index}-${option}`}
                className={optionClass(option)}
                onClick={() => handleAnswer(option)}
                disabled={hasAnswered}
              >
                <span className="option__key" aria-hidden="true">
                  {optionMark(option, index)}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>

          <p
            className={`feedback ${
              hasAnswered ? (selected === correctAnswer ? 'feedback--good' : 'feedback--bad') : ''
            }`}
            role="status"
          >
            {hasAnswered &&
              (selected === correctAnswer
                ? 'Correct! Nice one.'
                : `Not quite. The answer is ${correctAnswer}.`)}
          </p>

          <div className="quiz-actions">
            <button type="button" className="btn btn-primary" onClick={fetchTrivia} disabled={!hasAnswered}>
              Next question
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Quiz;
