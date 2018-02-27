export const getAttributeValues = (key, ...models) => {
  const matches = models.filter(
    model => model.attributes && Object.keys(model.attributes).includes(key),
  );
  return matches.length > 0 ? matches[0].attributes[key] : [];
};

export const getAttributeValue = (name, ...models) => {
  const values = getAttributeValues(name, ...models);
  return values.length > 0 ? values[0] : null;
};

export const isMemberOf = (profile, name) => {
  const matchingMembership = profile.memberships.find(
    membership => membership.team.name === name,
  );
  return matchingMembership !== undefined;
};

export const getTeams = profile => {
  const matchingMemberships = profile.memberships.filter(
    membership =>
      membership.team.name !== 'Role' &&
      !membership.team.name.startsWith('Role::'),
  );
  return matchingMemberships
    ? matchingMemberships.map(membership => membership.team)
    : [];
};

export const getRoles = profile => {
  const matchingMemberships = profile.memberships.filter(membership =>
    membership.team.name.startsWith('Role::'),
  );
  return matchingMemberships
    ? matchingMemberships.map(membership => membership.team)
    : [];
};

export const getColor = string => {
  /* eslint-disable no-bitwise, operator-assignment */
  let hash = 0;
  const chars = [...(string ? string.toString() : '')];
  chars.forEach(char => {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash = hash & hash;
  });
  const color = `000000${(0xbbbbbb & hash).toString(16)}`
    .slice(-6)
    .toUpperCase();
  return `#${color.substring(4)}${color.substring(0, 4)}`;
  /* eslint-enable no-bitwise, operator-assignment */
};

export const isGuest = profile =>
  profile.spaceAdmin === false && getRoles(profile).length === 0;
