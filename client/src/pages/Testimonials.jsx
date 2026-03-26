import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaQuoteLeft, FaStar, FaPenNib, FaUserCircle } from 'react-icons/fa';
import './Testimonials.css';

// Hardcoded premium samples for display (fallback only)
const sampleTestimonials = [
  {
    _id: '1',
    name: 'Jennifer Winget',
    role: 'Homeowner',
    location: 'Mumbai, India',
    rating: 5,
    testimonialText: "The team at Trendy Interiors transformed our villa into a dream home. The attention to detail in the living room and modular kitchen design was simply outstanding. Highly recommended!",
    postalAddress: 'Mumbai, India',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: '2',
    name: 'Dr. Rajesh Koothrappali',
    role: 'Clinic Director',
    location: 'Bangalore, India',
    rating: 5,
    testimonialText: "We wanted a waiting room that felt calm and luxurious for our patients. The design they proposed was perfect. Even after 2 years, we still get compliments on the interior.",
    postalAddress: 'Bangalore, India',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: '3',
    name: 'Ananya Pandey',
    role: 'Fashion Designer',
    location: 'Chennai, India',
    rating: 4,
    testimonialText: "Creative and professional. They understood my requirement for a minimalist studio space and delivered exactly what I envisioned. The color palette selection was spot on.",
    postalAddress: 'Chennai, India',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  {
    _id: '4',
    name: 'Vikram Singh',
    role: 'CEO, TechCorp',
    location: 'Hyderabad, India',
    rating: 5,
    testimonialText: "From the initial consultation to the final handover, the experience was seamless. Their craftsmanship in woodwork and custom furniture is world-class.",
    postalAddress: 'Hyderabad, India',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  }
];

const Testimonials = () => {
  const navigate = useNavigate();
  const [displayTestimonials, setDisplayTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('https://trendyinteriors-1.onrender.com/api/testimonials');
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // Get latest 9 testimonials only
          const latest9 = response.data.data.slice(0, 9);
          setDisplayTestimonials(latest9);
        } else {
          setDisplayTestimonials(sampleTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback to samples on error
        setDisplayTestimonials(sampleTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="testimonials-page">
      {/* Hero Section */}
      <section className="testimonials-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Testimonials</h1>
          <p className="hero-subtitle">Real stories from people who trusted us with their dreams</p>
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Testimonials</span>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="trust-indicators">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-number">4.9/5</span>
              <span className="trust-label">Average Rating</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-number">250+</span>
              <span className="trust-label">Happy Clients</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-number">10+</span>
              <span className="trust-label">Years of Trust</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="testimonials-content">
        <div className="container">
          <div className="section-header-center">
            <h2>What Our Clients Say</h2>
            <div className="divider-center"></div>
            <p className="section-intro-text">
              The trendy is always grateful to its clients who have made our success story possible.
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading stories...</p>
            </div>
          ) : (
            <div className="testimonials-grid-3x3">
              {displayTestimonials.map((t, index) => (
                <div key={t._id || index} className="testimonial-card-premium" style={{ animationDelay: `${index * 0.1}s` }}>
                  <FaQuoteLeft className="quote-icon-bg" />
                  <div className="testimonial-body">
                    <div className="rating-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className={i < (Number(t.rating) || 5) ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>
                    <p className="testimonial-quote">"{t.testimonialText || t.text}"</p>
                  </div>

                  <div className="testimonial-footer">
                    <div className="client-avatar">
                      {t.image ? (
                        <img src={t.image} alt={t.name} />
                      ) : (
                        <FaUserCircle />
                      )}
                    </div>
                    <div className="client-info">
                      <h4>{t.name}</h4>
                      <span>{t.element || t.role || 'Client'} • {t.postalAddress || t.location || 'India'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State Fallback (if no testimonials) */}
          {!loading && displayTestimonials.length === 0 && (
            <div className="no-testimonials">
              <div className="empty-icon">💬</div>
              <h3>No stories yet</h3>
              <p>Be the first one to share your experience with us.</p>
            </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="testimonial-cta">
        <div className="container">
          <div className="cta-box">
            <div className="cta-text">
              <h3>Loved our work?</h3>
              <p>
                Your feedback helps us create better experiences. Share your story
                with the world.
              </p>
            </div>

            <div className="cta-action">
              <button
                className="btn-gold-outline"
                onClick={() => navigate("/give-testimonial")}
              >
                <FaPenNib className="btn-icon" /> Give Testimonial
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
