import { newDiscussion } from './redux/modules/discussions';
import { canManage } from './helpers';

const adminProfile = {
  username: 'admin@kinops.io',
  email: 'admin@kinops.io',
  memberships: [],
  spaceAdmin: true,
};
const userProfile = {
  username: 'user@kinops.io',
  email: 'user@kinops.io',
  memberships: [
    { team: { name: 'IT' } },
    { team: { name: 'Support' } },
    { team: { name: 'Fulfillment' } },
  ],
};

describe('canManage', () => {
  it('returns true if user is a space admin', () => {
    const discussion = newDiscussion({ messages: { items: [] } });
    expect(canManage(discussion, adminProfile)).toBe(true);
  });

  it('returns true if user is included in the owningUsers', () => {
    const discussion = newDiscussion({
      messages: { items: [] },
      owningUsers: [
        { username: 'alex@kinops.io' },
        { username: 'user@kinops.io' },
      ],
    });
    expect(canManage(discussion, userProfile)).toBe(true);
  });

  it('returns true if user is a member of one of the owningTeams', () => {
    const discussion = newDiscussion({
      messages: { items: [] },
      owningTeams: [{ name: 'Admins' }, { name: 'Support' }],
    });
    expect(canManage(discussion, userProfile)).toBe(true);
  });

  it('returns false if none of the above are true', () => {
    const discussion = newDiscussion({ messages: { items: [] } });
    expect(canManage(discussion, userProfile)).toBe(false);
  });
});
