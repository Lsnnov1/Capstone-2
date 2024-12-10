const validateQuiz = (req, res, next) => {
  const { question, options, correct_answer, category } = req.body;
  
  // Validate presence of fields
  if (!question || !options || !correct_answer || !category) {
    return res.status(400).send('All fields are required');
  }

  // Validate options is an array with at least 2 items
  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).send('Options must be an array with at least two items');
  }

  // Validate correct_answer exists in options
  if (!options.includes(correct_answer)) {
    return res.status(400).send('Correct answer must be one of the options');
  }

  next();
};

module.exports = validateQuiz;
