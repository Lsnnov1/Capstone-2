const pool = require('../db');

// Get all quizzes
const getAllQuizzes = async () => {
  try {
    const result = await pool.query('SELECT * FROM quizzes');
    return result.rows;
  } catch (err) {
    throw new Error('Error fetching quizzes');
  }
};

// Add a new quiz
const addQuiz = async (quiz) => {
  const { question, options, correct_answer, category } = quiz;
  try {
    const result = await pool.query(
      'INSERT INTO quizzes (question, options, correct_answer, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [question, options, correct_answer, category]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error('Error adding quiz');
  }
};

// Update an existing quiz
const updateQuiz = async (id, quiz) => {
  const { question, options, correct_answer, category } = quiz;
  try {
    const result = await pool.query(
      'UPDATE quizzes SET question = $1, options = $2, correct_answer = $3, category = $4 WHERE id = $5 RETURNING *',
      [question, options, correct_answer, category, id]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error('Error updating quiz');
  }
};

// Delete a quiz
const deleteQuiz = async (id) => {
  try {
    await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);
  } catch (err) {
    throw new Error('Error deleting quiz');
  }
};

module.exports = { getAllQuizzes, addQuiz, updateQuiz, deleteQuiz };
