const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/journeyController');
const { protect } = require('../middleware/auth');

// History page — complete user history
router.get('/history', protect, ctrl.getHistory);

// All journeys for user
router.get('/', protect, ctrl.getAllJourneys);

// Create or get existing journey for a career
router.post('/', protect, ctrl.createOrGetJourney);

// Single journey detail
router.get('/:id', protect, ctrl.getJourney);

// Update journey
router.patch('/:id', protect, ctrl.updateJourney);

// Journey assessments history
router.get('/:id/assessments', protect, ctrl.getJourneyAssessments);

// Sync progress from roadmap
router.patch('/:id/sync-progress', protect, ctrl.syncJourneyProgress);

module.exports = router;
