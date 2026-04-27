import React, { useEffect, useState } from 'react';
import Die from './Die';

const ATTRIBUTE_MAP = {
  Body: 'body',
  Mind: 'mind',
  Heart: 'heart',
  Cunning: 'cunning',
  Power: 'power',
  Fortitude: 'fortitude',
};

const ActionSelector = ({
  player,
  role,
  availableActions,
  selectedActionId,
  onSelect,
  disabled = false,
  onConfirm,
  language = 'en',
  translateRole = (role) => role,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Sync display to external selectedActionId when it changes
  useEffect(() => {
    if (selectedActionId) {
      const idx = availableActions.findIndex(a => a.id === selectedActionId);
      if (idx >= 0) {
        setCurrentIndex(idx);
      }
    } else {
      setCurrentIndex(0);
    }
  }, [selectedActionId, availableActions]);

  const currentAction = availableActions[currentIndex];

  // Rotation with selection
  const handleRotation = (direction) => {
    if (disabled) return;
    setIsFlipping(true);
    setTimeout(() => {
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % availableActions.length;
      } else {
        newIndex = (currentIndex - 1 + availableActions.length) % availableActions.length;
      }
      setCurrentIndex(newIndex);
      const newAction = availableActions[newIndex];
      if (newAction && onSelect) {
        onSelect(newAction.id);
      }
      setIsFlipping(false);
    }, 200);
  };

  // Card click selects current action (no rotation)
  const handleCardClick = () => {
    if (disabled) return;
    if (currentAction && onSelect) {
      onSelect(currentAction.id);
    }
    // Optional: small flip animation on click
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 200);
  };

  const handleConfirm = () => {
    if (!disabled && onConfirm && selectedActionId) {
      onConfirm();
    }
  };

  return (
    <div className={`action-selector ${disabled ? 'cpu-selecting' : ''}`}>
      

      {disabled ? (
        <div className="cpu-wait-message">
          CPU selecting...
        </div>
      ) : (
        <>
          <div className="action-viewer">
            <button
              className="rotate-button left"
              onClick={() => handleRotation('prev')}
              aria-label="Previous action"
              type="button"
            >
              ◀
            </button>

            <div
              className={`action-card ${isFlipping ? 'flipping' : ''}`}
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              aria-label="Action card, click to select"
            >
              <div className="action-name">{currentAction?.name || 'Unknown'}</div>
              <div className="action-dice-mini">
                {currentAction?.combo.map((attr) => {
                  const attrKey = ATTRIBUTE_MAP[attr];
                  const dieValue = player?.attributes?.[attrKey] || 6;
                  return (
                      <Die
                        faces={dieValue}
                        value={dieValue}
                        attribute={attrKey}
                      />
                  );
                })}
              </div>
            </div>

            <button
              className="rotate-button right"
              onClick={() => handleRotation('next')}
              aria-label="Next action"
              type="button"
            >
              ▶
            </button>
          </div>

          <button
            className="confirm-action-button"
            onClick={handleConfirm}
            type="button"
            disabled={!selectedActionId}
          >
            OK
          </button>
        </>
      )}
    </div>
  );
};

export default ActionSelector;
