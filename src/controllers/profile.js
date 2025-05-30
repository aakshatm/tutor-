const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const User = require('../models/User');

// Create or update teacher profile
exports.updateTeacherProfile = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ user: req.user.id });
        const profileData = { ...req.body, user: req.user.id };

        if (teacher) {
            teacher = await Teacher.findOneAndUpdate(
                { user: req.user.id },
                profileData,
                { new: true, runValidators: true }
            );
        } else {
            teacher = await Teacher.create(profileData);
        }

        // Update user profile completion status
        await User.findByIdAndUpdate(req.user.id, { isProfileComplete: true });

        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Create or update student profile
exports.updateStudentProfile = async (req, res) => {
    try {
        let student = await Student.findOne({ user: req.user.id });
        const profileData = { ...req.body, user: req.user.id };

        if (student) {
            student = await Student.findOneAndUpdate(
                { user: req.user.id },
                profileData,
                { new: true, runValidators: true }
            );
        } else {
            student = await Student.create(profileData);
        }

        // Update user profile completion status
        await User.findByIdAndUpdate(req.user.id, { isProfileComplete: true });

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get teacher profile
exports.getTeacherProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user: req.params.id || req.user.id });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.params.id || req.user.id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all teachers with filters
exports.getTeachers = async (req, res) => {
    try {
        let query = Teacher.find({ isAvailable: true });

        // Apply filters
        if (req.query.subjects) {
            query = query.find({ subjects: { $in: req.query.subjects.split(',') } });
        }
        if (req.query.preferredMode) {
            query = query.find({ preferredMode: req.query.preferredMode });
        }
        if (req.query.maxRate) {
            query = query.find({ 'charges.perHour': { $lte: Number(req.query.maxRate) } });
        }
        if (req.query.minExperience) {
            query = query.find({ 'teachingExperience.years': { $gte: Number(req.query.minExperience) } });
        }

        // Sort options
        if (req.query.sort) {
            const sortBy = {};
            if (req.query.sort === 'rating') sortBy.rating = -1;
            if (req.query.sort === 'experience') sortBy['teachingExperience.years'] = -1;
            if (req.query.sort === 'price') sortBy['charges.perHour'] = 1;
            query = query.sort(sortBy);
        } else {
            query = query.sort('-rating');
        }

        const teachers = await query.populate('user', 'email');

        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 