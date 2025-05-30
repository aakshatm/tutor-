// Middleware to restrict access to students only
exports.studentOnly = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({
            message: 'Access denied. Students only.'
        });
    }
    next();
};

// Middleware to restrict access to teachers only
exports.teacherOnly = (req, res, next) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({
            message: 'Access denied. Teachers only.'
        });
    }
    next();
}; 