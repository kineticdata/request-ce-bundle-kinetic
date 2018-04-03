import { getSubmissionPath } from './index';

describe('getSubmissionPath', () => {
  test('test with single argument, draft submission', () => {
    expect(getSubmissionPath({ id: 'abc', coreState: 'Draft' })).toEqual(
      '/requests/request/abc',
    );
  });

  test('test with single argument, submitted submission', () => {
    expect(getSubmissionPath({ id: 'abc', coreState: 'Submitted' })).toEqual(
      '/requests/request/abc/activity',
    );
  });

  test('test with a list type argument, draft submission', () => {
    expect(
      getSubmissionPath({ id: 'abc', coreState: 'Draft' }, null, 'open'),
    ).toEqual('/requests/open/request/abc');
  });

  test('test with a list type argument, submitted submission', () => {
    expect(
      getSubmissionPath({ id: 'abc', coreState: 'Submitted' }, null, 'open'),
    ).toEqual('/requests/open/request/abc/activity');
  });

  test('test with a mode argument, draft submission', () => {
    expect(getSubmissionPath({ id: 'abc', coreState: 'Draft' }, 'foo')).toEqual(
      '/requests/request/abc/foo',
    );
  });

  test('test with a mode argument, submitted submission', () => {
    expect(
      getSubmissionPath({ id: 'abc', coreState: 'Submitted' }, 'foo'),
    ).toEqual('/requests/request/abc/foo');
  });

  test('test with all arguments, draft submission', () => {
    expect(
      getSubmissionPath({ id: 'abc', coreState: 'Draft' }, 'review', 'open'),
    ).toEqual('/requests/open/request/abc/review');
  });

  test('test with all arguments, submitted submission', () => {
    expect(
      getSubmissionPath(
        { id: 'abc', coreState: 'Submitted' },
        'review',
        'open',
      ),
    ).toEqual('/requests/open/request/abc/review');
  });
});
