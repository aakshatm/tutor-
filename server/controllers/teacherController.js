const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const User = require('../models/User');

// Get filtered list of teachers
exports.getTeachers = async (req, res) => {
    try {
        const {
            subjects,
            preferredMode,
            maxRate,
            minExperience,
            sort
        } = req.query;

        // Build filter query
        const query = {};

        if (subjects) {
            query.subjects = {
                $regex: subjects,
                $options: 'i'
            };
        }

        if (preferredMode) {
            query.preferredMode = preferredMode;
        }

        if (maxRate) {
            query['charges.perHour'] = { $lte: Number(maxRate) };
        }

        if (minExperience) {
            query['teachingExperience.years'] = { $gte: Number(minExperience) };
        }

        // Build sort query
        let sortQuery = {};
        if (sort) {
            switch (sort) {
                case 'rating':
                    sortQuery = { rating: -1 };
                    break;
                case 'experience':
                    sortQuery = { 'teachingExperience.years': -1 };
                    break;
                case 'price':
                    sortQuery = { 'charges.perHour': 1 };
                    break;
                default:
                    sortQuery = { rating: -1 };
            }
        }

        const teachers = await Teacher.find(query)
            .sort(sortQuery)
            .select('-__v')
            .populate('user', 'email');

        // Remove sensitive information
        const sanitizedTeachers = teachers.map(teacher => {
            const teacherObj = teacher.toObject();
            delete teacherObj.phoneNumber;
            delete teacherObj.whatsappNumber;
            return teacherObj;
        });

        res.json({
            data: sanitizedTeachers
        });
    } catch (error) {
        console.error('Error in getTeachers:', error);
        res.status(500).json({
            message: 'Server error while fetching teachers'
        });
    }
};

// Unlock teacher contact information
exports.unlockTeacherContact = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const student = await Student.findOne({ user: req.user.id });

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        // Check if already unlocked
        if (student.unlockedTeachers.includes(teacherId)) {
            return res.status(400).json({
                message: 'Teacher contact already unlocked'
            });
        }

        // Check if student has enough coins
        const user = await User.findById(req.user.id);
        if (user.coins < 2) {
            return res.status(400).json({
                message: 'Insufficient coins'
            });
        }

        // Deduct coins and update unlocked teachers
        user.coins -= 2;
        await user.save();

        student.unlockedTeachers.push(teacherId);
        await student.save();

        res.json({
            message: 'Teacher contact unlocked successfully',
            data: {
                remainingCoins: user.coins
            }
        });
    } catch (error) {
        console.error('Error in unlockTeacherContact:', error);
        res.status(500).json({
            message: 'Server error while unlocking teacher contact'
        });
    }
}; 