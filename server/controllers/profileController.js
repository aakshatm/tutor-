const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Update teacher profile
exports.updateTeacherProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            qualifications,
            phoneNumber,
            whatsappNumber,
            teachingExperience,
            subjects,
            charges,
            preferredMode
        } = req.body;

        // Check if user is a teacher
        if (req.user.role !== 'teacher') {
            return res.status(403).json({
                message: 'Only teachers can update teacher profiles'
            });
        }

        // Create or update teacher profile
        let teacher = await Teacher.findOne({ user: req.user.id });
        if (!teacher) {
            teacher = new Teacher({
                user: req.user.id,
                name,
                qualifications,
                phoneNumber,
                whatsappNumber,
                teachingExperience,
                subjects,
                charges,
                preferredMode
            });
        } else {
            teacher.name = name;
            teacher.qualifications = qualifications;
            teacher.phoneNumber = phoneNumber;
            teacher.whatsappNumber = whatsappNumber;
            teacher.teachingExperience = teachingExperience;
            teacher.subjects = subjects;
            teacher.charges = charges;
            teacher.preferredMode = preferredMode;
        }

        await teacher.save();

        // Update user's profile completion status
        await User.findByIdAndUpdate(req.user.id, { isProfileComplete: true });

        res.json({
            message: 'Teacher profile updated successfully',
            data: teacher
        });
    } catch (error) {
        console.error('Error in updateTeacherProfile:', error);
        res.status(500).json({
            message: 'Server error while updating teacher profile'
        });
    }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            parentName,
            phoneNumber,
            whatsappNumber,
            gradeLevel,
            board,
            schoolName
        } = req.body;

        // Check if user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({
                message: 'Only students can update student profiles'
            });
        }

        // Create or update student profile
        let student = await Student.findOne({ user: req.user.id });
        if (!student) {
            student = new Student({
                user: req.user.id,
                name,
                parentName,
                phoneNumber,
                whatsappNumber,
                gradeLevel,
                board,
                schoolName
            });
        } else {
            student.name = name;
            student.parentName = parentName;
            student.phoneNumber = phoneNumber;
            student.whatsappNumber = whatsappNumber;
            student.gradeLevel = gradeLevel;
            student.board = board;
            student.schoolName = schoolName;
        }

        await student.save();

        // Update user's profile completion status
        await User.findByIdAndUpdate(req.user.id, { isProfileComplete: true });

        res.json({
            message: 'Student profile updated successfully',
            data: student
        });
    } catch (error) {
        console.error('Error in updateStudentProfile:', error);
        res.status(500).json({
            message: 'Server error while updating student profile'
        });
    }
};

// Get teacher profile
exports.getTeacherProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .select('-__v')
            .populate('user', 'email');

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher profile not found'
            });
        }

        // Check if contact is unlocked for this student
        let contactUnlocked = false;
        if (req.user.role === 'student') {
            const student = await Student.findOne({ user: req.user.id });
            if (student) {
                contactUnlocked = student.unlockedTeachers.includes(teacher._id);
            }
        }

        // Remove sensitive information if contact is not unlocked
        if (!contactUnlocked && req.user.role === 'student') {
            teacher.phoneNumber = undefined;
            teacher.whatsappNumber = undefined;
        }

        res.json({
            data: teacher
        });
    } catch (error) {
        console.error('Error in getTeacherProfile:', error);
        res.status(500).json({
            message: 'Server error while fetching teacher profile'
        });
    }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .select('-__v')
            .populate('user', 'email');

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        // Check if contact is unlocked for this teacher
        let contactUnlocked = false;
        if (req.user.role === 'teacher') {
            const teacher = await Teacher.findOne({ user: req.user.id });
            if (teacher) {
                contactUnlocked = student.unlockedTeachers.includes(teacher._id);
            }
        }

        // Remove sensitive information if contact is not unlocked
        if (!contactUnlocked && req.user.role === 'teacher') {
            student.phoneNumber = undefined;
            student.whatsappNumber = undefined;
        }

        res.json({
            data: student
        });
    } catch (error) {
        console.error('Error in getStudentProfile:', error);
        res.status(500).json({
            message: 'Server error while fetching student profile'
        });
    }
}; 