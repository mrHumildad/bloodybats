import React from 'react';

const GameAnimations = ({ phase, outcome, bases, events }) => {
  if (!phase || phase === 'idle') return null;

  const latestEvent = events[events.length - 1];
  const runsScored = latestEvent?.runsScored || 0;

  return (
    <div className="game-animations">
      {/* Ball trajectory */}
      <div className={`ball ${phase}`} />

      {/* Contact flash at home plate */}
      {phase === 'contact' && <div className="contact-flash" />}

      {/* Runner highlights on occupied bases during advancing phase */}
      {phase === 'runner_advancing' && bases.map((occupied, idx) => (
        occupied && (
          <div
            key={idx}
            className="runner-highlight"
            style={{
              left: idx === 0 ? '68%' : idx === 1 ? '48%' : '32%',
              top: idx === 0 ? '52%' : idx === 1 ? '28%' : '52%',
            }}
          />
        )
      ))}

      {/* Outcome popup */}
      {outcome && (
        <div className={`outcome-popup outcome-${outcome}`}>
          {outcome.replace('_', ' ')}
        </div>
      )}

      {/* Score pulse when runs scored */}
      {phase === 'score' && runsScored > 0 && (
        <div className="score-pulse">
          +{runsScored}
        </div>
      )}
    </div>
  );
};

export default GameAnimations;
