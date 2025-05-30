const express = require('express');
const router = express.Router();
const {
    createRequirement,
    getRequirements,
    getRequirementDetails,
    getMyRequirements
} = require('../controllers/requirement');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), createRequirement);
router.get('/', protect, getRequirements);
router.get('/my-requirements', protect, authorize('student'), getMyRequirements);
router.get('/:id', protect, getRequirementDetails);

module.exports = router; 