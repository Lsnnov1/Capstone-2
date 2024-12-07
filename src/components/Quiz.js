import '../static/Quiz.css'
import React, { useState, useEffect, useCallback } from 'react';
import { getTriviaQuestion } from '../api/api';

const Quiz = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []); // No dependencies needed since no API key is passed

  useEffect(() => {
    fetchTrivia();
  }, [fetchTrivia]); // Ensure fetchTrivia is only called once per quiz

  const handleAnswer = (answer) => {
    setUserAnswer(answer === correctAnswer ? 'Correct!' : `Incorrect! The correct answer is: ${correctAnswer}`);
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
      <p>{question}</p>
      <div>
        {options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswer(option)} 
            style={getButtonStyle(option)}  // Apply the correct button style based on the answer
            disabled={isAnswerSelected}  // Disable buttons after an answer is selected
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


// ADD SCORE COUNTER MAYBE?