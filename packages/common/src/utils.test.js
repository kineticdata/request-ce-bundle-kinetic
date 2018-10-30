import { zip, withPayload, calculateDateRange } from './utils';
import moment from 'moment';

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

describe('calculateDateRange', () => {
  describe('preset', () => {
    it('subtracts the given number of days from the start of the current day', () => {
      const now = moment('2018-10-30T12:30');
      expect(calculateDateRange(now, '7days')).toEqual({
        start: moment('2018-10-23').toISOString(),
        end: now.toISOString(),
      });
    });
  });

  describe('custom', () => {
    it('calculates the start and end times given the two dates', () => {
      const now = moment('2018-10-30T12:30');
      expect(
        calculateDateRange(now, { start: '2018-10-24', end: '2018-10-26' }),
      ).toEqual({
        start: moment('2018-10-24').toISOString(),
        end: moment('2018-10-26')
          .add(1, 'day')
          .toISOString(),
      });
    });

    it('defaults the end time to now if one is not specified', () => {
      const now = moment('2018-10-30T12:30');
      expect(calculateDateRange(now, { start: '2018-10-24' })).toEqual({
        start: moment('2018-10-24').toISOString(),
        end: now.toISOString(),
      });
    });
  });
});
