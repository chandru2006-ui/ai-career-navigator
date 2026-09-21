const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

router.post('/start', protect, ctrl.startAssessment);
router.get('/history', protect, ctrl.getHistory);
router.get('/latest', protect, ctrl.getLatestResult);
router.get('/:id/question', protect, ctrl.getQuestion);
router.post('/:id/answer', protect, ctrl.submitAnswer);
router.post('/:id/submit', protect, ctrl.submitAssessment);
router.get('/:id/result', protect, ctrl.getResult);

module.exports = router;
