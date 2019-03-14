import { List } from 'immutable';
import moment from 'moment';
import { select, call, put } from 'redux-saga/effects';
import { actions } from '../modules/queue';
import { types as errorTypes } from '../modules/errors';

global.bundle = {
  apiLocation: () => '/acme/app/api/v1',
};
const {
  searchSubmissions,
  fetchSubmission,
  updateSubmission,
  SubmissionSearch,
} = require('@kineticdata/react');
const { Filter, Profile } = require('../../records');
const {
  ERROR_STATUS_STRING,
  TOO_MANY_STATUS_STRING,
  getAppSettings,
  fetchListTask,
  fetchCurrentItemTask,
  updateQueueItemTask,
  prepareStatusFilter,
  prepareDateRangeFilter,
  getSubmissionDate,
  sortSubmissions,
  buildSearch,
  prepareUnassignedFilter,
  prepareMineFilter,
  prepareTeammatesFilter,
  getKappSlug,
} = require('./queue');

const findQuery = (searcher, value) =>
  searcher.query.find(q => q.lvalue === value);

// Helper that performs the date transformation we expect to be done by the
// combination of prepareDateRangeFilter and SubmissionSearch.
const expectedDateFn = date =>
  moment(date)
    .toDate()
    .toISOString();

describe('queue saga', () => {
  describe('filter assembling functions', () => {
    let filter;
    let searcher;
    let appSettings;

    beforeEach(() => {
      filter = new Filter();
      searcher = new SubmissionSearch();

      appSettings = {
        myTeams: List([{ name: 'REAL_TEAM' }]),
        myTeammates: List([Profile({ username: 'you@yours.com' })]),
        profile: new Profile({ username: 'me@mine.com' }),
      };
    });

    describe('#prepareUnassignedFilter', () => {
      test('does not add to the query if unassigned is false', () => {
        prepareUnassignedFilter(
          searcher,
          filter.setIn(['assignments', 'unassigned'], false),
          appSettings,
        );
        expect(searcher.query).toEqual([]);
      });

      test('does not add to the query if user is in no teams', () => {
        prepareUnassignedFilter(
          searcher,
          filter.setIn(['assignments', 'unassigned'], true),
          { ...appSettings, myTeams: List() },
        );
        expect(searcher.query).toEqual([]);
      });

      test('queries unassigned for all my teams if filter does not include teams', () => {
        prepareUnassignedFilter(
          searcher,
          filter.setIn(['assignments', 'unassigned'], true),
          appSettings,
        );
        expect(searcher.query).toEqual([
          {
            op: 'and',
            context: [
              { lvalue: 'values[Assigned Individual]', op: 'eq', rvalue: null },
              {
                lvalue: 'values[Assigned Team]',
                op: 'in',
                rvalue: ['REAL_TEAM'],
              },
            ],
          },
        ]);
      });

      test('queries unassigned for intersection of my teams and filters teams', () => {
        prepareUnassignedFilter(
          searcher,
          filter
            .setIn(['assignments', 'unassigned'], true)
            .set('teams', List(['REAL_TEAM', 'OTHER_TEAM'])),
          {
            ...appSettings,
            myTeams: List([{ name: 'REAL_TEAM' }, { name: 'FAKE_TEAM' }]),
          },
        );
        expect(searcher.query).toEqual([
          {
            op: 'and',
            context: [
              { lvalue: 'values[Assigned Individual]', op: 'eq', rvalue: null },
              {
                lvalue: 'values[Assigned Team]',
                op: 'in',
                rvalue: ['REAL_TEAM'],
              },
            ],
          },
        ]);
      });
    });

    describe('#prepareMineFilter', () => {
      test('does not add to the query if mine is false', () => {
        prepareMineFilter(
          searcher,
          filter.setIn(['assignments', 'mine'], false),
          appSettings,
        );
        expect(searcher.query).toEqual([]);
      });

      test('queries by assigned individual == me', () => {
        prepareMineFilter(
          searcher,
          filter.setIn(['assignments', 'mine'], true),
          appSettings,
        );
        expect(searcher.query).toEqual([
          {
            op: 'and',
            context: [
              {
                lvalue: 'values[Assigned Individual]',
                op: 'eq',
                rvalue: 'me@mine.com',
              },
            ],
          },
        ]);
      });

      test('also queries by teams if the filter contains teams', () => {
        prepareMineFilter(
          searcher,
          filter
            .setIn(['assignments', 'mine'], true)
            .set('teams', List(['REAL_TEAM', 'OTHER_TEAM'])),
          appSettings,
        );
        expect(searcher.query).toEqual([
          {
            op: 'and',
            context: [
              {
                lvalue: 'values[Assigned Team]',
                op: 'in',
                rvalue: ['REAL_TEAM', 'OTHER_TEAM'],
              },
              {
                lvalue: 'values[Assigned Individual]',
                op: 'eq',
                rvalue: 'me@mine.com',
              },
            ],
          },
        ]);
      });
    });

    describe('#prepareTeammatesFilter', () => {
      test('does not add to the query if teammates is false', () => {
        prepareTeammatesFilter(
          searcher,
          filter.setIn(['assignments', 'teammates'], false),
          appSettings,
        );
        expect(searcher.query).toEqual([]);
      });

      test('does not add to the query if user is has no teammates', () => {
        prepareTeammatesFilter(
          searcher,
          filter.setIn(['assignments', 'teammates'], true),
          { ...appSettings, myTeammates: List() },
        );
        expect(searcher.query).toEqual([]);
      });

      test('queries by my teammates and my teams by default', () => {
        prepareTeammatesFilter(
          searcher,
          filter.setIn(['assignments', 'teammates'], true),
          appSettings,
        );
        expect(searcher.query).toEqual([
          {
            op: 'and',
            context: [
              {
                lvalue: 'values[Assigned Individual]',
                op: 'in',
                rvalue: ['you@yours.com'],
              },
              {
                lvalue: 'values[Assigned Team]',
                op: 'in',
                rvalue: ['REAL_TEAM'],
              },
            ],
          },
        ]);
      });

      test('if teams filter is applied queries by an intersection of my teams and filter teams', () => {
        prepareTeammatesFilter(
          searcher,
          filter
            .setIn(['assignments', 'teammates'], true)
            .set('teams', List(['REAL_TEAM', 'OTHER_TEAM'])),
          {
            ...appSettings,
            myTeams: List([{ name: 'REAL_TEAM' }, { name: 'FAKE_TEAM' }]),
          },
        );
        expect(searcher.query).toEqual([
          {
            op: 'and',
            context: [
              {
                lvalue: 'values[Assigned Individual]',
                op: 'in',
                rvalue: ['you@yours.com'],
              },
              {
                lvalue: 'values[Assigned Team]',
                op: 'in',
                rvalue: ['REAL_TEAM'],
              },
            ],
          },
        ]);
      });
    });

    describe('#prepareStatusFilter', () => {
      test('it uses the active statuses if there are no statuses', () => {
        searcher = prepareStatusFilter(searcher, filter);
        const query = findQuery(searcher, 'values[Status]');
        expect(query.rvalue).toContain('Open');
        expect(query.rvalue).toContain('Pending');
        expect(query.op).toBe('in');
      });

      test('it does change the status the searcher uses', () => {
        filter = filter.set('status', List(['FAKE_STATUS']));
        searcher = prepareStatusFilter(searcher, filter);
        const query = findQuery(searcher, 'values[Status]');
        expect(query.rvalue).toContain('FAKE_STATUS');
        expect(query.op).toBe('eq');
      });
    });

    describe('#prepareDateRangeFilter', () => {
      test('no preset or custom range', () => {
        filter = filter
          .setIn(['dateRange', 'preset'], '')
          .setIn(['dateRange', 'custom'], false);
        searcher = prepareDateRangeFilter(searcher, filter, moment());
        expect(searcher.searchMeta.timeline).toBeUndefined();
        expect(searcher.searchMeta.start).toBeUndefined();
        expect(searcher.searchMeta.end).toBeUndefined();
      });

      test('when custom range', () => {
        filter = filter
          .setIn(['dateRange', 'custom'], true)
          .setIn(['dateRange', 'timeline'], 'updatedAt')
          .setIn(['dateRange', 'start'], '2017-09-02')
          .setIn(['dateRange', 'end'], '2017-09-05');
        searcher = prepareDateRangeFilter(searcher, filter, moment());
        expect(searcher.searchMeta.timeline).toBe('updatedAt');
        expect(searcher.searchMeta.start).toEqual(expectedDateFn('2017-09-02'));
        expect(searcher.searchMeta.end).toEqual(expectedDateFn('2017-09-06'));
      });

      test('when using presets', () => {
        filter = filter
          .setIn(['dateRange', 'timeline'], 'closedAt')
          .setIn(['dateRange', 'preset'], '3days');
        searcher = prepareDateRangeFilter(
          searcher,
          filter,
          moment('2017-09-08T19:30:00.000Z'),
        );
        expect(searcher.searchMeta.timeline).toBe('closedAt');
        expect(searcher.searchMeta.start).toEqual(expectedDateFn('2017-09-05'));
        expect(searcher.searchMeta.end).toBe('2017-09-08T19:30:00.000Z');
      });

      test('when there is an invalid preset defaults to 7 days', () => {
        filter = filter
          .setIn(['dateRange', 'timeline'], 'closedAt')
          .setIn(['dateRange', 'preset'], 'foo');
        searcher = prepareDateRangeFilter(
          searcher,
          filter,
          moment('2017-09-08T19:30:00.000Z'),
        );
        expect(searcher.searchMeta.timeline).toBe('closedAt');
        expect(searcher.searchMeta.start).toEqual(expectedDateFn('2017-09-01'));
        expect(searcher.searchMeta.end).toBe('2017-09-08T19:30:00.000Z');
      });
    });

    describe('#getSubmissionDate', () => {
      const submission = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        closedAt: 'closedAt',
        values: {
          due: 'due',
        },
      };

      ['createdAt', 'updatedAt', 'closedAt'].forEach(timeline =>
        test(`gets timeline date '${timeline}'`, () => {
          expect(getSubmissionDate(submission, timeline)).toBe(timeline);
        }),
      );
      test('gets value date', () => {
        expect(getSubmissionDate(submission, 'due')).toBe('due');
      });
    });

    describe('#sortSubmissions', () => {
      let submissions;

      const today = () => new Date().toISOString();
      const weekAgo = () =>
        moment()
          .subtract(7, 'days')
          .toDate()
          .toISOString();
      const fiveDaysAgo = () =>
        moment()
          .subtract(5, 'days')
          .toDate()
          .toISOString();

      beforeEach(() => {
        submissions = [
          {
            id: '1',
            createdAt: today(),
            values: { scheduled: today() },
          },
          {
            id: '2',
            createdAt: weekAgo(),
            values: { scheduled: fiveDaysAgo(), due: today() },
          },
          {
            id: '3',
            createdAt: fiveDaysAgo(),
            values: { scheduled: weekAgo() },
          },
        ];
      });

      describe('when sorting by a timeline', () => {
        test('createdAt ascending', () => {
          filter = filter.set('sortBy', 'createdAt');

          const sorted = sortSubmissions(submissions, filter).map(s => s.id);
          expect(sorted).toEqual(['2', '3', '1']);
        });
      });

      describe('when sorting by values', () => {
        describe('when all submissions have the value', () => {
          test('scheduled value ascending', () => {
            filter = filter.set('sortBy', 'scheduled');

            const sorted = sortSubmissions(submissions, filter).map(s => s.id);
            expect(sorted).toEqual(['3', '2', '1']);
          });
        });
      });

      describe('when only some submissions have the value', () => {
        test('due value ascending', () => {
          filter = filter.set('sortBy', 'due');

          const sorted = sortSubmissions(submissions, filter).map(s => s.id);
          expect(sorted).toEqual(['3', '1', '2']);
        });
      });

      describe('when none of the submissions have the value', () => {
        test('sorts by createdAt', () => {
          filter = filter.set('sortBy', 'fake');

          const sorted = sortSubmissions(submissions, filter).map(s => s.id);
          expect(sorted).toEqual(['2', '3', '1']);
        });
      });
    });
  });

  describe('#fetchCurrentFilterSaga', () => {
    let action;
    let appSettings;
    let search;
    let response;

    beforeEach(() => {
      action = { payload: { name: 'Filter Name' } };
      appSettings = {};
      search = { search: {}, assignmentContext: [{}] };
      response = { submissions: [] };
    });

    describe('when there are server errors', () => {
      test('it sets the list status to indicate an error', () => {
        const saga = fetchListTask(action);

        // First get the app settings out of the state.
        expect(saga.next().value).toEqual(select(getAppSettings));
        // Second get the kapp slug out of the state.
        expect(saga.next(appSettings).value).toEqual(select(getKappSlug));
        // Build the search criteria.
        expect(saga.next('queue').value).toEqual(
          call(buildSearch, action.payload, appSettings),
        );
        // Execute the search.
        expect(saga.next(search).value).toEqual(
          call(searchSubmissions, {
            kapp: 'queue',
            search: search.search,
            limit: 1000,
          }),
        );
        // Return an error.
        expect(saga.next({ serverError: 'some error' }).value).toEqual(
          put(actions.setListStatus(action.payload, ERROR_STATUS_STRING)),
        );
      });
    });

    describe('when there are too many items', () => {
      test('it sets the list status to indicate an error', () => {
        const saga = fetchListTask(action);

        // First get the app settings out of the state.
        expect(saga.next().value).toEqual(select(getAppSettings));
        // Second get the kapp slug out of the state.
        expect(saga.next(appSettings).value).toEqual(select(getKappSlug));
        // Build the search criteria.
        expect(saga.next('queue').value).toEqual(
          call(buildSearch, action.payload, appSettings),
        );
        // Execute the search.
        expect(saga.next(search).value).toEqual(
          call(searchSubmissions, {
            kapp: 'queue',
            search: search.search,
            limit: 1000,
          }),
        );
        // Return an error.
        expect(saga.next({ nextPageToken: 'some token' }).value).toEqual(
          put(actions.setListStatus(action.payload, TOO_MANY_STATUS_STRING)),
        );
      });
    });

    describe('when request is successful', () => {
      test('it sets the list items', () => {
        const saga = fetchListTask(action);

        // First get the app settings out of the state.
        expect(saga.next().value).toEqual(select(getAppSettings));
        // Second get the kapp slug out of the state.
        expect(saga.next(appSettings).value).toEqual(select(getKappSlug));
        // Build the search criteria.
        expect(saga.next('queue').value).toEqual(
          call(buildSearch, action.payload, appSettings),
        );
        // Execute the search.
        expect(saga.next(search).value).toEqual(
          call(searchSubmissions, {
            kapp: 'queue',
            search: search.search,
            limit: 1000,
          }),
        );
        // It sorts the submissions
        expect(saga.next(response).value).toEqual(
          call(sortSubmissions, response.submissions, action.payload),
        );
        expect(saga.next(response.submissions).value).toEqual(
          put(actions.setListItems(action.payload, response.submissions)),
        );
      });
    });
  });

  describe('#fetchCurrentItemTask', () => {
    let action;
    let response;

    beforeEach(() => {
      action = { payload: 'abc' };
      response = { submission: {} };
    });

    describe('when request is successful', () => {
      test('it sets the list items', () => {
        const include =
          'details,values,attributes,form,form.kapp,children,children.details,children.form,children.values,form.attributes,parent,parent.details,parent.values,parent.form,parent.form.kapp';
        const saga = fetchCurrentItemTask(action);

        // Execute the search.
        expect(saga.next().value).toEqual(
          call(fetchSubmission, { id: action.payload, include }),
        );
        expect(saga.next(response).value).toEqual(
          put(actions.setCurrentItem(response.submission)),
        );
      });
    });
  });

  describe('#updateQueueItemTask', () => {
    const include =
      'details,values,attributes,form,form.kapp,children,children.details,children.form,children.values,form.attributes,parent,parent.details,parent.values,parent.form,parent.form.kapp';
    const id = 'abc123';
    const values = { 'Assigned Individual': 'Me' };
    const response = { submission: { id: 'abc123', values: {} } };
    describe('when update is successful', () => {
      describe('when given no callback', () => {
        it('calls updateSubmission but does not dispatch any other actions', () => {
          const saga = updateQueueItemTask({ payload: { id, values } });
          expect(saga.next().value).toEqual(
            call(updateSubmission, { id, values, include }),
          );
          expect(saga.next(response).done).toBe(true);
        });
      });

      describe('when onSuccess callback is passed in payload', () => {
        it('calls the callback with the updated sumbission', () => {
          const onSuccess = jest.fn();
          const saga = updateQueueItemTask({
            payload: { id, values, onSuccess },
          });
          expect(saga.next().value).toEqual(
            call(updateSubmission, { id, values, include }),
          );
          expect(saga.next(response).done).toBe(true);
          expect(onSuccess.mock.calls).toEqual([[response.submission]]);
        });
      });
    });

    describe('when update is unsuccessful', () => {
      it('returns a "put" effect with a generic error message', () => {
        const saga = updateQueueItemTask({ payload: { id, values } });
        expect(saga.next().value).toEqual(
          call(updateSubmission, { id, values, include }),
        );
        const effect = saga.next({ serverError: 'error' }).value;
        expect(effect.PUT.action.type).toEqual(errorTypes.ADD_NOTIFICATION);
        expect(effect.PUT.action.payload.msg).toEqual('Failed to update item!');
      });
    });
  });
});
