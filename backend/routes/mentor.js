const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const mentorLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, message: 'Too many requests. Please wait a moment.' }
});

router.post('/chat', protect, mentorLimiter, ctrl.chat);
router.get('/history', protect, ctrl.getHistory);
router.get('/session/:id', protect, ctrl.getSession);
router.delete('/session/:id', protect, ctrl.deleteSession);

module.exports = router;
