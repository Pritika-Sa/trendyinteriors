import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaQuoteLeft, FaShieldAlt, FaStar } from 'react-icons/fa';
import ContactForm from '../components/ContactForm';
import './GiveTestimonial.css';

const GiveTestimonial = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="give-testimonial-page">
      {/* Hero Section */}
      <section className="testimonial-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Give Testimonial</h1>
          <p className="hero-subtitle">Your words inspire us and help others trust our work</p>
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Give Testimonial</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="give-testimonial-content">
        <div className="container">
          <div className="testimonial-form-wrapper">
            <div className="form-intro">
              <div className="quote-icon-container">
                <FaQuoteLeft />
              </div>
              <h2>Share Your Experience</h2>
              <p>We'd love to hear about your journey with us. How was your experience working with Trendy Interiors?</p>
            </div>

            <div className="testimonial-card-container">
              <ContactForm formType="testimonial" />
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <FaShieldAlt className="badge-icon" />
                <span>Your details are kept private</span>
              </div>
              <div className="divider-dot"></div>
              <div className="trust-badge">
                <FaStar className="badge-icon" />
                <span>Review process ensures quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiveTestimonial;