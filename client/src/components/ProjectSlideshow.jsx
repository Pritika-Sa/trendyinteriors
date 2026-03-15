import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './ProjectSlideshow.css';

const ProjectSlideshow = ({ isOpen, project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Get images array or use single image
  const images = Array.isArray(project?.images) && project.images.length > 0
    ? project.images
    : project?.image ? [project.image] : [];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlay(false);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlay(false);
  }, [images.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  }, []);

  // Auto-play slideshow
  useEffect(() => {
    if (!isOpen || images.length <= 1 || !isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isOpen, isAutoPlay, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, images.length, goToNext, goToPrevious, onClose]);

  if (!isOpen || !project || images.length === 0) return null;

  return (
    <div className="slideshow-overlay" onClick={onClose}>
      <div className="slideshow-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="slideshow-close" onClick={onClose} aria-label="Close slideshow">
          <FaTimes />
        </button>

        {/* Project Title */}
        <div className="slideshow-header">
          <h2>{project.title}</h2>
          <p className="slideshow-subtitle">{project.description}</p>
        </div>

        {/* Main Image Display */}
        <div className="slideshow-main">
          <img src={images[currentIndex]} alt={`${project.title} - ${currentIndex + 1}`} />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button className="slideshow-arrow prev-arrow" onClick={goToPrevious} aria-label="Previous image">
                <FaChevronLeft />
              </button>
              <button className="slideshow-arrow next-arrow" onClick={goToNext} aria-label="Next image">
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="slideshow-counter">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="slideshow-thumbnails">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                style={{ backgroundImage: `url(${img})` }}
                role="button"
                tabIndex={0}
                aria-label={`Go to image ${index + 1}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') goToSlide(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Playback Control */}
        {images.length > 1 && (
          <div className="slideshow-controls">
            <button
              className={`control-btn ${isAutoPlay ? 'playing' : 'paused'}`}
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              aria-label={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isAutoPlay ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSlideshow;
