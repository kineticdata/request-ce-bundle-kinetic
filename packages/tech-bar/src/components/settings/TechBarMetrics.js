import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { selectCurrentKapp, Utils, selectHasRoleSchedulerAdmin } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { isActiveClass } from '../../utils';
import { Link } from '@reach/router';
import { MetricsSummary } from './metrics/MetricsSummary';
import { MetricsTrend } from './metrics/MetricsTrend';
import { MetricsExport } from './metrics/MetricsExport';
import { actions } from '../../redux/modules/metrics';
import { DATE_FORMAT, MONTH_FORMAT } from '../../constants';
import { I18n } from '@kineticdata/react';
import moment from 'moment';

export const TechBarMetricsComponent = ({
  clearMetrics,
  mode,
  tabMode,
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
              <Link to={`../../${mode ? '../' : ''}`}>
                <I18n>tech bar</I18n>
              </Link>{' '}
              /{` `}
              <Link to={`../${mode ? '../' : ''}`}>
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
                      clearMetrics();
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
              <Link
                to={`${mode ? '../' : ''}`}
                getProps={isActiveClass()}
                onClick={() => {
                  if (selectedRange !== 'last30Days') {
                    setSelectedRange('last30Days');
                    clearMetrics();
                  }
                }}
              >
                <I18n>
                  <I18n>Summary</I18n>
                </I18n>
              </Link>
            </li>
            <li role="presentation">
              <Link
                to={`${mode ? '../' : ''}trend`}
                getProps={isActiveClass()}
                onClick={() => {
                  if (selectedRange !== 'last12Months') {
                    setSelectedRange('last12Months');
                    clearMetrics();
                  }
                }}
              >
                <I18n>Trend</I18n>
              </Link>
            </li>
            <li role="presentation">
              <Link
                to={`${mode ? '../' : ''}export`}
                getProps={isActiveClass()}
                onClick={() => {
                  clearMetrics();
                  setSelectedRange('singleDay');
                  setSelectedDate(
                    moment()
                      .add(-1, 'day')
                      .format(DATE_FORMAT),
                  );
                }}
              >
                <I18n>Export</I18n>
              </Link>
            </li>
          </ul>
          <div className="form p-0 my-3">
            {tabMode !== 'export' ? (
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
                            e.target.value === 'singleMonth'
                              ? moment()
                                  .startOf('month')
                                  .format(DATE_FORMAT)
                              : moment()
                                  .add(-1, 'day')
                                  .format(DATE_FORMAT),
                          );
                          clearMetrics();
                        }}
                      >
                        {tabMode === 'summary' && (
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
                        <option value="singleMonth">
                          {translate('Single Month')}
                        </option>
                        <option value="monthToDate">
                          {translate('Month to Date')}
                        </option>
                        {tabMode === 'trend' && (
                          <option value="last12Months">
                            {translate('Last 12 Months')}
                          </option>
                        )}
                        {tabMode === 'trend' && (
                          <option value="yearToDate">
                            {translate('Year To Date')}
                          </option>
                        )}
                      </select>
                    )}
                  />
                </div>
                {(selectedRange === 'singleDay' ||
                  selectedRange === 'singleMonth') && (
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
                        const date = moment(e.target.value);
                        const newDate =
                          date.isValid() && selectedRange === 'singleMonth'
                            ? moment(e.target.value)
                                .startOf('month')
                                .format(DATE_FORMAT)
                            : e.target.value;
                        setSelectedDate(newDate);
                        if (selectedDate !== newDate) {
                          clearMetrics();
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="row">
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
              </div>
            )}
          </div>
          {tabMode === 'summary' && (
            <div>
              <MetricsSummary
                schedulerId={schedulerId}
                eventType={eventType}
                techBars={techBars}
              />
            </div>
          )}
          {tabMode === 'trend' && (
            <div>
              <MetricsTrend
                schedulerId={schedulerId}
                eventType={eventType}
                techBars={techBars}
                dates={
                  dateRanges[selectedRange]
                    ? dateRanges[selectedRange]
                    : selectedRange === 'singleMonth'
                      ? buildDateRangeForSelectedMonth(selectedDate)
                      : [selectedDate]
                }
                formatDate={date =>
                  moment(date).format(
                    selectedRange === 'last12Months' ||
                    selectedRange === 'yearToDate'
                      ? 'MMM, YYYY'
                      : 'll',
                  )
                }
              />
            </div>
          )}
          {tabMode === 'export' && (
            <div>
              <MetricsExport
                selectedDate={selectedDate}
                schedulerId={schedulerId}
                eventType={eventType}
                techBars={techBars}
              />
            </div>
          )}
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

const buildDateRangeForSelectedMonth = selectedDate => {
  const month = moment(selectedDate).endOf('month');
  return month.isValid()
    ? fillDateArray(month, month.daysInMonth(), 'day', DATE_FORMAT, true)
    : [null];
};

export const mapStateToProps = (state, props) => {
  const techBars = selectHasRoleSchedulerAdmin(state)
    ? state.techBarApp.schedulers
    : state.techBarApp.schedulers.filter(
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
    metrics: state.metrics.metrics,
  };
};

export const mapDispatchToProps = {
  fetchMetrics: actions.fetchMetrics,
  clearMetrics: actions.clearMetrics,
};

const handleFetch = ({
  clearMetrics,
  fetchMetrics,
  schedulerId,
  techBars = [],
  dateRanges,
  selectedRange,
  selectedDate,
}) => () => {
  clearMetrics();
  const dates = dateRanges[selectedRange]
    ? dateRanges[selectedRange]
    : selectedRange === 'singleMonth'
      ? buildDateRangeForSelectedMonth(selectedDate)
      : [selectedDate];
  fetchMetrics({
    schedulerIds: schedulerId
      ? [schedulerId]
      : techBars.toJS().map(techBar => techBar.values['Id']),
    monthly: selectedRange === 'last12Months' || selectedRange === 'yearToDate',
    dates,
  });
};

export const TechBarMetrics = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ mode = 'summary' }) => ({
    tabMode: ['summary', 'trend', 'export'].includes(mode) ? mode : 'summary',
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
