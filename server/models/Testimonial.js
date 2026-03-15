const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    postalAddress: {
      type: String,
      required: [true, 'Please provide a postal address'],
      trim: true,
      maxlength: 200,
    },
    mobileNumber: {
      type: String,
      required: false,
      default: '',
      validate: {
        validator: function (v) {
          // If empty, it's valid (optional field)
          if (!v || v.trim() === '') return true;
          // If provided, must be 10 digits
          return /^\d{10}$/.test(v);
        },
        message: 'Please provide a valid 10-digit mobile number',
      },
    },
    testimonialText: {
      type: String,
      required: [true, 'Please provide a testimonial'],
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
