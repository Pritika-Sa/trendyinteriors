const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String, // Storing image URL (can be base64 or external URL)
        required: [true, 'Please add an image']
    },
    images: {
        type: [String], // Gallery images for slideshow
        default: [],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        trim: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
