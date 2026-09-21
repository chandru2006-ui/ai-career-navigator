const express = require('express');
const router = express.Router();
const { getAllSkills, getSkillById } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllSkills);
router.get('/:id', protect, getSkillById);

module.exports = router;
