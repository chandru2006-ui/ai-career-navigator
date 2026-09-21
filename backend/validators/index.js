/**
 * Input validators — used across controllers for consistent validation
 */

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(String(email).toLowerCase());
}

function validateRegister(body) {
  const { name, email, password } = body;
  const errors = [];
  if (!name || name.trim().length < 2)           errors.push('Name must be at least 2 characters.');
  if (!email || !validateEmail(email))            errors.push('Valid email is required.');
  if (!password || password.length < 8)          errors.push('Password must be at least 8 characters.');
  if (name && name.length > 100)                 errors.push('Name cannot exceed 100 characters.');
  return errors;
}

function validateLogin(body) {
  const { email, password } = body;
  const errors = [];
  if (!email)    errors.push('Email is required.');
  if (!password) errors.push('Password is required.');
  return errors;
}

function validateProfileUpdate(body) {
  const errors = [];
  if (body.name !== undefined && body.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  }
  if (body.email && !validateEmail(body.email)) {
    errors.push('Valid email is required.');
  }
  return errors;
}

function validateAssessmentAnswer(body) {
  const errors = [];
  if (body.questionIndex === undefined || body.questionIndex === null) errors.push('questionIndex is required.');
  if (body.selectedAnswer === undefined || body.selectedAnswer === null) errors.push('selectedAnswer is required.');
  if (typeof body.selectedAnswer === 'number' && (body.selectedAnswer < 0 || body.selectedAnswer > 3)) {
    errors.push('selectedAnswer must be 0–3.');
  }
  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateAssessmentAnswer,
  validateEmail
};
