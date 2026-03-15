import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaClock,
  FaYoutube,
  FaStore
} from 'react-icons/fa';
import ContactForm from '../components/ContactForm';
import './ReachUs.css';

const ReachUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="reach-us-page">

      {/* Hero */}
      <section className="reach-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Reach Us</h1>
          <p className="hero-subtitle">
            Let's start the conversation about your dream space
          </p>
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Contact</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="reach-us-content">
        <div className="container">
          <div className="reach-us-wrapper">

            {/* Form */}
            <div className="form-column">
              <div className="form-card">
                <div className="form-header">
                  <h3>Send us a Message</h3>
                  <p>Fill out the form below and we will get back to you within 24 hours.</p>
                </div>
                <ContactForm formType="contact" />
              </div>
            </div>

            {/* Info */}
            <div className="info-column">
              <div className="info-card">
                <h2>Contact Information</h2>
                <p className="info-intro">
                  We'd love to hear from you. Visit us at our office or reach out via phone or email.
                </p>

                <div className="contact-list">

                  {/* OFFICE */}
                  <div className="contact-item">
                    <div className="icon-box"><FaMapMarkerAlt /></div>
                    <div className="details">
                      <div className="detail-text">
                        <p>138, Muthugoundampalayam, Sathy-Erode Road,</p>
                        <p>Opp. TNK School, Kavindapadi,</p>
                        <p>Erode, Tamilnadu - 638 455</p>
                      </div>
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="contact-item">
                    <div className="icon-box"><FaPhoneAlt /></div>
                    <div className="details">
                      <div className="detail-text">
                        <p><a href="tel:+919965299777">+91 99652 99777</a></p>
                      </div>
                    </div>
                  </div>

                  {/* WHATSAPP */}
                  <div className="contact-item">
                    <div className="icon-box whatsapp-icon"><FaWhatsapp /></div>
                    <div className="details">
                      <div className="detail-text">
                        <p><a href="https://wa.me/919080398889" target="_blank" rel="noopener noreferrer">+91 90803 98889</a></p>
                      </div>
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="contact-item">
                    <div className="icon-box"><FaEnvelope /></div>
                    <div className="details">
                      <div className="detail-text">
                        <p><a href="mailto:trendyinterios@gmail.com">trendyinterios@gmail.com</a></p>
                        <p><a href="mailto:info@trendyinterios.com">info@trendyinterios.com</a></p>
                      </div>
                    </div>
                  </div>

                  {/* HOURS */}
                  <div className="contact-item">
                    <div className="icon-box"><FaClock /></div>
                    <div className="details">
                      <div className="detail-text">
                        <p>09:00 AM - 07:00 PM</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* SOCIAL */}
                <div className="social-connect">
                  <h4>Follow Us</h4>
                  <div className="social-icons">
                    <a
                      href="https://wa.me/919965299777"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link whatsapp"
                      title="WhatsApp"
                    >
                      <FaWhatsapp />
                    </a>
                    <a
                      href="https://www.youtube.com/@prabul7047"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link youtube"
                      title="YouTube"
                    >
                      <FaYoutube />
                    </a>
                    <a
                      href="http://indiamart.com/trendy-interios/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link indiamart"
                      title="IndiaMART"
                    >
                      <FaStore />
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="reach-us-map">
        <div className="map-content">
          <div className="map-header">
            <h2>Visit Our Studio</h2>
            <p>Experience our designs in person. Located in the heart of Erode.</p>
          </div>
          <div className="map-container">
            <iframe
              title="TrendyInterios Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3904.5617897384234!2d77.580962!3d11.4153444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba91545f4683209%3A0x8065716f2afd9e81!2sTRENDY%20INTERIOS!5e0!3m2!1sen!2sin!4v1678000000000"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ReachUs;
