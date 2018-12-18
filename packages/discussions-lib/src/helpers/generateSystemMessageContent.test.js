import generateContent from './generateSystemMessageContent';

const USER1 = { username: 'User 1' };
const USER2 = { username: 'User 2' };
const MESSAGE1 = { content: [{ type: 'text', value: 'Hello' }] };
const MESSAGE2 = { content: [{ type: 'text', value: 'World' }] };

describe('generateContent', () => {
  it('returns a text token with "invalid" if action does not match  ', () => {
    expect(generateContent('Invalid', [])).toEqual([
      { type: 'text', value: 'Invalid system message' },
    ]);
  });

  describe('Invitation Sent', () => {
    it('returns invitation user sent message', () => {
      const content = [
        { type: 'user', name: 'user', value: USER1 },
        { type: 'user', name: 'invitedBy', value: USER2 },
      ];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'was invited by' },
        { type: 'user', value: USER2 },
      ];
      expect(generateContent('Invitation Sent', content)).toEqual(expected);
    });

    it('returns invitation email sent message', () => {
      const content = [
        { type: 'text', name: 'invitationEmail', value: 'test.user@kinops.io' },
        { type: 'user', name: 'invitedBy', value: USER2 },
      ];
      const expected = [
        { type: 'text', value: 'test.user@kinops.io' },
        { type: 'text', value: 'was invited by' },
        { type: 'user', value: USER2 },
      ];
      expect(generateContent('Invitation Sent', content)).toEqual(expected);
    });
  });

  describe('Invitation Removed', () => {
    it('returns invitation user removed message', () => {
      const content = [
        { type: 'user', name: 'user', value: USER1 },
        { type: 'user', name: 'removedBy', value: USER2 },
      ];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'had their invitation removed by' },
        { type: 'user', value: USER2 },
      ];
      expect(generateContent('Invitation Removed', content)).toEqual(expected);
    });

    it('returns invitation email removed message', () => {
      const content = [
        { type: 'text', name: 'invitationEmail', value: 'test.user@kinops.io' },
        { type: 'user', name: 'removedBy', value: USER2 },
      ];
      const expected = [
        { type: 'text', value: 'test.user@kinops.io' },
        { type: 'text', value: 'had their invitation removed by' },
        { type: 'user', value: USER2 },
      ];
      expect(generateContent('Invitation Removed', content)).toEqual(expected);
    });
  });

  describe('Participant Created', () => {
    it('returns participant created message', () => {
      const content = [
        { type: 'user', name: 'user', value: USER1 },
        { type: 'user', name: 'createdBy', value: USER2 },
      ];
      // "USER1 joined the discussion after being invited by USER2"
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'was added as a participant by' },
        { type: 'user', value: USER2 },
      ];
      expect(generateContent('Participant Created', content)).toEqual(expected);
    });
  });

  describe('Participant Joined', () => {
    it('returns joined as user message', () => {
      const content = [
        { type: 'user', name: 'user', value: USER1 },
        { type: 'user', name: 'invitedBy', value: USER2 },
      ];
      // "USER1 joined the discussion after being invited by USER2"
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'joined the discussion after being invited by' },
        { type: 'user', value: USER2 },
      ];
      expect(generateContent('Participant Joined', content)).toEqual(expected);
    });

    it('returns joined via email message', () => {
      const content = [
        { type: 'user', name: 'user', value: USER1 },
        { type: 'text', name: 'invitationEmail', value: 'test.user@kinops.io' },
        { type: 'user', name: 'invitedBy', value: USER2 },
      ];
      //  USER1 joined the discussion after USER2 sent an invitation to EMAIL
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'joined the discussion after' },
        { type: 'user', value: USER2 },
        { type: 'text', value: 'sent an invitation to test.user@kinops.io' },
      ];
      expect(generateContent('Participant Joined', content)).toEqual(expected);
    });

    it('returns joined as owner message', () => {
      const content = [
        { name: 'user', type: 'user', value: USER1 },
        { name: 'joinedAsOwner', type: 'json', value: 'true' },
      ];
      // USER1 joined the discussion after being authorized as an owner
      const expected = [
        { type: 'user', value: USER1 },
        {
          type: 'text',
          value: 'joined the discussion after being authorized as an owner',
        },
      ];
      expect(generateContent('Participant Joined', content)).toEqual(expected);
    });

    it('returns joined as space admin message', () => {
      const content = [
        { name: 'user', type: 'user', value: USER1 },
        { name: 'joinedAsAdmin', type: 'json', value: 'true' },
      ];
      // USER1 joined the discussion after being authorized as a space admin
      const expected = [
        { type: 'user', value: USER1 },
        {
          type: 'text',
          value:
            'joined the discussion after being authorized as a space admin',
        },
      ];
      expect(generateContent('Participant Joined', content)).toEqual(expected);
    });

    it('returns joined by join policy message', () => {
      const content = [{ name: 'user', type: 'user', value: USER1 }];
      // USER1 joined the discussion after being authorized by the join policy
      const expected = [
        { type: 'user', value: USER1 },
        {
          type: 'text',
          value:
            'joined the discussion after being authorized by the join policy',
        },
      ];
      expect(generateContent('Participant Joined', content)).toEqual(expected);
    });
  });

  describe('Participant Left', () => {
    it('returns participant left message', () => {
      const content = [{ type: 'user', name: 'user', value: USER1 }];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'has left' },
      ];
      expect(generateContent('Participant Left', content)).toEqual(expected);
    });
  });

  describe('Participant Removed', () => {
    it('returns participant removed message', () => {
      const content = [
        { type: 'user', name: 'user', value: USER1 },
        { type: 'user', name: 'removedBy', value: USER2 },
      ];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'has been removed by' },
        { type: 'user', value: USER2 },
      ];
      expect(generateContent('Participant Removed', content)).toEqual(expected);
    });
  });

  describe('Discussion Updated', () => {
    it('returns the discussion updated message', () => {
      const previousValues = { title: 'Previous Title' };
      const values = { title: 'New Title' };
      const content = [
        { type: 'user', name: 'updatedBy', value: USER1 },
        {
          type: 'json',
          name: 'previousValues',
          value: JSON.stringify(previousValues),
        },
        { type: 'json', name: 'values', value: JSON.stringify(values) },
      ];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'updated the discussion' },
        { type: 'text', value: 'title from [Previous Title] to [New Title]' },
      ];
      expect(generateContent('Discussion Updated', content)).toEqual(expected);
    });

    it('returns the discussion updated message with multiple changes', () => {
      const previousValues = { title: 'Previous Title', description: '..' };
      const values = { title: 'New Title', description: 'Hello World' };
      const content = [
        { type: 'user', name: 'updatedBy', value: USER1 },
        {
          type: 'json',
          name: 'previousValues',
          value: JSON.stringify(previousValues),
        },
        { type: 'json', name: 'values', value: JSON.stringify(values) },
      ];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'updated the discussion' },
        { type: 'text', value: 'title from [Previous Title] to [New Title]' },
        { type: 'text', value: ', and description from [..] to [Hello World]' },
      ];
      expect(generateContent('Discussion Updated', content)).toEqual(expected);
    });

    it('returns the discussion update message with changed owners', () => {
      const previousValues = {
        owningUsers: [
          { username: 'alice@kinops.io' },
          { username: 'bob@kinops.io' },
        ],
        owningTeams: [{ name: 'IT' }],
      };
      const values = {
        owningUsers: [{ username: 'alice@kinops.io' }],
        owningTeams: [{ name: 'IT' }, { name: 'HR' }],
      };
      const content = [
        { type: 'user', name: 'updatedBy', value: USER1 },
        {
          type: 'json',
          name: 'previousValues',
          value: JSON.stringify(previousValues),
        },
        { type: 'json', name: 'values', value: JSON.stringify(values) },
      ];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'updated the discussion' },
        {
          type: 'text',
          value:
            'owning users from [alice@kinops.io, bob@kinops.io] to [alice@kinops.io]',
        },
        { type: 'text', value: ', and owning teams from [IT] to [IT, HR]' },
      ];
      expect(generateContent('Discussion Updated', content)).toEqual(expected);
    });
  });

  describe('Message Updated', () => {
    it('returns the message updated message', () => {
      const content = [
        { type: 'user', name: 'updatedBy', value: USER1 },
        { type: 'message', name: 'previousMessage', value: MESSAGE1 },
        { type: 'message', name: 'message', value: MESSAGE2 },
      ];
      const expected = [
        { type: 'user', value: USER1 },
        { type: 'text', value: 'changed a message from' },
        { type: 'message', value: MESSAGE1 },
        { type: 'text', value: 'to' },
        { type: 'message', value: MESSAGE2 },
      ];
      expect(generateContent('Message Updated', content)).toEqual(expected);
    });
  });
});
