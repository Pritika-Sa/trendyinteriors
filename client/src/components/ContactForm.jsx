import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaTag, FaPhone, FaPen, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './ContactForm.css';

const ContactForm = ({ formType = 'contact' }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    purpose: '',
    mobileNumber: '',
    message: '',
    postalAddress: '',
    testimonialText: '',
    rating: 5
  });

  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let endpoint = '';
      let payload = {};
      let headers = {};

      if (formType === 'contact') {
        endpoint = '/api/contacts';

        const cleanMobile = formData.mobileNumber.replace(/\D/g, '').slice(-10);
        if (cleanMobile.length !== 10) {
          setMessage('Please provide a valid 10-digit mobile number');
          setLoading(false);
          return;
        }

        // Validate message length
        if (formData.message.trim().length < 10) {
          setMessage('Please enter a message with at least 10 characters');
          setLoading(false);
          return;
        }

        payload = {
          name: formData.name,
          email: formData.email,
          purpose: formData.purpose,
          mobileNumber: cleanMobile,
          message: formData.message,
        };

        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } else if (formType === 'testimonial') {
        endpoint = '/api/testimonials';

        // 1. Validate Testimonial Length
        if (formData.testimonialText.trim().length < 20) {
          setMessage('Give testimonial above 20 characters');
          setLoading(false);
          return;
        }

        payload = {
          name: formData.name,
          postalAddress: formData.postalAddress,
          testimonialText: formData.testimonialText,
          rating: Number(formData.rating)
        };

        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      await axios.post(`https://trendyinteriors-1.onrender.com${endpoint}`, payload, { headers });

      setMessage(`Thank you! Your ${formType === 'contact' ? 'message' : 'testimonial'} has been sent successfully.`);
      setFormData({
        name: '',
        email: '',
        purpose: '',
        mobileNumber: '',
        message: '',
        postalAddress: '',
        testimonialText: '',
        rating: 5
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Something went wrong. Please try again later.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="contact-form-premium" onSubmit={handleSubmit}>
      {message && (
        <div className={`form-message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <div className="input-with-icon">
          <FaUser className="input-icon" />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Full Name"
          />
        </div>
      </div>

      {formType === 'contact' && (
        <>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose</label>
            <div className="input-with-icon">
              <FaTag className="input-icon" />
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="select-input"
              >
                <option value="">Select a purpose</option>
                <option value="Home Interior">Home Interior</option>
                <option value="Office Interior">Office Interior</option>
                <option value="Modular Kitchen">Modular Kitchen</option>
                <option value="Renovation">Renovation</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
            </div>
          </div>
        </>
      )}

      {formType === 'testimonial' && (
        <>
          <div className="form-group">
            <label htmlFor="postalAddress">Location / Project</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                id="postalAddress"
                name="postalAddress"
                value={formData.postalAddress}
                onChange={handleChange}
                required
                placeholder="e.g. Dream Villa, Erode"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Your Rating</label>
            <div className="star-rating" style={{ display: 'flex', gap: '5px', padding: '5px 0' }}>
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      checked={formData.rating === ratingValue}
                      onChange={() => setFormData(prev => ({ ...prev, rating: ratingValue }))}
                      style={{ display: 'none' }}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= (hover || formData.rating) ? "#ffc107" : "#e4e5e9"}
                      size={28}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setFormData(prev => ({ ...prev, rating: ratingValue }))}
                      style={{ transition: 'color 200ms' }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}

      {formType === 'contact' && (
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              placeholder="10-digit mobile number"
              pattern="\d{10}"
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message">
          {formType === 'contact' ? 'Message' : 'Your Experience'}
        </label>
        <div className="input-with-icon textarea-wrapper">
          <FaPen className="input-icon textarea-icon" />
          <textarea
            id="message"
            name={formType === 'contact' ? 'message' : 'testimonialText'}
            value={formType === 'contact' ? formData.message : formData.testimonialText}
            onChange={handleChange}
            required
            placeholder={
              formType === 'contact'
                ? 'Tell us about your requirements...'
                : 'Share your story with us...'
            }
            rows="5"
          />
        </div>
        {formType === 'contact' && (
          <small className="char-count">
            {formData.message.length < 10 ? (
              <span style={{ color: '#e74c3c' }}>
                Minimum 10 characters required ({formData.message.length}/10)
              </span>
            ) : (
              <span style={{ color: '#27ae60' }}>
                Character count: {formData.message.length}
              </span>
            )}
          </small>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="submit-btn-premium"
      >
        {loading ? 'Sending...' : formType === 'contact' ? 'Send Message →' : 'Submit Testimonial'}
      </button>

      {formType === 'contact' && (
        <p className="privacy-note">We respect your privacy. Your info is safe with us.</p>
      )}
    </form>
  );
};

export default ContactForm;
