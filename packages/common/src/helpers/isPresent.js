export default (discussion, username) =>
  discussion.presences.find(p => p.user === username) !== undefined;
