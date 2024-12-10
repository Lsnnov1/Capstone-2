const express = require('express');
const { getAllQuizzes, addQuiz, updateQuiz, deleteQuiz } = require('../models/quiz');
const validateQuiz = require('../middleware/validateQuiz');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware for authentication
const router = express.Router();

// Get all quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    res.status(500).send('Error fetching quizzes');
  }
});

// Add a new quiz
router.post('/quizzes', authenticateToken, validateQuiz, async (req, res) => {
  const { question, options, correct_answer, category } = req.body;
  try {
    const newQuiz = await addQuiz({ question, options, correct_answer, category });
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).send('Error adding quiz');
  }
});

// Update an existing quiz
router.put('/quizzes/:id', authenticateToken, validateQuiz, async (req, res) => {
  const { id } = req.params;
  const { question, options, correct_answer, category } = req.body;
  try {
    const updatedQuiz = await updateQuiz(id, { question, options, correct_answer, category });
    res.json(updatedQuiz);
  } catch (err) {
    res.status(500).send('Error updating quiz');
  }
});

// Delete a quiz
router.delete('/quizzes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteQuiz(id);
    res.status(204).send('Quiz deleted');
  } catch (err) {
    res.status(500).send('Error deleting quiz');
  }
});

module.exports = router;
