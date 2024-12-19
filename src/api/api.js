import axios from 'axios';

const FOODISH_API = 'https://foodish-api.com/';
const EAXELI_API = 'https://eaxeli.com/api/v1/questions/quiz?categorySlug=food-and-drink';  // Eaxeli API for trivia

// Fetch a random food image from the Foodish API
export const getRandomFoodImage = async () => {
  try {
    const response = await axios.get(`${FOODISH_API}api`);
    return response.data.image; // Return the image URL
  } catch (error) {
    if (error.response) {
      console.error(`Server Error: ${error.response.statusText}`);
    } else if (error.request) {
      console.error('Network Error: No response from Foodish API.');
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

// Fetch a trivia question with options from the Eaxeli API
export const getTriviaQuestion = async () => {
  try {
    const response = await axios.get(EAXELI_API); // No API key needed
    const triviaData = response.data;

    // Check if the trivia data is valid
    if (!triviaData || !triviaData.questions || triviaData.questions.length === 0) {
      console.error('Invalid trivia data:', triviaData);
      return null;
    }

    // Get the first trivia question
    const triviaItem = triviaData.questions[0]; 

    const question = triviaItem.question;
    const options = triviaItem.options; // Options are already provided in the API response
    const correctAnswer = triviaItem.answer;
    const correctIndex = triviaItem.correctIndex;

    // Ensure options array contains the correct answer
    const trivia = {
      question,
      options,
      correctAnswer,
      correctIndex,
    };

    return trivia;
  } catch (error) {
    console.error('Error fetching trivia:', error);
    return null; // Return null in case of error
  }
};
