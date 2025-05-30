const express = require('express');
const router = express.Router();
const {
    updateTeacherProfile,
    updateStudentProfile,
    getTeacherProfile,
    getStudentProfile,
    getTeachers
} = require('../controllers/profile');
const { protect, authorize } = require('../middleware/auth');

// Teacher routes
router.route('/teacher')
    .post(protect, authorize('teacher'), updateTeacherProfile)
    .get(protect, authorize('teacher'), getTeacherProfile);

router.get('/teacher/:id', protect, getTeacherProfile);
router.get('/teachers', protect, getTeachers);

// Student routes
router.route('/student')
    .post(protect, authorize('student'), updateStudentProfile)
    .get(protect, authorize('student'), getStudentProfile);

router.get('/student/:id', protect, getStudentProfile);

module.exports = router; 