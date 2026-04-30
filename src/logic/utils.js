export const getRoleColorClass = (role) => {
  switch (role) {
    case 'pitcher': return 'role-pitcher';
    case 'batter': return 'role-batter';
    case 'catcher': return 'role-catcher';
    case 'baseGuard': return 'role-base-guard';
    case 'fielder': return 'role-fielder';
    case 'reserve': return 'role-reserve';
    case 'backup': return 'role-backup';
    case 'dh': return 'role-dh';
    default: return 'role-reserve';
  }
};

export const getBackupPlayerIds = (team) => {
  const assignedIds = new Set([
    ...(team.battingOrder || []),
    ...Object.values(team.field || {}),
    ...(team.reserves || [])
  ]);
  
  return team.team
    .filter(player => !assignedIds.has(player.id))
    .map(player => player.id);
};
