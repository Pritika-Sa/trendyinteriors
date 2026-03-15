const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            trim: true,
            maxlength: 500,
        },
        icon: {
            type: String,
            required: [true, 'Please provide an icon (emoji or icon name)'],
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
