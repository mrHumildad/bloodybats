import React, { useEffect, useRef, useState } from 'react';
import Field from '../Field';
import FieldPlayers from '../FieldPlayers';
import GameAnimations from '../GameAnimations';
import ScoreChart from '../ScoreChart';
import { useLanguage } from '../../context/LanguageContext';
import { useGame } from '../../context/GameContext';
import { getTranslation, translateRole } from '../../translations';
import { getCurrentBatter, getCurrentPitcher, getCurrentCatcher } from '../../logic/match';
import { actions } from '../../logic/actions';
import { getRoleColorClass } from '../../logic/utils';
import { getPositionForPlayer, getRoleFromPosition } from '../../logic/positionUtils';
import { playerStars } from '../../logic/ui_utils';
import { updateStatsFromMatch, getDefaultStats } from '../../logic/stats';
import ActionSelector from '../ActionSelector';
import DiceRoll from '../DiceRoll';

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
  ball: [200, 200, 300],
  strike: [200, 200, 300],
};

const TURN_PHASES = {
  IDLE: 'idle',
  CATCHER_SELECT: 'catcher_select',
  PITCHER_SELECT: 'pitcher_select',
  BATTER_SELECT: 'batter_select',
  CATCHER_ROLL: 'catcher_roll',
  PITCHER_BATTER_ROLL: 'pb_roll',
  RESOLVE: 'resolve',
};

