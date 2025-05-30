const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for your requirement']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    subject: {
        type: String,
        required: [true, 'Please specify the subject']
    },
    gradeLevel: {
        type: String,
        required: [true, 'Please specify the grade level']
    },
    budget: {
        type: Number,
        required: [true, 'Please specify your budget']
    },
    location: {
        type: String,
        required: [true, 'Please specify your location']
    },
    preferredMode: {
        type: String,
        enum: ['online', 'in-person', 'both'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Requirement', requirementSchema); 