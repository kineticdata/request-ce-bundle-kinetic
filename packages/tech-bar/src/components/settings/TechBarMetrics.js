import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import {
  KappLink as Link,
  KappNavLink as NavLink,
  PageTitle,
  selectCurrentKapp,
  Utils,
  selectHasRoleSchedulerAdmin,
} from 'common';
import { MetricsSummary } from './metrics/MetricsSummary';
import {
  actions,
  DATE_FORMAT,
  MONTH_FORMAT,
} from '../../redux/modules/metrics';
import { I18n } from '../../../../app/src/I18nProvider';
import moment from 'moment';

export const TechBarMetricsComponent = ({
  mode,
  schedulerId,
  setSchedulerId,
  eventType,
  setEventType,
  techBars,
  eventTypes,
  dateRanges,
  selectedRange,
  setSelectedRange,
  selectedDate,
  setSelectedDate,
}) => (
  <Fragment>
    <PageTitle parts={['Tech Bar Metrics']} />
    <div className="page-container page-container--tech-bar-metrics">
      <div className="page-panel page-panel--scrollable">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">
                <I18n>tech bar</I18n>
              </Link>{' '}
              /{` `}
              <Link to="/settings">
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
            </h3>
            <h1>
              <I18n>Metrics</I18n>
            </h1>
          </div>
        </div>
        <div className="form p-0">
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="scheduler-select">
                <I18n>Tech Bar</I18n>
              </label>
              <I18n
                render={translate => (
                  <select
                    name="scheduler-select"
                    id="scheduler-select"
                    className="form-control"
                    value={schedulerId}
                    onChange={e => {
                      setSchedulerId(e.target.value);
                      setEventType('');
                    }}
                  >
                    <option value="">{translate('All Tech Bars')}</option>
                    {techBars.map(techBar => (
                      <option
                        value={techBar.values['Id']}
                        key={techBar.values['Id']}
                      >
                        {translate(techBar.values['Name'])}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            {schedulerId && (
              <div className="form-group col-md-6">
                <label htmlFor="event-type-select">Event Type</label>
                <I18n
                  render={translate => (
                    <select
                      name="event-type-select"
                      id="event-type-select"
                      className="form-control"
                      value={eventType}
                      onChange={e => {
                        setEventType(e.target.value);
                      }}
                    >
                      <option value="">{translate('All Event Types')}</option>
                      {eventTypes.map(eventType => (
                        <option value={eventType} key={eventType}>
                          {translate(eventType)}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <ul className="nav nav-tabs">
            <li role="presentation">
              <NavLink
                exact
                to={'/settings/metrics'}
                activeClassName="active"
                onClick={() => {
                  setSelectedRange('last30Days');
                }}
              >
                <I18n>
                  <I18n>Summary</I18n>
                </I18n>
              </NavLink>
            </li>
            {/*<li role="presentation">
              <NavLink
                exact
                to={'/settings/metrics/trend'}
                activeClassName="active"
                onClick={() => {
                  setSelectedRange('last12Months');
                }}
              >
                <I18n>Trend</I18n>
              </NavLink>
            </li>*/}
          </ul>
          <div className="form p-0 my-3">
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="date-range-select">
                  <I18n>Date Range</I18n>
                </label>
                <I18n
                  render={translate => (
                    <select
                      name="date-range-select"
                      id="date-range-select"
                      className="form-control"
                      value={selectedRange}
                      onChange={e => {
                        setSelectedRange(e.target.value);
                        setSelectedDate(
                          moment()
                            .add(-1, 'day')
                            .format(DATE_FORMAT),
                        );
                      }}
                    >
                      {mode === 'summary' && (
                        <option value="singleDay">
                          {translate('Single Day')}
                        </option>
                      )}
                      <option value="last7Days">
                        {translate('Last 7 Days')}
                      </option>
                      <option value="last30Days">
                        {translate('Last 30 Days')}
                      </option>
                      <option value="monthToDate">
                        {translate('Month to Date')}
                      </option>
                      {mode === 'trend' && (
                        <option value="last12Months">
                          {translate('Last 12 Months')}
                        </option>
                      )}
                      {mode === 'trend' && (
                        <option value="yearToDate">
                          {translate('Year To Date')}
                        </option>
                      )}
                    </select>
                  )}
                />
              </div>
              {selectedRange === 'singleDay' && (
                <div className="form-group col-md-6">
                  <label htmlFor="date-select">
                    <I18n>Date</I18n>
                  </label>
                  <input
                    type="date"
                    id="date-select"
                    className="form-control"
                    value={selectedDate}
                    onChange={e => {
                      setSelectedDate(e.target.value);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {mode === 'summary' && (
            <div>
              <MetricsSummary
                schedulerId={schedulerId}
                eventType={eventType}
                techBars={techBars}
              />
            </div>
          )}
          {mode === 'trend' && <div />}
        </div>
      </div>
    </div>
  </Fragment>
);

const fillDateArray = (
  start,
  length,
  interval,
  format,
  includeCurrent = false,
) =>
  Array(length)
    .fill()
    .map((v, i) =>
      start
        .clone()
        .add(-(i + (includeCurrent ? 0 : 1)), interval)
        .format(format),
    );

const buildDateRanges = () => {
  const today = moment().startOf('day');
  const thisMonth = moment().startOf('month');
  return {
    last7Days: fillDateArray(today, 7, 'day', DATE_FORMAT),
    last30Days: fillDateArray(today, 30, 'day', DATE_FORMAT),
    monthToDate: fillDateArray(today, today.date(), 'day', DATE_FORMAT, true),
    last12Months: fillDateArray(thisMonth, 12, 'month', MONTH_FORMAT, true),
    yearToDate: fillDateArray(
      thisMonth,
      thisMonth.month() + 1,
      'month',
      MONTH_FORMAT,
      true,
    ),
  };
};

export const mapStateToProps = (state, props) => {
  const techBars = selectHasRoleSchedulerAdmin(state)
    ? state.techBar.techBarApp.schedulers
    : state.techBar.techBarApp.schedulers.filter(
        s =>
          Utils.isMemberOf(
            state.app.profile,
            `Role::Scheduler::${s.values['Name']}`,
          ) ||
          Utils.isMemberOf(state.app.profile, `Scheduler::${s.values['Name']}`),
      );
  return {
    kapp: selectCurrentKapp(state),
    techBars,
    metrics: state.techBar.metrics.metrics,
  };
};

export const mapDispatchToProps = {
  push,
  fetchMetrics: actions.fetchMetrics,
};

const handleFetch = ({
  fetchMetrics,
  schedulerId,
  techBars = [],
  dateRanges,
  selectedRange,
  selectedDate,
}) => () =>
  fetchMetrics({
    schedulerIds: schedulerId
      ? [schedulerId]
      : techBars.map(techBar => techBar.values['Scheduler Id']),
    monthly: selectedRange === 'last12Months' || selectedRange === 'yearToDate',
    dates: dateRanges[selectedRange] || [selectedDate],
  });

export const TechBarMetrics = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ match: { params: { mode = 'summary' } } }) => ({
    mode: ['summary', 'trend'].includes(mode) ? mode : 'summary',
  })),
  withState('schedulerId', 'setSchedulerId', ''),
  withState('eventType', 'setEventType', ''),
  withState('dateRanges', 'setDateRanges', buildDateRanges()),
  withState('selectedRange', 'setSelectedRange', 'last30Days'),
  withState(
    'selectedDate',
    'setSelectedDate',
    moment()
      .add(-1, 'day')
      .format(DATE_FORMAT),
  ),
  withHandlers({ handleFetch }),
  withProps(({ schedulerId, metrics }) => {
    return {
      eventTypes:
        schedulerId && metrics.size > 0
          ? metrics.getIn([0, 'data', 'eventTypes']).map(event => event.type)
          : [],
    };
  }),
  lifecycle({
    componentDidMount() {
      this.props.handleFetch();
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.schedulerId !== prevProps.schedulerId ||
        this.props.selectedRange !== prevProps.selectedRange ||
        this.props.selectedDate !== prevProps.selectedDate
      ) {
        this.props.handleFetch();
      }
    },
  }),
)(TechBarMetricsComponent);
