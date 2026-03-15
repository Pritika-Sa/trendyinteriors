import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './DesignCarousel.css';

const DesignCarousel = ({ designs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || designs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % designs.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, designs.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    // Resume autoplay after 2 seconds of no interaction
    setTimeout(() => setAutoPlay(true), 2000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % designs.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 2000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + designs.length) % designs.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 2000);
  };

  if (designs.length === 0) return null;

  return (
    <section className="design-carousel-section">
      <div className="carousel-header">
        <h4 className="carousel-label">OUR CREATIVITY IN ACTION</h4>
        <h2>Our Design Gallery</h2>
        <div className="carousel-divider"></div>
      </div>

      <div className="design-carousel-container">
        <div className="design-carousel-wrapper">
          <div className="design-carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {designs.map((design, index) => (
              <div key={design._id || index} className="design-carousel-slide">
                <img src={design.imageUrl} alt={design.title} />
                <div className="design-slide-overlay">
                  <h3>{design.title}</h3>
                  {design.description && <p>{design.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button className="design-carousel-btn design-carousel-btn-prev" onClick={prevSlide} aria-label="Previous slide">
          <FaChevronLeft />
        </button>
        <button className="design-carousel-btn design-carousel-btn-next" onClick={nextSlide} aria-label="Next slide">
          <FaChevronRight />
        </button>

        {/* Indicators/Dots */}
        <div className="design-carousel-indicators">
          {designs.map((_, index) => (
            <button
              key={index}
              className={`design-carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesignCarousel;
