import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, getConventField } from '../../translations';

const NextWeek = ({ fixtures, convents, currentWeek, onContinue }) => {
  const { language } = useLanguage();

  // Get the round/fixtures for the week that just finished
  const roundIdx = currentWeek - 1;
  const round = fixtures[roundIdx];

  if (!round) {
    return (
      <div className="next-week">
        <h2>{getTranslation('noResults', language)}</h2>
        <button className="continue-button" onClick={onContinue}>
          {getTranslation('continue', language)}
        </button>
      </div>
    );
  }

  return (
    <div className="next-week">
      <h2>{getTranslation('week', language)} {currentWeek}: {getTranslation('results', language)}</h2>
      <div className="results-list">
        {round.matches.map((match, idx) => {
          const homeConvent = convents.find(c => c.id === match.home);
          const awayConvent = convents.find(c => c.id === match.away);

          if (!homeConvent || !awayConvent) return null;

          const homeName = getConventField(homeConvent, 'name', language);
          const awayName = getConventField(awayConvent, 'name', language);

          const resultLabel = match.homeScore > match.awayScore
            ? getTranslation('homeWins', language)
            : match.awayScore > match.homeScore
            ? getTranslation('awayWins', language)
            : getTranslation('tie', language);
          const resultClass = match.homeScore > match.awayScore
            ? 'home-win'
            : match.awayScore > match.homeScore
            ? 'away-win'
            : 'tie';

          return (
            <div key={idx} className="match-card">
              <div className="match-teams">
                <span className="team-name">{homeName}</span>
                <span className="vs">VS</span>
                <span className="team-name">{awayName}</span>
              </div>
              <div className={`match-result ${resultClass}`}>
                <span className="result-label">{resultLabel}</span>
                <span className="result-score">{match.homeScore} - {match.awayScore}</span>
              </div>
            </div>
          );
        })}
      </div>
      <button className="continue-button" onClick={onContinue}>
        {getTranslation('continue', language)}
      </button>
    </div>
  );
};

export default NextWeek;
