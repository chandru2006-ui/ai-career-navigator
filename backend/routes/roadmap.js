const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, ctrl.generateRoadmap);
router.get('/', protect, ctrl.getRoadmap);
router.get('/all', protect, ctrl.getAllRoadmaps);
router.put('/progress', protect, ctrl.updateProgress);
router.post('/recalculate', protect, ctrl.recalculateRoadmap);

module.exports = router;
