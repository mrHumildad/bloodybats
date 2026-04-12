import React from 'react';
import PropTypes from 'prop-types';

const ConventCard = ({ convent, isSelected }) => {
  // Create subtle background colors from the convent colors
  const primaryColor = convent.colors.primary;
  const secondaryColor = convent.colors.secondary;
   
  // Create lighter, more subtle versions for backgrounds
  const getLightColor = (color, opacity = 0.05) => {
    // If it's a hex color, convert to rgba with opacity
    if (color.startsWith('#')) {
      // Parse hex color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // If it's already an rgba or similar, just adjust opacity
    return color;
  };
   
  const lightPrimary = getLightColor(primaryColor, 0.03);
   
  // Function to determine if a color is dark or light
  const getTextColor = (bgColor) => {
    if (!bgColor.startsWith('#')) return '#000000'; // Default to dark for non-hex colors
    
    // Convert hex to RGB
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    // Calculate brightness using relative luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };
   
  const textColor = getTextColor(primaryColor);
   
  return (
    <div 
      className={`convent-card ${isSelected ? 'selected' : ''}`}
      style={{ 
        borderColor: isSelected ? primaryColor : undefined,
        backgroundColor: isSelected ? lightPrimary : undefined
      }}
    >
      <div className="convent-header" style={{ 
        borderBottom: `2px solid ${primaryColor}`,
        backgroundColor: lightPrimary
      }}>
        <h2 style={{ color: textColor }}>{convent.name}</h2>
        <div className="convent-colors">
          <div className="color-primary" style={{ 
            backgroundColor: primaryColor,
            borderColor: secondaryColor
          }}></div>
          <div className="color-secondary" style={{ 
            backgroundColor: secondaryColor,
            borderColor: primaryColor
          }}></div>
        </div>
      </div>
      
      <div className="convent-body">
        <p className="convent-description">{convent.description}</p>
        
        <div className="convent-stats">
          <div className="stat-item">
            <span className="stat-label">Stat Focus:</span>
            <span className="stat-value">{convent.stat_focus}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Nature:</span>
            <span className="stat-value">{convent.nature}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Special Trait:</span>
            <span className="stat-value">{convent.special_trait}</span>
          </div>
        </div>
        
        <div className="convent-arena-rule">
          <h3 style={{ color: textColor }}>Arena Rule:</h3>
          <p>{convent.arena_rule}</p>
        </div>
      </div>
    </div>
  );
};

ConventCard.propTypes = {
  convent: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired
    }).isRequired,
    description: PropTypes.string.isRequired,
    stat_focus: PropTypes.string.isRequired,
    nature: PropTypes.string.isRequired,
    special_trait: PropTypes.string.isRequired,
    arena_rule: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired
};

export default ConventCard;