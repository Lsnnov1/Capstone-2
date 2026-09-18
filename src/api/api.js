import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const MEALDB_API = 'https://www.themealdb.com/api/json/v1/1/random.php'; // Free API, no key needed

// Fetch a random dish (photo and name) from TheMealDB
export const getRandomFoodImage = async () => {
  try {
    const response = await axios.get(MEALDB_API);
    const meal = response.data?.meals?.[0];
    if (!meal?.strMealThumb) {
      console.error('Invalid meal data:', response.data);
      return null;
    }
    return { url: meal.strMealThumb, name: meal.strMeal };
  } catch (error) {
    if (error.response) {
      console.error(`Server Error: ${error.response.statusText}`);
    } else if (error.request) {
      console.error('Network Error: No response from TheMealDB.');
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

// Fisher-Yates shuffle (returns a new array)
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Questions still to be asked in this session. Refilled from the API when empty,
// so every question is asked once before any repeats.
let questionQueue = [];

// Fetch a trivia question from our own API (the quizzes table)
export const getTriviaQuestion = async () => {
  try {
    if (questionQueue.length === 0) {
      const response = await axios.get(`${API_URL}/api/quizzes/quizzes`);
      const quizzes = Array.isArray(response.data) ? response.data : [];
      questionQueue = shuffle(
        quizzes.filter((quiz) => quiz.question && Array.isArray(quiz.options) && quiz.options.length > 1)
      );
    }

    const quiz = questionQueue.pop();
    if (!quiz) {
      console.error('No trivia questions available.');
      return null;
    }

    return {
      question: quiz.question,
      options: shuffle(quiz.options),
      correctAnswer: quiz.correct_answer,
    };
  } catch (error) {
    console.error('Error fetching trivia:', error);
    return null; // Return null in case of error
  }
};
