import { getSubmissionPath } from './utils';
const appLocation = '/kapps/kappSlug';

describe('getSubmissionPath', () => {
  test('test with single argument, draft submission', () => {
    expect(
      getSubmissionPath(appLocation, { id: 'abc', coreState: 'Draft' }),
    ).toEqual('/kapps/kappSlug/requests/request/abc');
  });

  test('test with single argument, submitted submission', () => {
    expect(
      getSubmissionPath(appLocation, { id: 'abc', coreState: 'Submitted' }),
    ).toEqual('/kapps/kappSlug/requests/request/abc/activity');
  });

  test('test with a list type argument, draft submission', () => {
    expect(
      getSubmissionPath(
        appLocation,
        { id: 'abc', coreState: 'Draft' },
        null,
        'open',
      ),
    ).toEqual('/kapps/kappSlug/requests/open/request/abc');
  });

  test('test with a list type argument, submitted submission', () => {
    expect(
      getSubmissionPath(
        appLocation,
        { id: 'abc', coreState: 'Submitted' },
        null,
        'open',
      ),
    ).toEqual('/kapps/kappSlug/requests/open/request/abc/activity');
  });

  test('test with a mode argument, draft submission', () => {
    expect(
      getSubmissionPath(appLocation, { id: 'abc', coreState: 'Draft' }, 'foo'),
    ).toEqual('/kapps/kappSlug/requests/request/abc/foo');
  });

  test('test with a mode argument, submitted submission', () => {
    expect(
      getSubmissionPath(
        appLocation,
        { id: 'abc', coreState: 'Submitted' },
        'foo',
      ),
    ).toEqual('/kapps/kappSlug/requests/request/abc/foo');
  });

  test('test with all arguments, draft submission', () => {
    expect(
      getSubmissionPath(
        appLocation,
        { id: 'abc', coreState: 'Draft' },
        'review',
        'open',
      ),
    ).toEqual('/kapps/kappSlug/requests/open/request/abc/review');
  });

  test('test with all arguments, submitted submission', () => {
    expect(
      getSubmissionPath(
        appLocation,
        { id: 'abc', coreState: 'Submitted' },
        'review',
        'open',
      ),
    ).toEqual('/kapps/kappSlug/requests/open/request/abc/review');
  });
});
