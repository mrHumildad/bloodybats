import React, { useEffect, useRef, useState } from 'react';
import Field from '../Field';
import FieldPlayers from '../FieldPlayers';
import GameAnimations from '../GameAnimations';
import Player from '../Player';
import { useLanguage } from '../../context/LanguageContext';
import { useGame } from '../../context/GameContext';
import { getTranslation, translateRole } from '../../translations';
import { getCurrentBatter, getCurrentPitcher, getCurrentCatcher } from '../../logic/match';
import { charTranslator } from '../../logic/dice_utils';
import Die from '../Die';
import { getRoleColorClass } from '../../logic/utils';
import { playerStars } from '../../logic/ui_utils';
import ScoreChart from '../ScoreChart';
import { updateStatsFromMatch, getDefaultStats } from '../../logic/stats';
import { actions } from '../../logic/actions';

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

const Match = ({ myConvent, opponent, convents, matchState: propMatchState, onPitch, onMatchEnd, setActiveTab }) => {
  const { language } = useLanguage();
  const { matchState: contextMatchState } = useGame();
  const currentMatchState = propMatchState || contextMatchState;
  const score = currentMatchState?.score || { home: 0, away: 0 };
  const currentInning = currentMatchState?.currentInning || 1;
  const half = currentMatchState?.half || 'top';
  const events = currentMatchState?.events || [];
  const inningScores = currentMatchState?.inningScores || { home: [], away: [] };
  const hits = currentMatchState?.hits || { home: 0, away: 0 };
  const errors = currentMatchState?.errors || { home: 0, away: 0 };
  const balls = currentMatchState?.balls || 0;
  const strikes = currentMatchState?.strikes || 0;
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

  const attributeMap = {
    'Body': 'body',
    'Mind': 'mind',
    'Heart': 'heart',
    'Cunning': 'cunning',
    'Power': 'power',
    'Fortitude': 'fortitude'
  };

  // Animation state hooks
  const [animPhase, setAnimPhase] = useState(PHASES.IDLE);
  const [animOutcome, setAnimOutcome] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [commentatorLog, setCommentatorLog] = useState([]);
  const [catcherActionIndex, setCatcherActionIndex] = useState(0);
  const [actionPhase, setActionPhase] = useState('initial'); // 'initial', 'catcher_action', 'done'

  // Ref hooks
  const matchEndCalledRef = useRef(false);
  const prevEventsLengthRef = useRef(0);

  // Initialize commentator log with batter and pitcher at start
  useEffect(() => {
    if (batter && pitcher && commentatorLog.length === 0) {
      setCommentatorLog([
        `Batter: ${batter.name} (${translateRole(batter.role, language)})`,
        `Pitcher: ${pitcher.name} (${translateRole(pitcher.role, language)})`
      ]);
    }
  }, [batter, pitcher, language, commentatorLog.length]);

  // Keep only the latest message - clear previous when new one comes
  const addToCommentatorLog = (message) => {
    setCommentatorLog([message]);
  };

  const handleContinue = () => {
    if (actionPhase === 'initial') {
      // Determine if player is pitching (fielding team)
      // top half: away bats, home pitches -> player pitches if myConvent is home
      // bottom half: home bats, away pitches -> player pitches if myConvent is away
      const isPlayerPitching = half === 'top'
        ? myConvent?.id === currentMatchState?.homeConventId
        : myConvent?.id === currentMatchState?.awayConventId;
      
      if (isPlayerPitching) {
        setActionPhase('catcher_action');
        setCatcherActionIndex(0);
      } else {
        // Player is batting, CPU catcher selects random action
        const catcherActions = actions['Catcher'];
        const randomAction = catcherActions[Math.floor(Math.random() * catcherActions.length)];
        addToCommentatorLog(`CPU Catcher ${catcher?.name} selected: ${randomAction.name}`);
        setActionPhase('done');
      }
    } else {
      // Random CPU action for testing
      const roles = ['Pitcher', 'Batter', 'Catcher'];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const roleActions = actions[role];
      const randomAction = roleActions[Math.floor(Math.random() * roleActions.length)];
      addToCommentatorLog(`CPU ${role} selected: ${randomAction.name}`);
    }
  };

  // Effect: when match ends, update stats and increment week via onMatchEnd
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

  // Effect: handle animation sequences on new events
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
          // For balls and strikes, just show pitch throw and contact
          setAnimPhase(PHASES.PITCH_THROW);
          setTimeout(() => setAnimPhase(PHASES.CONTACT), timings[0]);
          setTimeout(() => setAnimPhase(PHASES.IDLE), timings[0] + timings[1] + timings[2]);
        }
      }, 0);
    }
  }, [currentMatchState?.events, currentMatchState?.currentInning, currentMatchState?.half, currentMatchState]);

  // Season over check (after all hooks)
  if (!opponent) {
    return (
      <div className="match season-over">
        <h2>{getTranslation('seasonComplete', language)}</h2>
        <p>{getTranslation('allFixturesPlayed', language)}</p>
      </div>
    );
  }

  const getTeamLabel = (convent) => {
    if (!convent) return '???';
    return convent.short ? convent.short.toUpperCase() : convent.name.substring(0, 3).toUpperCase();
  };

  // Resolve labels from matchState using convents lookup (home/away are fixed in state)
  const homeConvent = convents?.find(c => c.id === currentMatchState?.homeConventId);
  const awayConvent = convents?.find(c => c.id === currentMatchState?.awayConventId);
  const homeLabel = homeConvent ? getTeamLabel(homeConvent) : 'HOME';
  const awayLabel = awayConvent ? getTeamLabel(awayConvent) : 'AWAY';
  const homeColor = homeConvent?.colors?.primary || '#ffffff';
  const awayColor = awayConvent?.colors?.primary || '#ffffff';

  // Opponent-dependent calculations
  const getBattingTeam = () => (half === 'bottom' ? homeConvent : awayConvent);
  const battingConvent = getBattingTeam();

  const allBatters = battingConvent?.team?.filter(
    (p) => p.role === 'batter' || p.position?.startsWith('BAT')
  ) || [];

  const awayBatterIndex = currentMatchState?.awayBatterIndex ?? 0;
  const homeBatterIndex = currentMatchState?.homeBatterIndex ?? 0;

    const outPlayersThisHalf = (currentMatchState?.events || []).filter(ev => {
      return ev.inning === currentInning && ev.half === half && (
        ev.outcome === 'strikeout' || ev.outcome === 'ground_out' || ev.outcome === 'fly_out'
      );
    }).map(ev => ev.batterId);

    // Compute base assignments and visible queue from events
   const computeBattingInfo = () => {
     if (!allBatters.length) return { visibleQueue: [], baseRunners: [] };

     const currentIdx = half === 'bottom' ? homeBatterIndex : awayBatterIndex;

     const halfInningEvents = (currentMatchState?.events || []).filter(
       ev => ev.inning === currentInning && ev.half === half
     );

     const playersById = {};
     allBatters.forEach(p => { playersById[p.id] = p; });

     // Simulate base assignments from events: [first, second, third] = player or null
     let baseAssignments = [null, null, null];

     for (const ev of halfInningEvents) {
       const batter = playersById[ev.batterId];
       if (!batter) continue;
       const outcome = ev.outcome;

       if (outcome === 'home_run') {
         baseAssignments = [null, null, null];
       } else if (['single', 'double', 'triple'].includes(outcome)) {
         const steps = outcome === 'single' ? 1 : outcome === 'double' ? 2 : 3;
         const newBases = [null, null, null];

         // Advance existing runners
         for (let i = 0; i < 3; i++) {
           if (baseAssignments[i] !== null) {
             const newIdx = i + steps;
             if (newIdx < 3) {
               newBases[newIdx] = baseAssignments[i];
             }
           }
         }

         // Place batter on the correct base
         if (outcome === 'single') newBases[0] = batter;
         else if (outcome === 'double') newBases[1] = batter;
         else if (outcome === 'triple') newBases[2] = batter;

         baseAssignments = newBases;
       }
       // outs: no change to baseAssignments
     }

     // Build visible queue: fixed 5-slot bench (BAT-1 through BAT-5)
     const visibleQueue = [];
     const slotToPosition = ['BAT-1', 'BAT-2', 'BAT-3', 'BAT-4', 'BAT-5'];
     for (let slot = 0; slot < 5; slot++) {
       const positionCode = slotToPosition[slot];
       const player = allBatters.find(p => p.position === positionCode);
       if (!player) {
         // Empty slot if no player assigned to this batting position
         visibleQueue.push({ player: null, status: null, isHomeRun: false });
         continue;
       }

       let slotStatus = null;
       if (slot === currentIdx) {
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
       visibleQueue.push({ player, status: slotStatus, isHomeRun });
     }

     // Build base runners list from baseAssignments
     const baseRunners = [];
     for (let i = 0; i < 3; i++) {
       if (baseAssignments[i]) {
         baseRunners.push({
           player: baseAssignments[i],
           baseNum: i + 1
         });
       }
     }

     return { visibleQueue, baseRunners };
   };

    const { visibleQueue: battingQueue, baseRunners } = computeBattingInfo();

  // Compute selected catcher action details for display
  const catcherActions = actions['Catcher'] || [];
  const currentCatcherAction = catcherActions[catcherActionIndex] || null;

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
            <p className={`role-info ${getRoleColorClass(hoveredPlayer.player.role)}`}>
              {translateRole(hoveredPlayer.player.role, language)}
            </p>
            <div className="meta">
              <span>{getTranslation('position', language)}: {hoveredPlayer.player.position || '-'}</span>
              <span>{getTranslation('number', language)}: {hoveredPlayer.player.shirtNumber || '-'}</span>
            </div>
            <p className="stars">{playerStars(hoveredPlayer.player)}</p>
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



            <div className="commentator-log">
              <h4>Commentator Log</h4>
              <ul>
                {commentatorLog.slice().reverse().map((entry, idx) => (
                  <li key={commentatorLog.length - 1 - idx}>{entry}</li>
                ))}
                {commentatorLog.length === 0 && <li>No actions logged yet.</li>}
              </ul>
              {actionPhase === 'initial' && (
                <button className="continue-button" onClick={handleContinue}>
                  Continue
                </button>
              )}
            </div>
            {actionPhase === 'catcher_action' && currentCatcherAction && catcher && (
              <div className="player-action-selector">
                <h4>Select Catcher Action for {catcher.name}</h4>
                <div className="action-display">
                  <button
                    className="nav-button"
                    onClick={() => setCatcherActionIndex(prev => (prev - 1 + catcherActions.length) % catcherActions.length)}
                    >
                    ◀
                  </button>
                  <div className="action-info">
                    <span className="action-name">{currentCatcherAction.name}</span>
                    <div className="action-dice">
                      {currentCatcherAction.combo.map(attr => (
                        <span key={attr} className="combo-attribute">
                          <Die
                            faces={catcher.attributes[attributeMap[attr]]}
                            value={catcher.attributes[attributeMap[attr]]}
                            attribute={attributeMap[attr]}
                            />
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="nav-button"
                    onClick={() => setCatcherActionIndex(prev => (prev + 1) % catcherActions.length)}
                    >
                    ▶
                  </button>
                </div>
                <button className="log-player-action-button" onClick={() => {
                  addToCommentatorLog(`Player Catcher selected: ${currentCatcherAction.name}`);
                  setActionPhase('done');
                }}>Confirm Catcher Action</button>
              </div>
            )}
            {actionPhase === 'done' && (
              <button className="continue-button" onClick={handleContinue}>
                Log Random CPU Action
              </button>
            )}
        </>
      )}
      {onPitch && !gameOver && (
        <button className="pitch-button" onClick={onPitch}>
          PITCH
        </button>
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
