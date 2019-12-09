import { is, List, Map, Record } from 'immutable';
import { namespaceBuilder, withPayload } from '../../utils';
const ns = namespaceBuilder('common/activityFeed');

export const types = {
  INIT_ACTIVITY_FEED: ns('INIT_ACTIVITY_FEED'),
  FETCH_DATA_REQUEST: ns('FETCH_DATA_REQUEST'),
  FETCH_DATA_COMPLETE: ns('FETCH_DATA_COMPLETE'),
  FETCH_DATA_SOURCE_REQUEST: ns('FETCH_DATA_SOURCE_REQUEST'),
  FETCH_DATA_SOURCE_SUCCESS: ns('FETCH_DATA_SOURCE_SUCCESS'),
  FETCH_DATA_SOURCE_FAILURE: ns('FETCH_DATA_SOURCE_FAILURE'),
  NEXT_PAGE: ns('NEXT_PAGE'),
  PREVIOUS_PAGE: ns('PREVIOUS_PAGE'),
  RESET_PAGING: ns('RESET_PAGING'),
  DELETE_ACTIVITY_FEED: ns('DELETE_ACTIVITY_FEED'),
};

export const actions = {
  initActivityFeed: withPayload(types.INIT_ACTIVITY_FEED),
  fetchDataRequest: withPayload(types.FETCH_DATA_REQUEST),
  fetchDataComplete: withPayload(types.FETCH_DATA_COMPLETE),
  fetchDataSourceRequest: withPayload(types.FETCH_DATA_SOURCE_REQUEST),
  fetchDataSourceSuccess: withPayload(types.FETCH_DATA_SOURCE_SUCCESS),
  fetchDataSourceFailure: withPayload(types.FETCH_DATA_SOURCE_FAILURE),
  nextPage: withPayload(types.NEXT_PAGE),
  previousPage: withPayload(types.PREVIOUS_PAGE),
  resetPaging: withPayload(types.RESET_PAGING),
  deleteActivityFeed: withPayload(types.DELETE_ACTIVITY_FEED),
};

export const FeedState = Record({
  dataSources: null,
  loading: true,
  errors: null,
  data: List(),
  index: 0,
  pageSize: 25,
  pageStaging: null,
  pageData: null,
  pageDataElements: null,
  joinByDirection: 'DESC',
});

export const DataSource = Record({
  data: List(),
  shouldFetch: true,
  loading: false,
  error: null,
  completed: false,
  fn: null,
  params: null,
  paramsFn: null,
  transform: null,
  result: null,
  joinValueFn: null,
  component: null,
});

const initializeFeed = ({
  dataSources = {},
  pageSize = 25,
  joinByDirection = 'DESC',
  joinBy = o => o[Object.keys(o)[0]],
  joinByComparator,
}) =>
  FeedState({
    dataSources: Map(dataSources).map(initializeDataSource(joinBy)),
    pageSize,
    joinByDirection,
    joinByComparator,
  });

const initializeDataSource = joinByDefault => ({
  data,
  fn,
  params: paramsFn,
  transform,
  joinBy = joinByDefault,
  component = () => null,
}) =>
  DataSource({
    ...(data
      ? {
          data: List(data),
          shouldFetch: false,
          completed: true,
        }
      : {
          fn,
          paramsFn,
          transform,
          params: paramsFn(),
        }),
    component,
    joinValueFn:
      typeof joinBy === 'function'
        ? o => {
            try {
              return joinBy(o);
            } catch (e) {
              console.warn(
                `Error while calculating values to join by. ${e.message}`,
              );
              return undefined;
            }
          }
        : o => o[joinBy],
  });

