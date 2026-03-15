import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaPalette, FaFileInvoiceDollar, FaClipboardCheck, FaTruck, FaTools, FaCheckCircle, FaKey } from 'react-icons/fa';
import Carousel from '../components/Carousel';
import PremiumSectionHeader from '../components/PremiumSectionHeader';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import './PremiumSectionHeader.css';
import './HomeEnhancements.css';

const Home = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop',
      title: 'LUXURY LIVING SPACES',
      description: 'Transform your home into a masterpiece of elegance and comfort',
    },
    {
      image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=2070&auto=format&fit=crop',
      title: 'MODULAR KITCHEN DESIGN',
      description: 'Elegant, clutter-free kitchens with smart storage and premium finishes',
    },
    {
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop',
      title: 'BEDROOM SANCTUARIES',
      description: 'Relaxing master bedrooms with warm lighting and sophisticated design',
    },
    {
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop',
      title: 'PROFESSIONAL WORKSPACES',
      description: 'Modern office interiors designed for productivity and inspiration',
    },
  ];

  const defaultServices = [
    {
      title: 'Interior Design',
      description:
        'Transform your space with our expert interior design services. We create personalized environments that reflect your style and enhance your lifestyle with meticulous attention to detail.',
      icon: '🏛️',
    },
    {
      title: 'Modern Design',
      description:
        'Experience contemporary aesthetics with our modern design solutions. We blend functionality with cutting-edge style to create spaces that are both beautiful and practical.',
      icon: '✨',
    },
    {
      title: 'Planning & Consultation',
      description:
        'Comprehensive planning services from concept to completion. Our expert consultants guide you through every step, ensuring your vision becomes reality with precision and care.',
      icon: '📐',
    },
  ];

  const staticProjects = [
    {
      title: 'Luxury Kitchen Interior',
      description: 'Erode, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop',
    },
    {
      title: 'Contemporary Living Room',
      description: 'Chennai, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1974&auto=format&fit=crop',
    },
    {
      title: 'Master Bedroom Suite',
      description: 'Coimbatore, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2070&auto=format&fit=crop',
    },
    {
      title: 'Wardrobe & Dressing',
      description: 'Erode, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069&auto=format&fit=crop',
    },
    {
      title: 'TV Unit with Paneling',
      description: 'Salem, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    },
    {
      title: 'Modern Office Space',
      description: 'Bangalore, Karnataka',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects?limit=6');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setProjects(data.data);
        } else {
          // Fallback to static if no projects in DB
          setProjects(staticProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(staticProjects);
      }
    };

    const fetchApprovedTestimonials = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/testimonials');
        const data = await response.json();
        if (data.success) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setServices(data.data);
        } else {
          // Fallback to default services if no data in DB
          setServices(defaultServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(defaultServices);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchLatestProjects();
    fetchApprovedTestimonials();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const designProcess = [
    { step: 'Meet Designer', icon: <FaHandshake />, description: 'Initial consultation to understand your vision' },
    { step: 'Design Concepts', icon: <FaPalette />, description: 'Creative design proposals tailored to you' },
    { step: 'Finalize Costing', icon: <FaFileInvoiceDollar />, description: 'Transparent pricing and budget planning' },
    { step: 'Place Order', icon: <FaClipboardCheck />, description: 'Confirm your design and specifications' },
    { step: 'Material Delivery', icon: <FaTruck />, description: 'Premium materials delivered to site' },
    { step: 'Implementation', icon: <FaTools />, description: 'Expert execution by skilled craftsmen' },
    { step: 'Quality Check', icon: <FaCheckCircle />, description: 'Rigorous quality control at every stage' },
    { step: 'Site Handover', icon: <FaKey />, description: 'Final walkthrough and project completion' },
  ];

  return (
    <div className="home-page">
      {/* Hero Carousel Section */}
      <section className="hero-section">
        <Carousel slides={heroSlides} autoPlay={true} interval={5000} />
        <div className="tagline">
          {user && (
            <div className="welcome-message">
              <p className="welcome-text">Welcome to Trendy Interiors! 👋</p>
            </div>
          )}
          <h1>Filling the Heart, Not Just Space</h1>
          <p>Premium Interior Design Solutions for Modern Living</p>
          <div className="hero-cta-buttons">
            <Link to="/projects" className="btn-primary" style={{ textDecoration: 'none' }}>
              View Projects
            </Link>
            <Link to="/reachus" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Get Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="services-section">
        <div className="container">
          <PremiumSectionHeader
            sectionName="OUR EXPERTISE"
            title="What We Do Best"
            subtitle="Crafting exceptional spaces with passion and precision"
          />
          <div className="services-grid">
            {defaultServices.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Projects Section */}
      <section className="projects-section">
        <div className="container">
          <PremiumSectionHeader
            sectionName="PORTFOLIO"
            title="Latest Projects"
            subtitle="Explore our portfolio of stunning interior transformations"
          />
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <img src={project.image} alt={project.title} />
                <h3>
                  {project.title}
                  <span className="project-location">{project.description}</span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Design Journey Section */}
      <section className="design-process-section">
        <div className="container">
          <PremiumSectionHeader
            sectionName="PROCESS"
            title="Our Design Journey"
            subtitle="From Concept to Completion - A Seamless Experience"
          />
          <div className="design-process-timeline">
            {designProcess.map((item, index) => (
              <div key={index} className="process-step">
                <div className="step-content-wrapper">
                  <div className="step-icon-wrapper">
                    <div className="step-icon">{item.icon}</div>
                    <div className="step-number">{index + 1}</div>
                  </div>
                  <div className="process-step-info">
                    <h4>{item.step}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
                {index < designProcess.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="testimonials-section">
        <div className="container">
          <PremiumSectionHeader
            sectionName="TESTIMONIALS"
            title="What Our Clients Say"
            subtitle="Trusted by 200+ happy homeowners across India"
          />

          <div className="testimonials-carousel">
            {loadingTestimonials ? (
              <p className="loading-text" style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Loading testimonials...</p>
            ) : testimonials.length === 0 ? (
              // Fallback to static testimonials if DB is empty
              [
                {
                  name: 'Priya Sharma',
                  location: 'Chennai, Tamil Nadu',
                  text: 'TrendyInterios transformed our home into a masterpiece! Their attention to detail and creative design solutions exceeded our expectations.',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
                },
                {
                  name: 'Rajesh Kumar',
                  location: 'Erode, Tamil Nadu',
                  text: 'Exceptional service from start to finish! The modular kitchen design is both beautiful and functional.',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
                },
                {
                  name: 'Ananya Reddy',
                  location: 'Coimbatore, Tamil Nadu',
                  text: "Outstanding craftsmanship and innovative designs! Our bedroom and living room look absolutely stunning.",
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
                }
              ].map((t, idx) => (
                <div key={idx} className="testimonial-card">
                  <div className="quote-icon">"</div>
                  <div className="stars">★★★★★</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="customer-info">
                    <img src={t.image} alt={t.name} className="customer-avatar" />
                    <div className="customer-details">
                      <h4>{t.name}</h4>
                      <p>{t.location}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              testimonials.slice(0, 3).map((t, index) => (
                <div key={t._id || index} className="testimonial-card">
                  <div className="quote-icon">"</div>
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < (Number(t.rating) || 5) ? 'var(--color-gold)' : '#e4e5e9' }}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="testimonial-text">"{t.testimonialText}"</p>
                  <div className="customer-info">
                    <div className="customer-avatar" style={{ background: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div className="customer-details">
                      <h4>{t.name}</h4>
                      <p>{t.postalAddress || 'India'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="trust-badges">
            <div className="trust-badge">
              <div className="badge-icon">🏆</div>
              <div className="badge-text">
                <h3>200+</h3>
                <p>Happy Clients</p>
              </div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">⭐</div>
              <div className="badge-text">
                <h3>4.9/5</h3>
                <p>Average Rating</p>
              </div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">✓</div>
              <div className="badge-text">
                <h3>100%</h3>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="our-services-section">
        <div className="container">
          <PremiumSectionHeader
            sectionName="SERVICES"
            title="Our Interior Solutions"
            subtitle="Comprehensive interior design solutions for every space"
          />
          <div className="services-detail-grid">
            {loadingServices ? (
              <p className="loading-text" style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Loading services...</p>
            ) : services.length === 0 ? (
              <p className="empty-text" style={{ textAlign: 'center', color: 'var(--color-gold)', gridColumn: '1 / -1' }}>No services available</p>
            ) : (
              services.map((service, index) => (
                <div key={service._id || index} className="service-detail">
                  <div className="service-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    {service.icon}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
