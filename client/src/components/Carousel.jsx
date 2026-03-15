import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Carousel.css';

const Carousel = ({ slides, autoPlay = true, interval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, autoPlay, interval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) {
    return <div>No slides available</div>;
  }

  const activeSlide = slides[currentSlide];

  return (
    <div className="carousel">
      <div className="carousel-container">
        <button className="carousel-button prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>

        <div className="carousel-slide">
          <img
            src={activeSlide.image}
            alt={activeSlide.title || 'Interior design slide'}
          />
          {(activeSlide.title || activeSlide.description) && (
            <div className="carousel-overlay">
              {activeSlide.title && <h2>{activeSlide.title}</h2>}
              {activeSlide.description && <p>{activeSlide.description}</p>}
            </div>
          )}
        </div>

        <button className="carousel-button next" onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </div>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