const Match = ({
  myConvent,
  opponent,
  convents,
  matchState: propMatchState,
  onPitch,
  onMatchEnd,
  setActiveTab
}) => {
  const { language } = useLanguage();
  const {
    matchState: contextMatchState,
    setPendingAction,
    setRollResult,
    resolveTurn
  } = useGame();

  const currentMatchState = propMatchState || contextMatchState;
  const score = currentMatchState?.score || { home: 0, away: 0 };
  const currentInning = currentMatchState?.currentInning || 1;
  const half = currentMatchState?.half || 'top';
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
  const catcher = currentMatchState ? getCurrentCatcher(currentMatchState) : null;

  // Helper: get team label from convent
  const getTeamLabel = (convent) => {
    if (!convent) return '???';
    return convent.short ? convent.short.toUpperCase() : convent.name.substring(0, 3).toUpperCase();
  };

  // Helper: derive display role and position for a player based on their convent
  const getPlayerDisplayInfo = (player) => {
    if (!player) return { role: 'reserve', position: '-' };
    // Find which convent contains this player
    const convent = homeConvent?.team?.includes(player) ? homeConvent
                 : awayConvent?.team?.includes(player) ? awayConvent
                 : null;
    if (!convent) return { role: 'reserve', position: '-' };
    const pos = getPositionForPlayer(player, convent);
    return {
      role: pos ? getRoleFromPosition(pos) : 'reserve',
      position: pos || '-'
    };
  };

  // Convent lookups
  const homeConvent = convents?.find(c => c.id === currentMatchState?.homeConventId);
  const awayConvent = convents?.find(c => c.id === currentMatchState?.awayConventId);
  const homeLabel = homeConvent ? getTeamLabel(homeConvent) : 'HOME';
  const awayLabel = awayConvent ? getTeamLabel(awayConvent) : 'AWAY';
  const homeColor = homeConvent?.colors?.primary || '#ffffff';
  const awayColor = awayConvent?.colors?.primary || '#ffffff';

   // Batting team and colors
   const pitchingTeamKey = half === 'top' ? 'home' : 'away';
   const battingTeamKey = half === 'bottom' ? 'home' : 'away';
   const pitchingColor = pitchingTeamKey === 'home' ? homeColor : awayColor;
   const battingColor = battingTeamKey === 'home' ? homeColor : awayColor;

   // Determine batting order (from match state) and current batter index
   const isHomeBatting = half === 'bottom';
   const currentBattingOrder = isHomeBatting
     ? (currentMatchState?.homeBattingOrder || [])
     : (currentMatchState?.awayBattingOrder || []);
   const currentBattingIdx = isHomeBatting
     ? (currentMatchState?.homeBatterIndex ?? 0)
     : (currentMatchState?.awayBatterIndex ?? 0);

   // Players who are out this half inning (from events)
   const outPlayersThisHalf = (currentMatchState?.events || []).filter(ev => {
     return ev.inning === currentInning && ev.half === half && (
       ev.outcome === 'strikeout' || ev.outcome === 'ground_out' || ev.outcome === 'fly_out'
     );
   }).map(ev => ev.batterId);

   // Events this half inning for base advancement and HR tracking
   const halfInningEvents = (currentMatchState?.events || []).filter(
     ev => ev.inning === currentInning && ev.half === half
   );

   // Map playerId -> player for quick lookup from batting order
   const battersById = new Map(currentBattingOrder.map(p => [p.id, p]));

   // Track runners on bases
   let baseAssignments = [null, null, null];

   for (const ev of halfInningEvents) {
     const batter = battersById.get(ev.batterId);
     if (!batter) continue;
     const outcome = ev.outcome;

     if (outcome === 'home_run') {
       baseAssignments = [null, null, null];
     } else if (['single', 'double', 'triple'].includes(outcome)) {
       const steps = outcome === 'single' ? 1 : outcome === 'double' ? 2 : 3;
       const newBases = [null, null, null];
       for (let i = 0; i < 3; i++) {
         if (baseAssignments[i] !== null) {
           const newIdx = i + steps;
           if (newIdx < 3) newBases[newIdx] = baseAssignments[i];
         }
       }
       if (outcome === 'single') newBases[0] = batter;
       else if (outcome === 'double') newBases[1] = batter;
       else if (outcome === 'triple') newBases[2] = batter;
       baseAssignments = newBases;
     }
   }

   // Build batting queue (all slots)
   const battingQueue = [];
   const totalSlots = currentBattingOrder.length;
   for (let slot = 0; slot < totalSlots; slot++) {
     const player = currentBattingOrder[slot];
     if (!player) {
       battingQueue.push({ player: null, status: null, isHomeRun: false });
       continue;
     }
     let slotStatus = null;
     if (slot === currentBattingIdx) {
       slotStatus = 'batting';
     } else if (outPlayersThisHalf.includes(player.id)) {
       slotStatus = 'out';
     } else {
       const baseIdx = baseAssignments.findIndex(p => p && p.id === player.id);
       if (baseIdx !== -1) {
         slotStatus = 'onbase' + (baseIdx + 1);
       }
     }
     const isHomeRun = halfInningEvents.some(
       ev => ev.batterId === player.id && ev.outcome === 'home_run'
     );
     battingQueue.push({ player, status: slotStatus, isHomeRun });
   }

   // Build base runners list for field display
   const baseRunners = [];
   for (let i = 0; i < 3; i++) {
     if (baseAssignments[i]) {
       baseRunners.push({
         player: baseAssignments[i],
         baseNum: i + 1
       });
     }
   }

  // Animation state
  const [animPhase, setAnimPhase] = useState(PHASES.IDLE);
  const [animOutcome, setAnimOutcome] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  // Turn state machine
  const [turnPhase, setTurnPhase] = useState(TURN_PHASES.IDLE);
  const [localSelectedActions, setLocalSelectedActions] = useState({ Pitcher: null, Catcher: null, Batter: null });
  const [commentatorLog, setCommentatorLog] = useState([]);

  // Refs
  const matchEndCalledRef = useRef(false);
  const prevEventsLengthRef = useRef(0);
  const cpuTimerRef = useRef(null);
  const prevEventCountRef = useRef(0);

  // Helper: add log entry with optional color
  const addToCommentatorLog = (message, color = null) => {
    setCommentatorLog(prev => [...prev, { message, color }]);
  };

  // Determine player control
  const isPlayerPitching = (half === 'top' && myConvent?.id === currentMatchState?.homeConventId) ||
                          (half === 'bottom' && myConvent?.id === currentMatchState?.awayConventId);
  const isPlayerCatching = isPlayerPitching;
  const isPlayerBattering = !isPlayerPitching;

  const isPlayerTurn = (role) => {
    switch (role) {
      case 'Pitcher': return isPlayerPitching;
      case 'Catcher': return isPlayerCatching;
      case 'Batter': return isPlayerBattering;
      default: return false;
    }
  };

  // Get selected action for role (capitalized role name)
  const getSelectedAction = (roleCap) => {
    const roleLower = roleCap.toLowerCase();
    const actionId = localSelectedActions[roleCap] || currentMatchState?.pendingActions?.[roleLower];
    if (!actionId) return null;
    return actions[roleCap]?.find(a => a.id === actionId) || null;
  };

  // Advance turn phase
  const advanceTurnPhase = () => {
    if (cpuTimerRef.current) {
      clearTimeout(cpuTimerRef.current);
      cpuTimerRef.current = null;
    }

    switch (turnPhase) {
      case TURN_PHASES.IDLE:
        break;
      case TURN_PHASES.CATCHER_SELECT:
        setTurnPhase(TURN_PHASES.CATCHER_ROLL);
        break;
      case TURN_PHASES.CATCHER_ROLL:
        setTurnPhase(TURN_PHASES.PITCHER_SELECT);
        break;
      case TURN_PHASES.PITCHER_SELECT:
        setTurnPhase(TURN_PHASES.BATTER_SELECT);
        break;
      case TURN_PHASES.BATTER_SELECT:
        setTurnPhase(TURN_PHASES.PITCHER_BATTER_ROLL);
        break;
      case TURN_PHASES.PITCHER_BATTER_ROLL:
        setTurnPhase(TURN_PHASES.RESOLVE);
        break;
      case TURN_PHASES.RESOLVE:
        resolveTurn();
        break;
      default:
        break;
    }
  };

  // PITCH button click
  const handlePitchClick = () => {
    setLocalSelectedActions({ Pitcher: null, Catcher: null, Batter: null });
    setTurnPhase(TURN_PHASES.CATCHER_SELECT);
  };

  // Handle action selection
  const handleSelectAction = (role, actionId) => {
    setLocalSelectedActions(prev => ({ ...prev, [role]: actionId }));
    setPendingAction(role.toLowerCase(), actionId);
    const action = actions[role]?.find(a => a.id === actionId);
    const isPlayer = isPlayerTurn(role);
    const teamColor = role === 'Batter' ? battingColor : pitchingColor;
    addToCommentatorLog(`${isPlayer ? 'Player' : 'CPU'} ${role} selected: ${action?.name}`, teamColor);
  };

  // CPU auto-select
  const autoSelectCpuAction = (roleCap) => {
    const roleActions = actions[roleCap];
    if (!roleActions || roleActions.length === 0) return null;
    const randomAction = roleActions[Math.floor(Math.random() * roleActions.length)];
    handleSelectAction(roleCap, randomAction.id);
    return randomAction;
  };

  // CPU auto-advance effect
  useEffect(() => {
    if (turnPhase === TURN_PHASES.IDLE || turnPhase === TURN_PHASES.RESOLVE) return;

    const roleForPhase = {
      [TURN_PHASES.CATCHER_SELECT]: 'Catcher',
      [TURN_PHASES.PITCHER_SELECT]: 'Pitcher',
      [TURN_PHASES.BATTER_SELECT]: 'Batter',
    }[turnPhase];

    if (!roleForPhase) return;

    if (!isPlayerTurn(roleForPhase)) {
      cpuTimerRef.current = setTimeout(() => {
        autoSelectCpuAction(roleForPhase);
        // After auto-selection, wait 550ms then advance to next phase
        setTimeout(() => {
          const nextPhaseMap = {
            [TURN_PHASES.CATCHER_SELECT]: TURN_PHASES.CATCHER_ROLL,
            [TURN_PHASES.PITCHER_SELECT]: TURN_PHASES.BATTER_SELECT,
            [TURN_PHASES.BATTER_SELECT]: TURN_PHASES.PITCHER_BATTER_ROLL,
          };
          setTurnPhase(nextPhaseMap[turnPhase]);
        }, 550);
      }, 550);
    }

    return () => {
      if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnPhase]);

  // Dice completion
  const handleDiceComplete = (results) => {
    if (turnPhase === TURN_PHASES.CATCHER_ROLL) {
      setRollResult('catcher', results.player1Result);
      addToCommentatorLog(`[Catcher] rolled ${results.player1Result.total} (dice: [${results.player1Result.dice.join(', ')}])`, pitchingColor);
      setTimeout(() => advanceTurnPhase(), 300);
    } else if (turnPhase === TURN_PHASES.PITCHER_BATTER_ROLL) {
      setRollResult('pitcher', results.player1Result);
      setRollResult('batter', results.player2Result);
      addToCommentatorLog(`[Pitcher] rolled ${results.player1Result.total} (dice: [${results.player1Result.dice.join(', ')}])`, pitchingColor);
      addToCommentatorLog(`[Batter] rolled ${results.player2Result.total} (dice: [${results.player2Result.dice.join(', ')}])`, battingColor);
      setTimeout(() => advanceTurnPhase(), 300);
    }
  };

  // Reset to IDLE after animation completes
  useEffect(() => {
    if (turnPhase === TURN_PHASES.RESOLVE && animPhase === PHASES.IDLE) {
      // Use setTimeout to avoid direct setState in effect
      setTimeout(() => {
        setTurnPhase(TURN_PHASES.IDLE);
        setLocalSelectedActions({ Pitcher: null, Catcher: null, Batter: null });
      }, 0);
    }
  }, [animPhase, turnPhase]);

  // Animation sequence on new event
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
        const isHit = ['single', 'double', 'triple', 'home_run'].includes(outcome);
        const isCount = outcome === 'ball' || outcome === 'strike';

        if (isOut) {
          setAnimPhase(PHASES.PITCH_THROW);
          setTimeout(() => setAnimPhase(PHASES.CONTACT), 0);
          setTimeout(() => setAnimPhase(PHASES.OUT), timings[0]);
          setTimeout(() => setAnimPhase(PHASES.IDLE), timings[0] + timings[1] + 200);
        } else if (isHit) {
          setAnimPhase(PHASES.PITCH_THROW);
          setTimeout(() => setAnimPhase(PHASES.CONTACT), 0);
          setTimeout(() => setAnimPhase(PHASES.HIT_FLYING), timings[0] + timings[1]);
          setTimeout(() => setAnimPhase(PHASES.RUNNER_ADVANCING), timings[0] + timings[1] + timings[2]);
          setTimeout(() => setAnimPhase(PHASES.SCORE), timings[0] + timings[1] + timings[2] + 400);
          setTimeout(() => setAnimPhase(PHASES.IDLE), timings[0] + timings[1] + timings[2] + 1200);
        } else if (isCount) {
          setAnimPhase(PHASES.PITCH_THROW);
          setTimeout(() => setAnimPhase(PHASES.CONTACT), timings[0]);
          setTimeout(() => setAnimPhase(PHASES.IDLE), timings[0] + timings[1] + timings[2]);
        }
      }, 0);
    }
  }, [currentMatchState?.events, currentMatchState?.currentInning, currentMatchState?.half, currentMatchState]);

  // Log outcome when a new event appears
  useEffect(() => {
    if (!currentMatchState) return;
    const count = currentMatchState.events.length;
    if (count > prevEventCountRef.current) {
      const ev = currentMatchState.events[count - 1];
      const { outcome, batterRoll, pitcherRoll } = ev;
      const diff = batterRoll - pitcherRoll;
      const sign = diff >= 0 ? `+${diff}` : diff.toString();
      const diffColor = diff >= 0 ? battingColor : pitchingColor;
      // Use setTimeout to avoid direct setState in effect
      setTimeout(() => {
        addToCommentatorLog(`[Outcome] ${batterRoll} - ${pitcherRoll} = diff ${sign} → ${outcome.replace('_', ' ')}`, diffColor);
      }, 0);
    }
    prevEventCountRef.current = currentMatchState.events.length;
  }, [currentMatchState?.events, currentMatchState, battingColor, pitchingColor]);

  // Match end handling
  useEffect(() => {
    if (!gameOver) return;
    if (matchEndCalledRef.current) return;
    if (!currentMatchState || !convents || !onMatchEnd) return;

    const homeId = currentMatchState.homeConventId;
    const awayId = currentMatchState.awayConventId;
    const homeScore = currentMatchState.score.home;
    const awayScore = currentMatchState.score.away;
    const homeHits = currentMatchState.hits.home;
    const awayHits = currentMatchState.hits.away;
    const homeErrors = currentMatchState.errors.home;
    const awayErrors = currentMatchState.errors.away;

    const homeConvent = convents.find(c => c.id === homeId);
    const awayConvent = convents.find(c => c.id === awayId);
    if (!homeConvent || !awayConvent) return;

    const homeStats = homeConvent.stats || getDefaultStats();
    const awayStats = awayConvent.stats || getDefaultStats();

    const updatedStats = updateStatsFromMatch(
      homeStats,
      awayStats,
      homeScore,
      awayScore,
      homeHits,
      awayHits,
      homeErrors,
      awayErrors
    );

    const updatedConvents = convents.map(c => {
      if (c.id === homeId) {
        return { ...c, stats: updatedStats.home };
      }
      if (c.id === awayId) {
        return { ...c, stats: updatedStats.away };
      }
      return c;
    });

    onMatchEnd(updatedConvents);
    matchEndCalledRef.current = true;
  }, [gameOver, currentMatchState, convents, onMatchEnd]);

  // No opponent scenario
  if (!opponent) {
    return (
      <div className="match season-over">
        <h2>{getTranslation('seasonComplete', language)}</h2>
        <p>{getTranslation('allFixturesPlayed', language)}</p>
      </div>
    );
  }

  return (
    <div className="match">
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
          homeColor={homeColor}
          awayColor={awayColor}
        />
      )}

      <Field>
        {currentMatchState && myConvent && opponent && (
          <>
            <FieldPlayers
              homeConvent={homeConvent}
              awayConvent={awayConvent}
              half={half}
              animationPhase={animPhase}
              battingQueue={battingQueue}
              baseRunners={baseRunners}
              onPlayerHover={setHoveredPlayer}
              pitcher={pitcher}
              catcher={catcher}
              highlightRole={
                turnPhase === TURN_PHASES.CATCHER_SELECT ? 'catcher' :
                turnPhase === TURN_PHASES.PITCHER_SELECT ? 'pitcher' :
                turnPhase === TURN_PHASES.BATTER_SELECT ? 'batter' :
                null
              }
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

      {hoveredPlayer && hoveredPlayer.player && (
        <div
          className="player-hover-tooltip"
          style={
            hoveredPlayer.pos ? {
              left: `${hoveredPlayer.pos.x}%`,
              top: `${hoveredPlayer.pos.y}%`,
            } : hoveredPlayer.type === 'queue' ? {
              left: '5%',
              top: '80%',
            } : {}
          }
        >
          <h4>{hoveredPlayer.player.name}</h4>
          {(() => {
            const info = getPlayerDisplayInfo(hoveredPlayer.player);
            return (
              <>
                <p className={`role-info ${getRoleColorClass(info.role)}`}>
                  {translateRole(info.role, language)}
                </p>
                <div className="meta">
                  <span>{getTranslation('position', language)}: {info.position}</span>
                  <span>{getTranslation('number', language)}: {hoveredPlayer.player.shirtNumber || '-'}</span>
                </div>
              </>
            );
          })}
          <p className="stars">{playerStars(hoveredPlayer.player)}</p>
        </div>
      )}

      {/* Turn phase UI: Action Selector and Dice Roll */}
      {(turnPhase !== TURN_PHASES.IDLE && turnPhase !== TURN_PHASES.RESOLVE) && (
        <div className="turn-phase-section">
          {turnPhase === TURN_PHASES.CATCHER_SELECT && catcher && (
            <ActionSelector
              player={catcher}
              role="Catcher"
              availableActions={actions.Catcher}
              selectedActionId={localSelectedActions.Catcher}
              onSelect={(id) => handleSelectAction('Catcher', id)}
              disabled={!isPlayerTurn('Catcher')}
              onConfirm={() => advanceTurnPhase()}
              language={language}
              translateRole={translateRole}
            />
          )}

          {turnPhase === TURN_PHASES.PITCHER_SELECT && pitcher && (
            <ActionSelector
              player={pitcher}
              role="Pitcher"
              availableActions={actions.Pitcher}
              selectedActionId={localSelectedActions.Pitcher}
              onSelect={(id) => handleSelectAction('Pitcher', id)}
              disabled={!isPlayerTurn('Pitcher')}
              onConfirm={() => advanceTurnPhase()}
              language={language}
              translateRole={translateRole}
            />
          )}

          {turnPhase === TURN_PHASES.BATTER_SELECT && batter && (
            <ActionSelector
              player={batter}
              role="Batter"
              availableActions={actions.Batter}
              selectedActionId={localSelectedActions.Batter}
              onSelect={(id) => handleSelectAction('Batter', id)}
              disabled={!isPlayerTurn('Batter')}
              onConfirm={() => advanceTurnPhase()}
              language={language}
              translateRole={translateRole}
            />
          )}

          {(turnPhase === TURN_PHASES.CATCHER_ROLL || turnPhase === TURN_PHASES.PITCHER_BATTER_ROLL) && (
            <DiceRoll
              mode={turnPhase === TURN_PHASES.CATCHER_ROLL ? 'catcher' : 'pitcher_batter'}
              player1={turnPhase === TURN_PHASES.CATCHER_ROLL ? catcher : pitcher}
              action1={getSelectedAction(turnPhase === TURN_PHASES.CATCHER_ROLL ? 'Catcher' : 'Pitcher')}
              player2={turnPhase === TURN_PHASES.PITCHER_BATTER_ROLL ? batter : null}
              action2={turnPhase === TURN_PHASES.PITCHER_BATTER_ROLL ? getSelectedAction('Batter') : null}
              onComplete={handleDiceComplete}
            />
          )}

          {turnPhase === TURN_PHASES.RESOLVE && (
            <div className="resolving-message">Resolving outcome...</div>
          )}
        </div>
      )}

      {currentMatchState && (
        <>
          {gameOver && winner && (
            <button
              className="next-week-button"
              onClick={() => setActiveTab('nextWeek')}
            >
              {getTranslation('viewResults', language)}
            </button>
          )}

          {onPitch && !gameOver && turnPhase === TURN_PHASES.IDLE && (
            <button className="pitch-button" onClick={handlePitchClick}>
              PITCH
            </button>
          )}
          <div className="commentator-log">
            <h4>Commentator Log</h4>
            <ul>
              {commentatorLog.slice().reverse().map((entry, idx) => (
                <li key={commentatorLog.length - 1 - idx} style={{ borderLeft: entry.color ? `3px solid ${entry.color}` : '3px solid #666' }}>
                  {entry.message}
                </li>
              ))}
              {commentatorLog.length === 0 && <li>Match started.</li>}
            </ul>
          </div>
        </>
      )}


      <div className="event-log">
        <ul>
          {events.slice().reverse().map((ev, idx) => (
            <li key={events.length - 1 - idx}>
              {ev.inning}.{ev.half === 'top' ? '▲' : '▼'} {ev.description}
            </li>
          ))}
          {events.length === 0 && <li>No plays yet.</li>}
        </ul>
      </div>
    </div>
  );
};

export default Match;