export const reducer = (state = Map(), { type, payload }) => {
  switch (type) {
    case types.INIT_ACTIVITY_FEED:
      return state.set(payload.feedKey, initializeFeed(payload));
    case types.FETCH_DATA_REQUEST:
      return state.setIn([payload.feedKey, 'loading'], true);
    case types.FETCH_DATA_SOURCE_REQUEST:
      return state.setIn(
        [payload.feedKey, 'dataSources', payload.sourceName, 'loading'],
        true,
      );
    case types.FETCH_DATA_SOURCE_SUCCESS:
      return state
        .updateIn(
          [payload.feedKey, 'dataSources', payload.sourceName],
          source => {
            const nextParams = source.paramsFn(source.params, payload.result);
            const completed =
              payload.result.data.length === 0 ||
              !nextParams ||
              is(Map(nextParams), Map(source.params));
            const shouldFetch =
              !completed &&
              source.data.size + payload.result.data.length <
                state.getIn([payload.feedKey, 'pageSize']);
            return source
              .set('completed', completed)
              .set('shouldFetch', shouldFetch)
              .set('loading', false)
              .set('result', payload.result)
              .update('data', data => data.push(...payload.result.data))
              .set('params', nextParams);
          },
        )
        .update(payload.feedKey, mergeDataHelper)
        .update(payload.feedKey, setPageDataFromStaging);
    case types.FETCH_DATA_SOURCE_FAILURE:
      return state
        .updateIn(
          [payload.feedKey, 'dataSources', payload.sourceName],
          source =>
            source
              .set('loading', false)
              .set('error', payload.error)
              .set('completed', true)
              .set('shouldFetch', false),
        )
        .update(payload.feedKey, mergeDataHelper)
        .update(payload.feedKey, setPageDataFromStaging);
    case types.RESET_PAGING:
      return state
        .update(payload.feedKey, feed => {
          const pageSize = payload.pageSize || feed.get('pageSize');
          return feed
            .set('index', 0)
            .set('pageSize', pageSize)
            .set('pageStaging', feed.data.slice(0, pageSize).toJS());
        })
        .update(payload.feedKey, setPageDataFromStaging);
    case types.NEXT_PAGE:
      return state
        .update(payload.feedKey, feed => {
          const nextIndex = feed.index + feed.pageSize;
          return feed
            .set('index', nextIndex)
            .set(
              'pageStaging',
              feed.data.slice(nextIndex, nextIndex + feed.pageSize).toJS(),
            );
        })
        .update(payload.feedKey, setPageDataFromStaging);
    case types.PREVIOUS_PAGE:
      return state
        .update(payload.feedKey, feed => {
          const nextIndex = Math.max(feed.index - feed.pageSize, 0);
          return feed
            .set('index', nextIndex)
            .set(
              'pageStaging',
              feed.data.slice(nextIndex, nextIndex + feed.pageSize).toJS(),
            );
        })
        .update(payload.feedKey, setPageDataFromStaging);
    case types.DELETE_ACTIVITY_FEED:
      return state.delete(payload.feedKey);
    default:
      return state;
  }
};

/**
 * Sets pageData from pageStaging if we have a full page worth of records or
 * all of the sources are completed and have no data left.
 */
const setPageDataFromStaging = f =>
  (f.pageStaging && f.pageStaging.length === f.pageSize) ||
  f.dataSources.every(s => s.completed && !s.data.size)
    ? f
        .set('pageData', f.pageStaging)
        .set(
          'pageDataElements',
          f.pageStaging.map(o =>
            f.getIn(['dataSources', o.__sourceName, 'component'])(o),
          ),
        )
    : f;

/**
 * Filters data sources to those that are not completed,
 * or completed but still have data to merge
 */
const filterSourcesForMerging = s => !s.completed || s.data.size;

/**
 * Takes the data fetched by each dataSource and merges it into a single list,
 * stopping when any one dataSource is out of data.
 */
const mergeDataHelper = originalFeed => {
  // If any sources are still loading, don't merge data yet
  if (originalFeed.dataSources.some(s => s.loading)) {
    return originalFeed;
  }
  let feed = originalFeed;
  // If there are errors in any dataSources, set errors on the feed
  console.log(
    'DATA MERGE START',
    feed.dataSources
      .map(s => s.error)
      .filter(e => e)
      .toJS(),
  );
  if (feed.dataSources.some(s => s.error)) {
    feed = feed.set(
      'errors',
      feed.dataSources.map(s => s.error).filter(e => e),
    );
  }
  // While all (not completed) sources have data, merge records into one list
  while (
    feed.dataSources.filter(filterSourcesForMerging).size &&
    feed.dataSources.filter(filterSourcesForMerging).every(s => s.data.size)
  ) {
    // Map each dataSource to its next value and sort the map of first values
    let nextValues = feed.dataSources
      .filter(filterSourcesForMerging)
      .map(s => s.joinValueFn(s.data.first()))
      .sort(feed.joinByComparator);
    // If joinByComparator was not provided and direction should be DESC, reverse the map
    if (!feed.joinByComparator && feed.joinByDirection !== 'ASC') {
      nextValues = nextValues.reverse();
    }
    // Get the dataSource whose next value should be added to the main list
    const nextValueSource = nextValues.keySeq().first();
    const nextValue = feed
      .getIn(['dataSources', nextValueSource, 'data'])
      .first();

    // Move the next value from the appropriate dataSource to the feed data List
    feed = feed
      .update('data', d =>
        d.push({ ...nextValue, __sourceName: nextValueSource }),
      )
      .updateIn(['dataSources', nextValueSource, 'data'], d => d.rest());
  }
  console.log('DATA MERGE END', feed.get('data').size);
  // Check if any dataSources will need to be fetched next time we query data,
  // and update the pageStaging from the current index
  return feed
    .update('dataSources', dataSources =>
      dataSources.map(s =>
        s.set('shouldFetch', !s.completed && s.data.size < feed.pageSize),
      ),
    )
    .set('loading', false)
    .set(
      'pageStaging',
      feed.data.slice(feed.index, feed.index + feed.pageSize).toJS(),
    );
};
