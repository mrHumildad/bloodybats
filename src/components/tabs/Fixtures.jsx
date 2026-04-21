import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, getConventField } from '../../translations';

const Fixtures = ({ fixtures, convents, myId, roundIdx }) => {
  const { language } = useLanguage();
  const [currentRound, setCurrentRound] = useState(roundIdx + 1);

  const totalRounds = fixtures.length;
  const roundData = fixtures.find(r => r.round === currentRound);

  // Helper to get convent name and color by ID
  const getConventDisplay = (id) => {
    const convent = convents.find(c => c.id === id);
    if (!convent) return { name: `Team ${id}`, color: '#ffffff', isMine: false };

    const name = getConventField(convent, 'name', language);
    const color = convent.colors?.primary || '#ffffff';
    const isMine = id === myId;

    return { name, color, isMine };
  };

  const handlePrev = () => {
    setCurrentRound(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentRound(prev => Math.min(totalRounds, prev + 1));
  };

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="fixtures-tab tab">
        <p>No fixtures available.</p>
      </div>
    );
  }

  if (!roundData) {
    return (
      <div className="fixtures-tab tab">
        <p>No round data for round {currentRound}.</p>
      </div>
    );
  }

  return (
    <div className="fixtures-tab tab">
      <div className="round-controls">
        <button
          className="round-button"
          onClick={handlePrev}
          disabled={currentRound === 1}
        >
          ← Prev
        </button>

        <h2 style={{ margin: 0, textAlign: 'center' }}>
          {getTranslation('round', language)} {currentRound} / {totalRounds}
        </h2>

        <button
          className="round-button"
          onClick={handleNext}
          disabled={currentRound === totalRounds}
        >
          Next →
        </button>
      </div>

      <div className="results-list">
        {roundData.matches.map((match, idx) => {
          const home = getConventDisplay(match.home);
          const away = getConventDisplay(match.away);

          const hasScores = match.homeScore !== undefined && match.awayScore !== undefined;

          let resultLabel = '';
          let resultClass = '';
          let scoreDisplay = '—';

          if (hasScores) {
            if (match.homeScore > match.awayScore) {
              resultLabel = getTranslation('homeWins', language);
              resultClass = 'home-win';
            } else if (match.awayScore > match.homeScore) {
              resultLabel = getTranslation('awayWins', language);
              resultClass = 'away-win';
            } else {
              resultLabel = getTranslation('tie', language);
              resultClass = 'tie';
            }
            scoreDisplay = `${match.homeScore} - ${match.awayScore}`;
          }

          return (
            <div
              key={idx}
              className="match-card"
              style={{
                borderColor: home.isMine ? home.color : away.isMine ? away.color : ''
              }}
            >
              <div className="match-teams">
                <span
                  className="team-name"
                  style={{
                    color: home.color,
                    fontWeight: home.isMine ? 'bold' : 'normal',
                    textShadow: home.isMine ? `0 0 8px ${home.color}` : 'none'
                  }}
                >
                  {home.name}
                </span>
                <span className="vs">VS</span>
                <span
                  className="team-name"
                  style={{
                    color: away.color,
                    fontWeight: away.isMine ? 'bold' : 'normal',
                    textShadow: away.isMine ? `0 0 8px ${away.color}` : 'none'
                  }}
                >
                  {away.name}
                </span>
              </div>
              <div className={`match-result ${resultClass}`}>
                {hasScores ? (
                  <>
                    <span className="result-label">{resultLabel}</span>
                    <span className="result-score">{scoreDisplay}</span>
                  </>
                ) : (
                  <span className="result-score upcoming">{scoreDisplay}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Fixtures;
