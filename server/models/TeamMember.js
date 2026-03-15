const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: 100,
        },
        role: {
            type: String,
            required: [true, 'Please provide a role'],
            trim: true,
            maxlength: 100,
        },
        image: {
            type: String,
            required: [true, 'Please provide an image URL'],
            trim: true,
        },
        linkedin: {
            type: String,
            trim: true,
        },
        instagram: {
            type: String,
            trim: true,
        },
        mobilePhone: {
            type: String,
            required: [true, 'Please provide mobile phone number'],
            trim: true,
            match: [/^\d{10}$/, 'Mobile phone must be exactly 10 digits'],
        },
        twitter: {
            type: String,
            trim: true,
            default: '',
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
