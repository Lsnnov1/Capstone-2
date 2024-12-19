import React, { useState, useEffect, useCallback } from 'react';
import { getTriviaQuestion } from '../api/api';
import '../static/Quiz.css';

const Quiz = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0); // Score state

  // Memoized fetchTrivia function
  const fetchTrivia = useCallback(async () => {
    setLoading(true);
    const data = await getTriviaQuestion();
    if (data) {
      setQuestion(data.question);
      setOptions(data.options || []);
      setCorrectAnswer(data.correctAnswer || '');
      setUserAnswer(null); // Reset user answer for each new question
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrivia();
  }, [fetchTrivia]);

  const handleAnswer = (answer) => {
    if (answer === correctAnswer) {
      setUserAnswer('Correct!');
      setScore(prevScore => prevScore + 1); // Increase score for correct answers
    } else {
      setUserAnswer(`Incorrect! The correct answer is: ${correctAnswer}`);
    }
  };

  const handleNextQuestion = () => {
    fetchTrivia();  // Re-fetch a new trivia question when clicking "Next Question"
  };

  const getButtonStyle = (option) => {
    if (userAnswer) {
      if (option === correctAnswer) {
        return { backgroundColor: 'green', color: 'white' }; // Correct answer is green
      } else if (option === userAnswer) {
        return { backgroundColor: 'red', color: 'white' }; // Incorrect answer is red
      }
    }
    return {}; // Default button style if no answer has been selected
  };

  const isAnswerSelected = userAnswer !== null;

  if (loading) {
    return <p>Loading trivia...</p>;
  }

  return (
    <div>
      <h2>Food Trivia</h2>
      <p>Score: {score}</p> {/* Display the score */}
      <p>{question}</p>
      <div>
        {options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswer(option)} 
            style={getButtonStyle(option)} 
            disabled={isAnswerSelected}
          >
            {option}
          </button>
        ))}
      </div>
      {userAnswer && <p>{userAnswer}</p>}
      <button onClick={handleNextQuestion} disabled={!userAnswer}>Next Question</button>
    </div>
  );
};

export default Quiz;
