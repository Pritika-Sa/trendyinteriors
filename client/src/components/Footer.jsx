import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaLock, FaYoutube, FaStore } from 'react-icons/fa';
import ChatBot from './ChatBot';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-logo">TrendyInterios</h3>
          <p className="footer-tagline">Filling the Heart, Not Just Space</p>
          <p className="footer-description">
            Premium interior design solutions that transform spaces into extraordinary living experiences.
          </p>
          <div className="footer-social">
            <a href="https://wa.me/919965299777" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="https://www.youtube.com/@prabul7047" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="http://indiamart.com/trendy-interios/" target="_blank" rel="noopener noreferrer" aria-label="IndiaMART">
              <FaStore />
            </a>
          </div>
          <Link to="/login" className="admin-use-only-link" title="For Admin Use Only">
            <FaLock /> For Admin Use Only
          </Link>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/abouts">About Us</Link>
            </li>
            <li>
              <Link to="/projects">Our Projects</Link>
            </li>
            <li>
              <Link to="/testimonials">Testimonials</Link>
            </li>
            <li>
              <Link to="/give-testimonial">Give Testimonial</Link>
            </li>
            <li>
              <Link to="/reachus">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h3>Our Services</h3>
          <ul>
            <li>Living Room Design</li>
            <li>Modular Kitchen</li>
            <li>Bedroom Interiors</li>
            <li>Office Design</li>
            <li>Wardrobe Solutions</li>
            <li>TV Unit & Paneling</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <p>138, Muthugoundampalayam,</p>
                <p>Sathy-Erode Road, Opp TNK School,</p>
                <p>Kavindapadi, Erode - 638 455</p>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <p>+91 99652 99777</p>
                <p>+91 90803 98889</p>
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <p>trendyinterios@gmail.com</p>
                <p>info@trendyinterios.com</p>
              </div>
            </div>
            <div className="contact-item">
              <FaClock className="contact-icon" />
              <div>
                <p>Mon - Sat: 09:00 AM - 07:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} <span className="brand-name">TrendyInterios</span>. All Rights Reserved.</p>

          <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to Top"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </footer>
  );
};

export default Footer;
