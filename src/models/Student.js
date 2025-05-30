const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please provide student name']
    },
    parentName: {
        type: String,
        required: [true, 'Please provide parent name']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number with country code'],
        match: [/^\+[1-9]\d{1,14}$/, 'Please provide a valid phone number with country code']
    },
    whatsappNumber: {
        type: String,
        match: [/^\+[1-9]\d{1,14}$/, 'Please provide a valid WhatsApp number with country code']
    },
    gradeLevel: {
        type: String,
        required: [true, 'Please provide grade level']
    },
    board: {
        type: String,
        required: [true, 'Please provide education board'],
        enum: ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other']
    },
    schoolName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema); 