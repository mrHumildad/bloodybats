import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, getConventField } from '../../translations';
import { sortConventsByRank, calculateWinPct, getDefaultStats } from '../../logic/stats';

const LeaderBoard = ({ convents, myId }) => {
  const { language } = useLanguage();
  const sorted = sortConventsByRank(convents);

  if (!sorted || sorted.length === 0) {
    return (
      <div className="leaderboard-tab tab" style={{ padding: '20px' }}>
        <p>{getTranslation('noStats', language)}</p>
      </div>
    );
  }

  const getStats = (c) => c.stats || getDefaultStats();

  const t = (key) => getTranslation(key, language);

  // Table header columns
  const headers = [
    t('pos'),
    getTranslation('name', language), // use generic 'name' translation
    t('gp'),
    t('wins'),
    t('losses'),
    t('runs'),
    t('hits'),
    t('errors'),
    t('runDiff'),
    t('winPct')
  ];

  return (
    <div className="leaderboard-tab tab" style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>{t('leaderboard')}</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="leaderboard-table" style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.95rem',
          fontFamily: 'var(--font-heading)'
        }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.25)' }}>
              {headers.map((header, i) => (
                <th key={i} style={{
                  padding: '12px 14px',
                  textAlign: i === 0 || i === 1 ? 'left' : 'center',
                  color: 'var(--text-h)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  borderBottom: '2px solid var(--accent-gold)'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((convent, idx) => {
              const stats = getStats(convent);
              const isMe = convent.id === myId;
              const name = getConventField(convent, 'name', language);
              const runDiff = stats.runs_scored - stats.runs_allowed;
              const winPct = calculateWinPct(stats);
              const primaryColor = convent.colors?.primary || '#ffffff';

              return (
                <tr
                  key={convent.id}
                  data-testid={`leaderboard-row-${convent.id}`}
                  style={{
                    background: isMe ? `rgba(${hexToRgb(primaryColor)}, 0.15)` : undefined,
                    borderLeft: isMe ? `4px solid ${primaryColor}` : '4px solid transparent',
                    cursor: 'default',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{
                    padding: '10px 14px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'var(--accent-gold)'
                  }}>
                    {idx + 1}
                  </td>
                  <td style={{
                    padding: '10px 14px',
                    fontWeight: isMe ? 'bold' : 'normal',
                    color: isMe ? primaryColor : undefined,
                    textShadow: isMe ? `0 0 8px ${primaryColor}` : 'none'
                  }}>
                    {name}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{stats.gp}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{stats.w}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{stats.l}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{stats.runs_scored}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{stats.hits}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{stats.errors}</td>
                  <td style={{
                    padding: '10px 14px',
                    textAlign: 'center',
                    color: runDiff > 0 ? '#00ff88' : runDiff < 0 ? '#ff4444' : undefined
                  }}>
                    {runDiff > 0 ? '+' : ''}{runDiff}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    {stats.gp > 0 ? winPct.toFixed(3) : '---'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper: convert hex color to rgb string for rgba use
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
}

export default LeaderBoard;
