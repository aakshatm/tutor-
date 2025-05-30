const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    updateTeacherProfile,
    updateStudentProfile,
    getTeacherProfile,
    getStudentProfile
} = require('../controllers/profileController');

// Teacher profile routes
router.post('/teacher', auth, updateTeacherProfile);
router.get('/teacher/:id', auth, getTeacherProfile);

// Student profile routes
router.post('/student', auth, updateStudentProfile);
router.get('/student/:id', auth, getStudentProfile);

module.exports = router; 