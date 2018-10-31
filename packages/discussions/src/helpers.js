export const isPresent = (discussion, username) =>
  discussion.presences.find(p => p.user === username) !== undefined;

export const canManage = (discussion, profile) => {
  if (profile.spaceAdmin) {
    return true;
  }
  if (discussion.owningUsers.map(u => u.username).includes(profile.username)) {
    return true;
  }
  const owningTeams = discussion.owningTeams.map(t => t.name);
  const profileTeams = profile.memberships.map(m => m.team.name);
  if (owningTeams.some(owningTeam => profileTeams.includes(owningTeam))) {
    return true;
  }
  return false;
};
