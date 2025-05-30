const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { studentOnly } = require('../middleware/roles');
const {
    getTeachers,
    unlockTeacherContact
} = require('../controllers/teacherController');

// Get filtered list of teachers
router.get('/', auth, studentOnly, getTeachers);

// Unlock teacher contact information
router.post('/:id/unlock', auth, studentOnly, unlockTeacherContact);

module.exports = router; 