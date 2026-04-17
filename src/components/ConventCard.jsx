import React from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation, getConventField, translateAttribute } from '../translations';

const ConventCard = ({ convent, isSelected }) => {
  const { language } = useLanguage();

  // Get translated content
  const name = getConventField(convent, 'name', language);
  const description = getConventField(convent, 'description', language);
  const specialTrait = getConventField(convent, 'special_trait', language);
  const arenaRule = getConventField(convent, 'arena_rule', language);

  // Get raw attribute keys and translate them
  const { stat_focus, nature } = convent;
  const statFocusTranslated = translateAttribute(stat_focus, language);
  const natureTranslated = translateAttribute(nature, language);

  // Colors
  const primaryColor = convent.colors.primary;
  const secondaryColor = convent.colors.secondary;

  // Helper functions
  const getLightColor = (color, opacity = 0.05) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };

  const lightPrimary = getLightColor(primaryColor, 0.03);

  const getTextColor = (bgColor) => {
    if (!bgColor.startsWith('#')) return '#000000';
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
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
        <h2 style={{ color: textColor }}>{name}</h2>
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
        <p className="convent-description">{description}</p>

        <div className="convent-stats">
          <div className="stat-item">
            <span className="stat-label">{getTranslation('statFocus', language)}:</span>
            <span className="stat-value">{statFocusTranslated}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{getTranslation('nature', language)}:</span>
            <span className="stat-value">{natureTranslated}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{getTranslation('specialTrait', language)}:</span>
            <span className="stat-value">{specialTrait}</span>
          </div>
        </div>

        <div className="convent-arena-rule">
          <h3 style={{ color: textColor }}>{getTranslation('arenaRule', language)}:</h3>
          <p>{arenaRule}</p>
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
