const express = require('express');
const router = express.Router();
const { getAllCareers, getCareerById, createCareer } = require('../controllers/careerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllCareers);
router.get('/:id', protect, getCareerById);
router.post('/', protect, adminOnly, createCareer);

module.exports = router;
