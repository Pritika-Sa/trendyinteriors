import React from 'react';
import PropTypes from 'prop-types';

/**
 * PremiumSectionHeader Component
 * 
 * A reusable, premium section header component that provides consistent styling
 * across all sections of the interior design website.
 * 
 * Features:
 * - Decorative section name with gold accent
 * - Large, elegant main title
 * - Optional subtitle or description
 * - Consistent spacing and typography
 * - Smooth entrance animations
 * 
 * @param {string} sectionName - Small, uppercase label (e.g., "OUR EXPERTISE")
 * @param {string} title - Large, main heading (e.g., "What We Do Best")
 * @param {string} subtitle - Optional description text
 * @param {string} alignment - "center" or "left" (default: "center")
 * @param {boolean} showDecorativeLine - Show decorative line (default: true)
 */
const PremiumSectionHeader = ({
  sectionName,
  title,
  subtitle,
  alignment = 'center',
  showDecorativeLine = true
}) => {
  return (
    <div className={`premium-section-header premium-section-header-${alignment}`}>
      {/* Section Name with Side Lines */}
      {sectionName && (
        <div className="section-name">
          {showDecorativeLine && <div className="section-name-line-left"></div>}
          <span className="section-name-text">{sectionName}</span>
          {showDecorativeLine && <div className="section-name-line-right"></div>}
        </div>
      )}

      {/* Main Title */}
      {title && (
        <h2 className="premium-title">
          {title}
        </h2>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="premium-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
};

PremiumSectionHeader.propTypes = {
  sectionName: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  alignment: PropTypes.oneOf(['center', 'left']),
  showDecorativeLine: PropTypes.bool
};

export default PremiumSectionHeader;
