import React, { useEffect, useRef, useState } from 'react';
import Field from '../Field';
import FieldPlayers from '../FieldPlayers';
import GameAnimations from '../GameAnimations';
import Player from '../Player';
import { useLanguage } from '../../context/LanguageContext';
import { useGame } from '../../context/GameContext';
import { getTranslation, translateRole } from '../../translations';
import { getCurrentBatter, getCurrentPitcher } from '../../logic/match';
import { getRoleColorClass } from '../../logic/utils';
import { playerStars } from '../../logic/ui_utils';
import ScoreChart from '../ScoreChart';
import { updateStatsFromMatch, getDefaultStats } from '../../logic/stats';

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

const Match = ({ myConvent, opponent, convents, matchState: propMatchState, onPitch, onMatchEnd, setActiveTab }) => {
  const { language } = useLanguage();
  const { matchState: contextMatchState } = useGame();

  const currentMatchState = propMatchState || contextMatchState;

  // Compute opponent from fixtures for current week
 

  // Derive match state values (independent of opponent)
  const score = currentMatchState?.score || { home: 0, away: 0 };
  const currentInning = currentMatchState?.currentInning || 1;
  const half = currentMatchState?.half || 'top';
  const bases = currentMatchState?.bases || [false, false, false];
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

  // Animation state hooks
  const [animPhase, setAnimPhase] = useState(PHASES.IDLE);
  const [animOutcome, setAnimOutcome] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  // Ref hooks
  const matchEndCalledRef = useRef(false);
  const prevEventsLengthRef = useRef(0);

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

  // Season over check (after all hooks)
  if (!opponent) {
    return (
      <div className="match season-over">
        <h2>{getTranslation('seasonComplete', language)}</h2>
        <p>{getTranslation('allFixturesPlayed', language)}</p>
      </div>
    );
  }

  // Opponent-dependent calculations
  const getBattingTeam = () => (half === 'bottom' ? myConvent : opponent);
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

  const getTeamLabel = (convent) => {
    if (!convent) return '???';
    return convent.short ? convent.short.toUpperCase() : convent.name.substring(0, 3).toUpperCase();
  };

  const homeLabel = getTeamLabel(myConvent);
  const awayLabel = getTeamLabel(opponent);

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
          />
       )}

       <Field
         myConvent={myConvent}
         opponent={opponent}
         half={half}
         bases={bases}
         animationPhase={animPhase}
         battingQueue={battingQueue}
         onPlayerHover={setHoveredPlayer}
       >
        {currentMatchState && myConvent && opponent && (
          <>
               <FieldPlayers
                 homeConvent={myConvent}
                 awayConvent={opponent}
                 half={half}
                 animationPhase={animPhase}
                 battingQueue={battingQueue}
                 baseRunners={baseRunners}
                 onPlayerHover={setHoveredPlayer}
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
              <button
                className="next-week-button"
                onClick={() => setActiveTab('nextWeek')}
              >
                {getTranslation('viewResults', language)}
              </button>
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

            {null}
        </>
      )}
    </div>
  );
};

export default Match;
