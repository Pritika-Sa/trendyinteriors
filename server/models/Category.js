const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a category name'],
            trim: true,
            lowercase: true,
            unique: true,
            maxlength: 50,
        },
        displayName: {
            type: String,
            required: [true, 'Please provide a display name'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
