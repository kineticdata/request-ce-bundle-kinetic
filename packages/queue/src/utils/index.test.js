import { zip, withPayload } from './index';

describe('zip', () => {
  test('returns empty object given empty arrays', () => {
    expect(zip([], [])).toEqual({});
  });

  test('combines given arrays', () => {
    expect(zip(['firstName', 'lastName'], ['Shayne', 'Koestler'])).toEqual({
      firstName: 'Shayne',
      lastName: 'Koestler',
    });
  });
});

describe('withPayload', () => {
  test('when only given the action type, action creator returns its first argument as payload', () => {
    const actionCreator = withPayload('AC1');
    expect(actionCreator('Hello World!')).toEqual({
      type: 'AC1',
      payload: 'Hello World!',
    });
  });

  test('when given the action type and names, action creator constructs payload object using given names', () => {
    const actionCreator = withPayload('AC2', 'firstName', 'lastName');
    expect(actionCreator('Shayne', 'Koestler')).toEqual({
      type: 'AC2',
      payload: { firstName: 'Shayne', lastName: 'Koestler' },
    });
  });
});
