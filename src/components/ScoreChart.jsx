import React from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const ScoreChart = ({
  score,
  currentInning,
  half,
  innings,
  inningScores,
  hits,
  errors,
  homeTeamName,
  awayTeamName,
  homeColor,
  awayColor
}) => {
  const { language } = useLanguage();
  const homeLabel = homeTeamName || getTranslation('homeTeam', language);
  const awayLabel = awayTeamName || getTranslation('awayTeam', language);

  // Build array of inning numbers
  const inningNumbers = Array.from({ length: innings }, (_, i) => i + 1);

  // Determine if an inning column should be marked as "current"
  const isInningActive = (inning) => {
    return inning === currentInning;
  };

  // For home team, if it's bottom half and game not over, future innings show empty
  // If game ended and home team won, show 'X' for innings they didn't need to bat
  const getCellValue = (team, inning) => {
    if (team === 'home') {
      if (inning > currentInning) return '';
      if (inning === currentInning && half === 'top') return '';
    }
    return inningScores[team][inning - 1] ?? 0;
  };

  return (
    <div className="scoreboard">
      {/* Header Row: Inning numbers + R H E labels */}
      <div className="scoreboard-header">
        <div className="scoreboard-team-label header-empty"></div>
        {inningNumbers.map((inning) => (
          <div
            key={inning}
            className={`inning-header ${isInningActive(inning) ? 'current' : ''}`}
          >
            {inning}
          </div>
        ))}
        <div className="scoreboard-stat-label">R</div>
        <div className="scoreboard-stat-label">H</div>
        <div className="scoreboard-stat-label">E</div>
      </div>

      {/* Away Team Row */}
      <div className={`scoreboard-row ${half === 'top' && isInningActive(currentInning) ? 'active' : ''}`}>
        <div className="scoreboard-team-name away">
          <span className="team-indicator">A</span>
          <span className="team-color-swatch" style={{ backgroundColor: awayColor }}></span>
          {awayLabel}
        </div>
        {inningNumbers.map((inning) => {
          const val = getCellValue('away', inning);
          return (
            <div
              key={`away-${inning}`}
              className={`scoreboard-cell ${isInningActive(inning) ? 'current' : ''}`}
            >
              {val}
            </div>
          );
        })}
        <div className="scoreboard-cell total">{score.away}</div>
        <div className="scoreboard-cell total">{hits.away}</div>
        <div className="scoreboard-cell total">{errors.away}</div>
      </div>

      {/* Home Team Row */}
      <div className={`scoreboard-row ${half === 'bottom' && isInningActive(currentInning) ? 'active' : ''}`}>
        <div className="scoreboard-team-name home">
          <span className="team-indicator">H</span>
          <span className="team-color-swatch" style={{ backgroundColor: homeColor }}></span>
          {homeLabel}
        </div>
        {inningNumbers.map((inning) => {
          const val = getCellValue('home', inning);
          return (
            <div
              key={`home-${inning}`}
              className={`scoreboard-cell ${isInningActive(inning) ? 'current' : ''}`}
            >
              {val}
            </div>
          );
        })}
        <div className="scoreboard-cell total">{score.home}</div>
        <div className="scoreboard-cell total">{hits.home}</div>
        <div className="scoreboard-cell total">{errors.home}</div>
      </div>
    </div>
  );
};

ScoreChart.propTypes = {
  score: PropTypes.shape({
    home: PropTypes.number.isRequired,
    away: PropTypes.number.isRequired,
  }).isRequired,
  currentInning: PropTypes.number.isRequired,
  half: PropTypes.oneOf(['top', 'bottom']).isRequired,
  innings: PropTypes.number.isRequired,
  inningScores: PropTypes.shape({
    home: PropTypes.arrayOf(PropTypes.number).isRequired,
    away: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  hits: PropTypes.shape({
    home: PropTypes.number.isRequired,
    away: PropTypes.number.isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    home: PropTypes.number.isRequired,
    away: PropTypes.number.isRequired,
  }).isRequired,
  homeTeamName: PropTypes.string,
  awayTeamName: PropTypes.string,
  homeColor: PropTypes.string,
  awayColor: PropTypes.string,
};

export default ScoreChart;
