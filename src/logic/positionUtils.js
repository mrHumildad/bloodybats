// Position-to-role mapping
export const POSITION_TO_ROLE = {
  PIT: 'pitcher',
  CAT: 'catcher',
  'BAS-1': 'baseGuard',
  'BAS-2': 'baseGuard',
  'BAS-3': 'baseGuard',
  'FIE-1': 'fielder',
  'FIE-2': 'fielder',
  DH: 'dh'
};

export const getRoleFromPosition = (pos) => POSITION_TO_ROLE[pos] || 'fielder';

export const getPositionForPlayer = (player, convent) => {
  if (!player || !convent?.field) return null;
  const field = convent.field;
  return Object.keys(field).find(key => field[key] === player.id) || null;
};

export const getBattingOrderPosition = (playerId, battingOrder) => {
  const index = battingOrder.indexOf(playerId);
  return index >= 0 ? index + 1 : null;
};
