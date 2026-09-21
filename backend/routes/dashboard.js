const express = require('express');
const router = express.Router();
const { getDashboard, getSkillGaps } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getDashboard);
router.get('/skill-gaps', protect, getSkillGaps);

module.exports = router;
