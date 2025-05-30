const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    qualifications: [{
        type: String,
        required: [true, 'Please provide your qualifications']
    }],
    phoneNumber: {
        type: String,
        required: [true, 'Please provide your phone number with country code'],
        match: [/^\+[1-9]\d{1,14}$/, 'Please provide a valid phone number with country code']
    },
    whatsappNumber: {
        type: String,
        match: [/^\+[1-9]\d{1,14}$/, 'Please provide a valid WhatsApp number with country code']
    },
    teachingExperience: {
        years: {
            type: Number,
            required: [true, 'Please provide your teaching experience in years']
        },
        details: String
    },
    subjects: [{
        type: String,
        required: [true, 'Please provide subjects you can teach']
    }],
    charges: {
        perHour: {
            type: Number,
            required: [true, 'Please provide your hourly rate']
        },
        perMonth: {
            type: Number,
            required: [true, 'Please provide your monthly rate']
        }
    },
    preferredMode: {
        type: String,
        enum: ['online', 'home', 'both'],
        required: [true, 'Please specify your preferred mode of teaching']
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teacher', teacherSchema); 