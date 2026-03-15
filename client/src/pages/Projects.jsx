import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaLongArrowAltRight } from 'react-icons/fa';
import ProjectSlideshow from '../components/ProjectSlideshow';
import './Projects.css';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [allProjects, setAllProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', label: 'All Projects' }]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          // Map database categories to button format
          const dbCategories = data.data.map(cat => ({
            id: cat.name,
            label: cat.displayName || cat.name.charAt(0).toUpperCase() + cat.name.slice(1).replace(/-/g, ' ')
          }));
          setCategories([{ id: 'all', label: 'All Projects' }, ...dbCategories]);
        } else {
          // Use default categories if database is empty
          setCategories([
            { id: 'all', label: 'All Projects' },
            { id: 'residential', label: 'Residential' },
            { id: 'commercial', label: 'Commercial' },
            { id: 'art-craft', label: 'Art & Craft' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use default categories on error
        setCategories([
          { id: 'all', label: 'All Projects' },
          { id: 'residential', label: 'Residential' },
          { id: 'commercial', label: 'Commercial' },
          { id: 'art-craft', label: 'Art & Craft' },
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setAllProjects(data.data);
        } else {
          // Fallback to static projects if database is empty
          setAllProjects(staticProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setAllProjects(staticProjects);
      }
    };

    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Static fallback projects
  const staticProjects = [
    {
      _id: '1',
      title: 'Luxury Villa Interiors',
      category: 'residential',
      description: 'Coimbatore, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1974&auto=format&fit=crop',
    },
    {
      _id: '2',
      title: 'Modern Tech Office',
      category: 'commercial',
      description: 'Bangalore, Karnataka',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    },
    {
      _id: '3',
      title: 'Handcrafted Wall Art',
      category: 'art-craft',
      description: 'Erode, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop',
    },
    {
      _id: '4',
      title: 'Contemporary Kitchen',
      category: 'residential',
      description: 'Chennai, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop',
    },
    {
      _id: '5',
      title: 'Boutique Showroom',
      category: 'commercial',
      description: 'Salem, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1541575765-8857d47453f2?q=80&w=2000&auto=format&fit=crop',
    },
    {
      _id: '6',
      title: 'Master Bedroom Suite',
      category: 'residential',
      description: 'Erode, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2070&auto=format&fit=crop',
    },
    {
      _id: '7',
      title: 'Minimalist Living',
      category: 'residential',
      description: 'Trichy, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1628151016027-e81882d27771?q=80&w=2000&auto=format&fit=crop',
    },
    {
      _id: '8',
      title: 'Executive Cabin',
      category: 'commercial',
      description: 'Coimbatore, Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1504384308090-c54be3855091?q=80&w=2000&auto=format&fit=crop',
    },
  ];

  // Filter projects when category changes
  useEffect(() => {
    setIsAnimating(true);
    const filtered = activeCategory === 'all'
      ? allProjects
      : allProjects.filter(p => p.category === activeCategory);

    // Small delay for animation effect
    const timer = setTimeout(() => {
      setVisibleProjects(filtered);
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, allProjects]);

  // Handle view project click
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSlideshowOpen(true);
  };

  // Handle close slideshow
  const handleCloseSlidshow = () => {
    setSlideshowOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <div className="projects-page">
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Our Projects</h1>
          <p className="hero-subtitle">Crafted spaces that define excellence &amp; luxury</p>
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Projects</span>
          </div>
        </div>
      </section>

      {/* Projects Content */}
      <section className="projects-content">
        <div className="container">

          {/* Category Filter */}
          <div className="filter-container">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className={`projects-grid ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            {visibleProjects.map((project) => (
              <div key={project._id} className="project-card-premium">
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="overlay-content">
                      <span className="project-badge">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p className="project-app-desc">{project.description}</p>
                      <button className="view-project-btn" onClick={() => handleViewProject(project)}>
                        View Project <FaLongArrowAltRight />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="project-meta-bar">
                  <div className="meta-item">
                    <FaMapMarkerAlt /> {project.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {visibleProjects.length === 0 && !isAnimating && (
            <div className="empty-projects">
              <p>No projects found in this category coming soon.</p>
            </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="projects-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Have a project in mind?</h2>
            <p>Let's collaborate to create something extraordinary for your space.</p>
            <Link to="/reachus" style={{ textDecoration: 'none' }}>
              <button className="btn-cta-gold">Get Free Consultation</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Slideshow */}
      <ProjectSlideshow isOpen={slideshowOpen} project={selectedProject} onClose={handleCloseSlidshow} />
    </div>
  );
};

export default Projects;
