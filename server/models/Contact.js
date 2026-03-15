const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      lowercase: true,
    },
    purpose: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please provide a mobile number'],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: 'Please provide a valid 10-digit mobile number',
      },
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
