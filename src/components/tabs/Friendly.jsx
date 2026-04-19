import React, { useEffect, useRef, useState } from 'react';
import Field from '../Field';
import FieldPlayers from '../FieldPlayers';
import GameAnimations from '../GameAnimations';
import { useLanguage } from '../../context/LanguageContext';
import { useGame } from '../../context/GameContext';
import { getTranslation, translateRole } from '../../translations';
import { getCurrentBatter, getCurrentPitcher } from '../../logic/match';
import ScoreChart from '../ScoreChart';

const PHASES = {
  IDLE: 'idle',
  PITCH_THROW: 'pitch_throw',
  CONTACT: 'contact',
  HIT_FLYING: 'hit_flying',
  RUNNER_ADVANCING: 'runner_advancing',
  SCORE: 'score',
  OUT: 'out',
};

const OUTCOME_TIMING = {
  strikeout: [300, 300, 700],
  ground_out: [300, 300, 700],
  fly_out: [300, 300, 700],
  single: [300, 200, 600, 400],
  double: [300, 200, 600, 400],
  triple: [300, 200, 600, 400],
  home_run: [300, 200, 600, 400],
};

const Friendly = ({ myConvent, opponent, matchState: propMatchState, onPitch }) => {
  const { language } = useLanguage();
  const { matchState: contextMatchState } = useGame();

  const currentMatchState = propMatchState || contextMatchState;
  const score = currentMatchState?.score || { home: 0, away: 0 };
  const currentInning = currentMatchState?.currentInning || 1;
  const half = currentMatchState?.half || 'top';
  const bases = currentMatchState?.bases || [false, false, false];
  const outs = currentMatchState?.outs || 0;
  const events = currentMatchState?.events || [];
  const inningScores = currentMatchState?.inningScores || { home: [], away: [] };
  const hits = currentMatchState?.hits || { home: 0, away: 0 };
  const errors = currentMatchState?.errors || { home: 0, away: 0 };
  const gameOver = currentMatchState ? (currentInning > 3 && half === 'top') : false;
  const winner = currentMatchState
    ? score.home > score.away
      ? 'home'
      : score.away > score.home
      ? 'away'
      : 'tie'
    : null;

  const batter = currentMatchState ? getCurrentBatter(currentMatchState) : null;
  const pitcher = currentMatchState ? getCurrentPitcher(currentMatchState) : null;

  // Animation state
  const [animPhase, setAnimPhase] = useState(PHASES.IDLE);
  const [animOutcome, setAnimOutcome] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const prevEventsLengthRef = useRef(0);

  // Team abbreviation helper
  const getTeamLabel = (convent) => {
    if (!convent) return '???';
    return convent.short ? convent.short.toUpperCase() : convent.name.substring(0, 3).toUpperCase();
  };

  const homeLabel = getTeamLabel(myConvent);
  const awayLabel = getTeamLabel(opponent);

  // Detect new event and trigger animation sequence
  useEffect(() => {
    if (!currentMatchState) return;

    const currentLength = currentMatchState.events.length;
    const hasNewEvent = currentLength > prevEventsLengthRef.current;

    if (hasNewEvent) {
      prevEventsLengthRef.current = currentLength;
      const latestEvent = currentMatchState.events[currentMatchState.events.length - 1];
      const outcome = latestEvent.outcome;

      setTimeout(() => {
        setAnimKey(k => k + 1);
        setAnimOutcome(outcome);

        const timings = OUTCOME_TIMING[outcome] || [300, 200, 600];
        const isOut = outcome === 'strikeout' || outcome === 'ground_out' || outcome === 'fly_out';

        if (isOut) {
          setAnimPhase(PHASES.PITCH_THROW);
          setTimeout(() => setAnimPhase(PHASES.CONTACT), 0);
          setTimeout(() => setAnimPhase(PHASES.OUT), timings[0]);
          setTimeout(() => setAnimPhase(PHASES.IDLE), timings[0] + timings[1] + 200);
        } else {
          setAnimPhase(PHASES.PITCH_THROW);
          setTimeout(() => setAnimPhase(PHASES.CONTACT), 0);
          setTimeout(() => setAnimPhase(PHASES.HIT_FLYING), timings[0] + timings[1]);
          setTimeout(() => setAnimPhase(PHASES.RUNNER_ADVANCING), timings[0] + timings[1] + timings[2]);
          setTimeout(() => setAnimPhase(PHASES.SCORE), timings[0] + timings[1] + timings[2] + 400);
          setTimeout(() => setAnimPhase(PHASES.IDLE), timings[0] + timings[1] + timings[2] + 1200);
        }
      }, 0);
    }
  }, [currentMatchState?.events, currentMatchState?.currentInning, currentMatchState?.half, currentMatchState]);

  return (
    <div className="friendly-match">
      {currentMatchState && (
        <ScoreChart
          score={score}
          currentInning={currentInning}
          half={half}
          innings={currentMatchState.config.innings}
          inningScores={inningScores}
          hits={hits}
          errors={errors}
          homeTeamName={homeLabel}
          awayTeamName={awayLabel}
        />
      )}

      {/* Field with player overlays and animations */}
      <Field>
        {currentMatchState && myConvent && opponent && (
          <>
            <FieldPlayers
              homeConvent={myConvent}
              awayConvent={opponent}
              half={half}
              animationPhase={animPhase}
            />
            <GameAnimations
              phase={animPhase}
              outcome={animOutcome}
              bases={currentMatchState.bases}
              events={currentMatchState.events}
              key={`anim-${animKey}`}
            />
          </>
        )}
      </Field>

      {currentMatchState && (
        <>
          <div className="bases-visual">
            {[2, 1, 3].map((baseIdx) => (
              <div
                key={baseIdx}
                className={`base ${bases[baseIdx - 1] ? 'occupied' : ''}`}
              >
                {baseIdx}
              </div>
            ))}
            <div className="outs-display">
              OUTS: {outs}/3
            </div>
          </div>

          {batter && pitcher && (
            <div className="matchup">
              <div className="matchup-player">
                <span className="label">Batter:</span> {batter.name} ({translateRole(batter.role, language)})
              </div>
              <div className="matchup-stats">
                Cunning: {batter.attributes.cunning}
              </div>
              <div className="matchup-player">
                <span className="label">Pitcher:</span> {pitcher.name} ({translateRole(pitcher.role, language)})
              </div>
              <div className="matchup-stats">
                Power: {pitcher.attributes.power}
              </div>
            </div>
          )}

          {gameOver && winner && (
            <div className="game-over">
              <h3>{getTranslation('gameOver', language)}</h3>
              <p>
                 {winner === 'tie'
                   ? getTranslation('tie', language)
                   : `${winner === 'home' ? myConvent.name : opponent.name} WINS!`}
              </p>
            </div>
          )}

          {onPitch && !gameOver && (
            <button className="pitch-button" onClick={onPitch}>
              PITCH
            </button>
          )}

          <div className="event-log">
            <h4>Play-by-Play</h4>
            <ul>
              {events.slice().reverse().map((ev, idx) => (
                <li key={events.length - 1 - idx}>
                  {ev.inning}.{ev.half === 'top' ? '▲' : '▼'} {ev.description}
                </li>
              ))}
              {events.length === 0 && <li>No plays yet.</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Friendly;