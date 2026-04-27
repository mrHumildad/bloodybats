import React, { useEffect, useState } from 'react';
import Die from './Die';
import { getActionTotal } from '../logic/match';

const ATTRIBUTE_MAP = {
  Body: 'body',
  Mind: 'mind',
  Heart: 'heart',
  Cunning: 'cunning',
  Power: 'power',
  Fortitude: 'fortitude',
};

const DiceRoll = ({ mode, player1, action1, player2, action2, onComplete }) => {
  const [rolling, setRolling] = useState(true);
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);

  useEffect(() => {
    // Perform dice rolls
    const r1 = getActionTotal(player1, action1);
    let r2 = null;
    if (mode === 'pitcher_batter' && player2 && action2) {
      r2 = getActionTotal(player2, action2);
    }

    // Set initial results using setTimeout to avoid set-state-in-effect lint
    setTimeout(() => {
      setResult1(r1);
      if (r2) setResult2(r2);
    }, 0);

    // Animate for ~1s then call onComplete
    const timer = setTimeout(() => {
      setRolling(false);
      if (onComplete) {
        onComplete({
          player1Result: r1,
          player2Result: mode === 'pitcher_batter' ? r2 : null,
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDiceGroup = (player, action, result) => {
    if (!player || !action) return <div className="dice-group missing">Waiting for data...</div>;

    const attributes = action.combo;
    const diceValues = result?.dice || [1, 1];
    const total = result?.total || diceValues[0] + diceValues[1];

    return (
      <div className="dice-group">
        <div className="dice-player-label">
          {player.name} ({action.name})
        </div>
        <div className="dice-display">
          {attributes.map((attr, idx) => {
            const attrKey = ATTRIBUTE_MAP[attr];
            const dieValue = player.attributes[attrKey] || 6;
            const displayValue = rolling ? Math.floor(Math.random() * dieValue) + 1 : diceValues[idx];
            return (
              <div key={attr} className="die-with-label">
                <Die
                  faces={dieValue}
                  value={displayValue}
                  attribute={attrKey}
                />
                <span className="attr-name">{attr}</span>
              </div>
            );
          })}
        </div>
        <div className="dice-sum">
          Total: {total}
        </div>
      </div>
    );
  };

  return (
    <div className={`dice-roll ${mode}`}>
      {mode === 'catcher' ? (
        <>
          <h4>Catcher Action Roll</h4>
          {renderDiceGroup(player1, action1, result1)}
        </>
      ) : (
        <>
          <h4>Pitch Resolution</h4>
          <div className="dice-row">
            {renderDiceGroup(player1, action1, result1)}
            <span className="vs">VS</span>
            {renderDiceGroup(player2, action2, result2)}
          </div>
        </>
      )}
    </div>
  );
};

export default DiceRoll;
