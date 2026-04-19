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
            left: idx === 0 ? '74.6154%' : idx === 1 ? '50%' : '25.3846%',
            top: idx === 0 ? '50%' : idx === 1 ? '25.3846%' : '50%',
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
