const Requirement = require('../models/Requirement');
const User = require('../models/User');

// Create new requirement
exports.createRequirement = async (req, res) => {
    try {
        req.body.student = req.user.id;
        const requirement = await Requirement.create(req.body);
        
        res.status(201).json({
            success: true,
            data: requirement
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all requirements (with filters)
exports.getRequirements = async (req, res) => {
    try {
        let query = Requirement.find({ status: 'active' });

        // Apply filters
        if (req.query.subject) {
            query = query.find({ subject: req.query.subject });
        }
        if (req.query.gradeLevel) {
            query = query.find({ gradeLevel: req.query.gradeLevel });
        }
        if (req.query.location) {
            query = query.find({ location: req.query.location });
        }
        if (req.query.preferredMode) {
            query = query.find({ preferredMode: req.query.preferredMode });
        }

        const requirements = await query.populate('student', 'name');

        res.status(200).json({
            success: true,
            count: requirements.length,
            data: requirements
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get requirement details (requires coins for teachers)
exports.getRequirementDetails = async (req, res) => {
    try {
        const requirement = await Requirement.findById(req.params.id)
            .populate('student', 'name email phone');

        if (!requirement) {
            return res.status(404).json({ success: false, message: 'Requirement not found' });
        }

        // If user is a teacher, check for coins
        if (req.user.role === 'teacher') {
            if (req.user.coins < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient coins. Please purchase more coins to view contact details.'
                });
            }

            // Deduct one coin
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { coins: -1 }
            });
        }

        res.status(200).json({
            success: true,
            data: requirement
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get my requirements (for students)
exports.getMyRequirements = async (req, res) => {
    try {
        const requirements = await Requirement.find({ student: req.user.id })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: requirements.length,
            data: requirements
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}; 