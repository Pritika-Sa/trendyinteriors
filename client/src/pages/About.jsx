import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTrophy, FaSmile, FaStopwatch, FaCheckCircle, FaQuoteLeft,
  FaLinkedin, FaInstagram, FaPhone, FaEye, FaBullseye
} from 'react-icons/fa';
import DesignCarousel from '../components/DesignCarousel';
import './About.css';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTeamMembers();
    fetchDesigns();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team-members');
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    }
  };

  const fetchDesigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/designs');
      const data = await response.json();
      if (data.success) {
        setDesigns(data.data);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
      setDesigns([]);
    }
  };

  const stats = [
    { number: '10+', label: 'Design Awards', icon: <FaTrophy /> },
    { number: '250+', label: 'Happy Clients', icon: <FaSmile /> },
    { number: '400+', label: 'Hours of Craftsmanship', icon: <FaStopwatch /> },
    { number: '150+', label: 'Projects Completed', icon: <FaCheckCircle /> },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>About Us</h1>
          <div className="hero-divider"></div>
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">About</span>
          </div>
        </div>
      </section>

      {/* About Interior Content */}
      <section className="about-main-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text-content">
              <h4 className="section-label">WHO WE ARE</h4>
              <h2>Crafting Spaces, <br /><span className="text-gold">Building Dreams.</span></h2>
              <p className="lead-text">
                Trendy Interiors is one of the premier design firms in Erode, known for our exquisite craftsmanship and attention to detail.
              </p>
              <p className="body-text">
                With a passion for creating spaces that are both functional and beautiful, we have established ourselves as leaders in residential and commercial interior design. Our journey begins with understanding your vision and translating it into a reality that exceeds expectations. From modern minimalist homes to luxurious office suites, we handle every project with the same level of dedication and artistic flair.
              </p>

              <div className="key-highlights">
                <div className="highlight-item">
                  <span className="highlight-check">✓</span>
                  <span>10+ Years of Design Excellence</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-check">✓</span>
                  <span>Certified Professional Team</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-check">✓</span>
                  <span>End-to-End Project Management</span>
                </div>
              </div>
            </div>

            <div className="about-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop"
                alt="Trendy Interiors Office"
                className="about-feature-img"
              />
              <div className="experience-badge">
                <span className="years">10+</span>
                <span className="text">Years of<br />Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission-section">
        <div className="container">
          <div className="vm-grid">
            <div className="vm-card vision">
              <div className="vm-icon"><FaEye /></div>
              <h3>Our Vision</h3>
              <p>To be the globally recognized leader in innovative interior design, setting new benchmarks for luxury, sustainability, and creative excellence in every space we touch.</p>
            </div>
            <div className="vm-card mission">
              <div className="vm-icon"><FaBullseye /></div>
              <h3>Our Mission</h3>
              <p>To deliver exceptional design solutions that enhance the quality of life for our clients. We honestly serve with integrity, treating every project as a masterpiece and every client as family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="quote-banner">
        <div className="container">
          <div className="quote-content">
            <FaQuoteLeft className="quote-icon-large" />
            <blockquote>
              "We don't just design spaces; we curate experiences. Our philosophy is to treat every workspace like a temple of creativity and every home like a sanctuary of peace."
            </blockquote>
            <cite>- Trendy Interiors Philosophy</cite>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <DesignCarousel designs={designs} />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid-premium">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card-premium">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header-center">
            <h4 className="section-label">MEET THE EXPERTS</h4>
            <h2>Our Creative Team</h2>
            <div className="divider-center"></div>
            <p className="section-desc">The talented minds behind our extraordinary designs.</p>
          </div>

          <div className="team-grid-premium">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member._id} className="team-card-premium">
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                    <div className="team-social-overlay">
                      {member.linkedin && member.linkedin !== '#' && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"><FaLinkedin /></a>
                      )}
                      {member.instagram && member.instagram !== '#' && (
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" title="Instagram"><FaInstagram /></a>
                      )}
                      {member.mobilePhone && (
                        <a href={`tel:${member.mobilePhone}`} title="Call"><FaPhone /></a>
                      )}
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state"><p>No team members found</p></div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
