import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import {
  VictoryContainer,
  VictoryVoronoiContainer,
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryTooltip,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
} from 'victory';
import { Constants, StateListWrapper } from 'common';
import { I18n } from '@kineticdata/react';
import moment from 'moment';
import { Map } from 'immutable';

const toInt = value => parseInt(value, 10) || 0;
const toPercentNumber = (a, b) => (b !== 0 ? Math.round((a / b) * 100) : 0);

const Appointments = ({ appointments, formatDate }) => {
  const { scheduled, walkins, labelHeaders } = Object.keys(appointments.total)
    .sort()
    .reduce(
      (appts, date) => {
        var scheduled = toInt(appointments.scheduled[date]);
        var walkins = toInt(appointments.walkins[date]);
        var total = toInt(appointments.total[date]);
        var scheduledPercentage = toPercentNumber(scheduled, total) || 0;
        var walkinsPercentage = toPercentNumber(walkins, total) || 0;
        appts.labelHeaders.push({
          x: formatDate(date),
          y: 0,
          label: `${formatDate(
            date,
          )}\n${scheduledPercentage}% Scheduled (${scheduled})\n${walkinsPercentage}% Walk-Ins (${walkins})`,
        });
        appts.scheduled.push({
          x: formatDate(date),
          y: scheduledPercentage,
          _label: `${scheduledPercentage}% Scheduled (${scheduled})`,
        });
        appts.walkins.push({
          x: formatDate(date),
          y: walkinsPercentage,
          _label: `${walkinsPercentage}% Walk-Ins (${walkins})`,
        });
        return appts;
      },
      { labelHeaders: [], scheduled: [], walkins: [] },
    );
  return (
    <Fragment>
      <div className="section__title">
        <I18n>Appointments</I18n>
      </div>
      <I18n
        render={translate => (
          <VictoryChart
            containerComponent={
              <VictoryVoronoiContainer
                className="VictoryContainer max-height-350"
                style={{ height: 'auto' }}
                voronoiDimension="x"
              />
            }
            width={1500}
            height={300}
            padding={{ top: 50, left: 50, right: 70, bottom: 80 }}
            minDomain={{ y: 0 }}
            maxDomain={{ y: 100 }}
          >
            <VictoryGroup
              colorScale={[
                Constants.COLORS.black,
                Constants.COLORS.blueSky,
                Constants.COLORS.sunflower,
              ]}
            >
              <VictoryScatter
                data={labelHeaders}
                size={2}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLine
                data={scheduled}
                style={{ data: { strokeWidth: 3 } }}
              />
              <VictoryLine
                data={walkins}
                style={{ data: { strokeWidth: 3 } }}
              />
            </VictoryGroup>
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: 45,
                  verticalAnchor: 'middle',
                  textAnchor: 'start',
                  padding: 5,
                  fontSize: 14,
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={y => `${y}%`}
              style={{
                tickLabels: {
                  padding: 5,
                  fontSize: 14,
                },
                ticks: { stroke: Constants.COLORS.black, size: 5 },
              }}
            />
          </VictoryChart>
        )}
      />
      <div className="text-center">
        <div>
          <span
            className="fa fa-square fa-fw"
            style={{ color: Constants.COLORS.blueSky }}
          />
          <I18n>Scheduled</I18n>
        </div>
        <div>
          <span
            className="fa fa-square fa-fw"
            style={{ color: Constants.COLORS.sunflower }}
          />
          <I18n>Walk-Ins</I18n>
        </div>
      </div>
    </Fragment>
  );
};

const Feedback = ({ feedback, formatDate }) => {
  const { positive, negative, labelHeaders } = Object.keys(feedback.total)
    .sort()
    .reduce(
      (appts, date) => {
        var positive = toInt(feedback.positive[date]);
        var negative = toInt(feedback.negative[date]);
        var total = toInt(feedback.total[date]);
        var positivePercentage = toPercentNumber(positive, total) || 0;
        var negativePercentage = toPercentNumber(negative, total) || 0;
        appts.labelHeaders.push({
          x: formatDate(date),
          y: 0,
          label: `${formatDate(
            date,
          )}\n${positivePercentage}% Positive (${positive})\n${negativePercentage}% Negative (${negative})`,
        });
        appts.positive.push({
          x: formatDate(date),
          y: positivePercentage,
        });
        appts.negative.push({
          x: formatDate(date),
          y: negativePercentage,
        });
        return appts;
      },
      { labelHeaders: [], positive: [], negative: [] },
    );
  return (
    <Fragment>
      <div className="section__title">
        <I18n>Feedback</I18n>
      </div>
      <I18n
        render={translate => (
          <VictoryChart
            containerComponent={
              <VictoryVoronoiContainer
                className="VictoryContainer max-height-350"
                style={{ height: 'auto' }}
                voronoiDimension="x"
              />
            }
            width={1500}
            height={300}
            padding={{ top: 50, left: 50, right: 70, bottom: 80 }}
            minDomain={{ y: 0 }}
            maxDomain={{ y: 100 }}
          >
            <VictoryGroup
              colorScale={[
                Constants.COLORS.black,
                Constants.COLORS.green,
                Constants.COLORS.red,
              ]}
            >
              <VictoryScatter
                data={labelHeaders}
                size={2}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLine
                data={positive}
                style={{ data: { strokeWidth: 3 } }}
              />
              <VictoryLine
                data={negative}
                style={{ data: { strokeWidth: 3 } }}
              />
            </VictoryGroup>
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: 45,
                  verticalAnchor: 'middle',
                  textAnchor: 'start',
                  padding: 5,
                  fontSize: 14,
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={y => `${y}%`}
              style={{
                tickLabels: {
                  padding: 5,
                  fontSize: 14,
                },
                ticks: { stroke: Constants.COLORS.black, size: 5 },
              }}
            />
          </VictoryChart>
        )}
      />
      <div className="text-center">
        <div>
          <span
            className="fa fa-square fa-fw"
            style={{ color: Constants.COLORS.green }}
          />
          <I18n>Positive</I18n>
        </div>
        <div>
          <span
            className="fa fa-square fa-fw"
            style={{ color: Constants.COLORS.red }}
          />
          <I18n>Negative</I18n>
        </div>
      </div>
    </Fragment>
  );
};

const Utilization = ({ utilization, formatDate }) => {
  const { scheduled, actual, labelHeaders, maxY } = Object.keys(
    utilization.available,
  )
    .sort()
    .reduce(
      (utils, date) => {
        var scheduled = toInt(utilization.scheduled[date]);
        var actual = toInt(utilization.actual[date]);
        var available = toInt(utilization.available[date]);
        var scheduledPercentage = toPercentNumber(scheduled, available) || 0;
        var actualPercentage = toPercentNumber(actual, available) || 0;
        utils.labelHeaders.push({
          x: formatDate(date),
          y: 0,
          label: `${formatDate(
            date,
          )}\n${scheduledPercentage}% Scheduled (${scheduled})\n${actualPercentage}% Actual (${actual})`,
        });
        utils.scheduled.push({
          x: formatDate(date),
          y: scheduledPercentage,
        });
        utils.actual.push({
          x: formatDate(date),
          y: actualPercentage,
        });
        utils.maxY = Math.max(
          utils.maxY,
          scheduledPercentage,
          actualPercentage,
        );
        return utils;
      },
      { labelHeaders: [], scheduled: [], actual: [], maxY: 10 },
    );
  return (
    <Fragment>
      <div className="section__title">
        <I18n>Utilization</I18n>
      </div>
      <I18n
        render={translate => (
          <VictoryChart
            containerComponent={
              <VictoryVoronoiContainer
                className="VictoryContainer max-height-350"
                style={{ height: 'auto' }}
                voronoiDimension="x"
              />
            }
            width={1500}
            height={300}
            padding={{ top: 50, left: 50, right: 70, bottom: 80 }}
            minDomain={{ y: 0 }}
            maxDomain={{ y: maxY }}
          >
            <VictoryGroup
              colorScale={[
                Constants.COLORS.black,
                Constants.COLORS.blueSky,
                Constants.COLORS.greenGrass,
              ]}
            >
              <VictoryScatter
                data={labelHeaders}
                size={2}
                labelComponent={<VictoryTooltip />}
              />
              <VictoryLine
                data={scheduled}
                style={{ data: { strokeWidth: 3 } }}
              />
              <VictoryLine data={actual} style={{ data: { strokeWidth: 3 } }} />
            </VictoryGroup>
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: 45,
                  verticalAnchor: 'middle',
                  textAnchor: 'start',
                  padding: 5,
                  fontSize: 14,
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={y => `${y}%`}
              style={{
                tickLabels: {
                  padding: 5,
                  fontSize: 14,
                },
                ticks: { stroke: Constants.COLORS.black, size: 5 },
              }}
            />
          </VictoryChart>
        )}
      />
      <div className="text-center">
        <div>
          <span
            className="fa fa-square fa-fw"
            style={{ color: Constants.COLORS.blueSky }}
          />
          <I18n>Scheduled</I18n>
        </div>
        <div>
          <span
            className="fa fa-square fa-fw"
            style={{ color: Constants.COLORS.greenGrass }}
          />
          <I18n>Actual</I18n>
        </div>
      </div>
    </Fragment>
  );
};

const Durations = ({
  durations,
  selectedDuration,
  setSelectedDuration,
  formatDate,
}) => {
  const {
    labelHeaders,
    scheduled,
    actual,
    waitTime,
    quantity,
  } = selectedDuration
    ? Object.keys(
        durations.data[selectedDuration.techBarId].eventTypes[
          selectedDuration.eventType
        ].data,
      )
        .sort()
        .reduce(
          (result, date) => {
            const eventType =
              durations.data[selectedDuration.techBarId].eventTypes[
                selectedDuration.eventType
              ];
            const quantity = eventType.data[date].quantity;
            result.labelHeaders.push({
              x: formatDate(date),
              y: 0,
              label: `${formatDate(date)}\nScheduled: ${
                eventType.duration
              } minutes\nActual: ${
                quantity > 0
                  ? Math.round(eventType.data[date].actual / quantity)
                  : 0
              } minutes\nQuantity: ${eventType.data[date].quantity}`,
            });
            result.scheduled.push({
              x: formatDate(date),
              y: eventType.duration,
            });
            result.actual.push({
              x: formatDate(date),
              y:
                quantity > 0
                  ? Math.round(eventType.data[date].actual / quantity)
                  : 0,
            });
            result.waitTime.push({
              x: formatDate(date),
              y:
                quantity > 0
                  ? Math.round(eventType.data[date].waitTime / quantity)
                  : 0,
            });
            result.quantity.push({
              x: formatDate(date),
              y: eventType.data[date].quantity,
            });
            return result;
          },
          {
            labelHeaders: [],
            scheduled: [],
            actual: [],
            waitTime: [],
            quantity: [],
          },
        )
    : {};
  return (
    <Fragment>
      <div className="section__title">
        <I18n>Average Duration</I18n>
      </div>
      <div>
        <label htmlFor="duration-event-select">Tech Bar and Event Type</label>
        <select
          name="duration-event-select"
          id="duration-event-select"
          className="form-control"
          value={selectedDuration ? selectedDuration.value : ''}
          onChange={e =>
            setSelectedDuration(
              durations.options.find(o => o.value === e.target.value),
            )
          }
        >
          <option />
          {durations.options.map(option => (
            <I18n
              key={option.value}
              render={translate => (
                <option value={option.value}>
                  {translate(option.techBarName)} ::{' '}
                  {translate(option.eventType)}
                </option>
              )}
            />
          ))}
        </select>
      </div>
      {selectedDuration ? (
        <Fragment>
          <I18n
            render={translate => (
              <div className="standalone-victory-group">
                <VictoryChart
                  containerComponent={
                    <VictoryContainer
                      className="VictoryContainer max-height-350"
                      style={{ height: 'auto' }}
                    />
                  }
                  width={1500}
                  height={300}
                  padding={{ top: 50, left: 100, right: 70, bottom: 80 }}
                  minDomain={{ y: 0 }}
                >
                  <VictoryBar
                    data={quantity}
                    style={{
                      data: {
                        fill: Constants.COLORS.sunflower,
                      },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    offsetX={70}
                    orientation="right"
                    tickFormat={y => Math.round(y * 10) / 10}
                    style={{
                      tickLabels: {
                        padding: 5,
                        fontSize: 14,
                        fill: Constants.COLORS.sunflower,
                      },
                      ticks: { stroke: Constants.COLORS.sunflower, size: 5 },
                      axis: { stroke: Constants.COLORS.sunflower },
                    }}
                  />
                </VictoryChart>
                <VictoryChart
                  containerComponent={
                    <VictoryVoronoiContainer
                      className="VictoryContainer max-height-350"
                      style={{ height: 'auto' }}
                      voronoiDimension="x"
                    />
                  }
                  width={1500}
                  height={300}
                  padding={{ top: 50, left: 100, right: 70, bottom: 80 }}
                  minDomain={{ y: 0 }}
                >
                  <VictoryGroup
                    colorScale={[
                      Constants.COLORS.black,
                      Constants.COLORS.greenGrass,
                      Constants.COLORS.blueSky,
                    ]}
                  >
                    <VictoryScatter
                      data={labelHeaders}
                      size={2}
                      labelComponent={<VictoryTooltip />}
                    />
                    <VictoryLine
                      data={scheduled}
                      style={{ data: { strokeDasharray: 4, strokeWidth: 3 } }}
                    />
                    <VictoryLine
                      data={actual}
                      style={{ data: { strokeWidth: 3 } }}
                    />
                  </VictoryGroup>
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        angle: 45,
                        verticalAnchor: 'middle',
                        textAnchor: 'start',
                        padding: 5,
                        fontSize: 14,
                      },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    tickFormat={y => `${y} min`}
                    style={{
                      tickLabels: {
                        padding: 5,
                        fontSize: 14,
                      },
                      ticks: { stroke: Constants.COLORS.black, size: 5 },
                    }}
                  />
                </VictoryChart>
              </div>
            )}
          />

          <div className="text-center">
            <div>
              <span
                className="fa fa-square fa-fw"
                style={{ color: Constants.COLORS.greenGrass }}
              />
              <I18n>Scheduled Duration</I18n>
            </div>
            <div>
              <span
                className="fa fa-square fa-fw"
                style={{ color: Constants.COLORS.blueSky }}
              />
              <I18n>Actual Duration</I18n>
            </div>
            <div>
              <span
                className="fa fa-square fa-fw"
                style={{ color: Constants.COLORS.sunflower }}
              />
              <I18n>Quantity</I18n>
            </div>
          </div>
        </Fragment>
      ) : (
        <div className="text-info">
          <I18n>
            The duration trend graph is only available once you select a Tech
            Bar and Event Type.{' '}
          </I18n>
          {durations.options.length === 0 && (
            <strong>
              <I18n>The selected Tech Bar does not have any Event Types.</I18n>
            </strong>
          )}
        </div>
      )}
    </Fragment>
  );
};

const TimeOfVisit = ({
  timeOfVisit,
  formatDate,
  dates,
  timeOfVisitData,
  toggleTimeOfVisitData,
}) => {
  const sourceData = timeOfVisitData
    ? timeOfVisit.scheduled
    : timeOfVisit.walkins;
  const graphData = Object.keys(sourceData)
    .sort()
    .reduce(
      (tov, date) => {
        const allTimes = [];
        Array(24)
          .fill(0)
          .forEach((_, hour) => {
            if (sourceData[date][hour]) {
              tov.data.push({
                x: date,
                y: hour,
                size:
                  (timeOfVisit.max > 15
                    ? (sourceData[date][hour] / timeOfVisit.max) * 15
                    : sourceData[date][hour]) + 2,
                label: `${formatDate(date)}\n${moment(hour, 'H').format(
                  'LT',
                )}\n${timeOfVisitData ? 'Scheduled' : 'Walk-Ins'}: ${
                  sourceData[date][hour]
                }`,
              });
              allTimes.push(...Array(sourceData[date][hour]).fill(hour));
            }
          });
        tov.median.push({
          x: date,
          y:
            allTimes.length > 0
              ? allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length
              : 12,
        });
        return tov;
      },
      { data: [], median: [] },
    );
  return (
    <Fragment>
      <div className="section__title">
        <I18n>Time of Visit</I18n>
      </div>
      <div className="text-center">
        <label
          htmlFor="time-of-visit-scheduled"
          className="btn mr-2"
          style={{
            backgroundColor: Constants.COLORS.blueSky,
            color: Constants.COLORS.white,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          <span
            className={`fa fa-${timeOfVisitData ? 'check-' : ''}square fa-fw`}
            style={{ color: Constants.COLORS.white }}
          />
          <I18n>Scheduled</I18n>
          <input
            type="radio"
            name="time-of-visit-radio"
            id="time-of-visit-scheduled"
            className="ml-1 collapse"
            checked={timeOfVisitData}
            onChange={() => toggleTimeOfVisitData(!timeOfVisitData)}
          />
        </label>
        <label
          htmlFor="time-of-visit-walkins"
          className="btn"
          style={{
            backgroundColor: Constants.COLORS.sunflower,
            color: Constants.COLORS.white,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          <span
            className={`fa fa-${!timeOfVisitData ? 'check-' : ''}square fa-fw`}
            style={{ color: Constants.COLORS.white }}
          />
          <I18n>Walkins</I18n>
          <input
            type="radio"
            name="time-of-visit-radio"
            id="time-of-visit-walkins"
            className="ml-1 collapse"
            checked={!timeOfVisitData}
            onChange={() => toggleTimeOfVisitData(!timeOfVisitData)}
          />
        </label>
      </div>
      <I18n
        render={translate => (
          <VictoryChart
            containerComponent={
              <VictoryContainer
                className="VictoryContainer max-height-1000"
                style={{ height: 'auto' }}
              />
            }
            width={1500}
            height={1000}
            padding={{ top: 50, left: 80, right: 70, bottom: 80 }}
            domainPadding={17}
          >
            <VictoryAxis
              tickValues={dates.sort()}
              tickFormat={x => formatDate(x)}
              style={{
                tickLabels: {
                  angle: 45,
                  verticalAnchor: 'middle',
                  textAnchor: 'start',
                  padding: 10,
                  fontSize: 14,
                },
                ticks: { stroke: Constants.COLORS.black, size: 5 },
                grid: { stroke: 'whitesmoke' },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickValues={Array(24)
                .fill(0)
                .map((_, i) => i)}
              tickFormat={y => moment(y, 'H').format('LT')}
              style={{
                tickLabels: {
                  padding: 5,
                  fontSize: 14,
                },
                ticks: { stroke: Constants.COLORS.black, size: 5 },
                grid: { stroke: 'whitesmoke' },
              }}
            />
            <VictoryGroup
              colorScale={[
                'transparent',
                timeOfVisitData
                  ? Constants.COLORS.blueSky
                  : Constants.COLORS.sunflower,
              ]}
            >
              <VictoryLine data={graphData.median} interpolation="monotoneX" />
              <VictoryScatter
                data={graphData.data}
                labelComponent={<VictoryTooltip />}
              />
            </VictoryGroup>
          </VictoryChart>
        )}
      />
    </Fragment>
  );
};

export const MetricsTrendComponent = ({ error, metrics, ...data }) => (
  <StateListWrapper data={data} loading={!metrics} error={error}>
    {({
      trend,
      techBars,
      formatDate,
      dates,
      selectedDuration,
      setSelectedDuration,
      timeOfVisitData,
      toggleTimeOfVisitData,
    }) => (
      <div className="row">
        <div className="col-12 mb-5">
          <Appointments
            appointments={trend.appointments}
            formatDate={formatDate}
          />
        </div>
        <div className="col-12 mb-5">
          <Feedback feedback={trend.feedback} formatDate={formatDate} />
        </div>
        <div className="col-12 mb-5">
          <Utilization
            utilization={trend.utilization}
            formatDate={formatDate}
          />
        </div>
        <div className="col-12 mb-5">
          <Durations
            durations={trend.durations}
            formatDate={formatDate}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />
        </div>
        <div className="col-12 mb-5">
          <TimeOfVisit
            timeOfVisit={trend.timeOfVisit}
            formatDate={formatDate}
            dates={dates}
            timeOfVisitData={timeOfVisitData}
            toggleTimeOfVisitData={toggleTimeOfVisitData}
          />
        </div>
      </div>
    )}
  </StateListWrapper>
);

export const mapStateToProps = (state, props) => ({
  error: state.metrics.error,
  metrics: state.metrics.data,
});

const TrendSummary = (dates = [], techBars) => {
  const defaultMap = dates.reduce((map, date) => {
    return map.set(date, 0);
  }, Map());
  return {
    appointments: {
      scheduled: defaultMap.toJS(),
      walkins: defaultMap.toJS(),
      sameDay: defaultMap.toJS(),
      total: defaultMap.toJS(),
    },
    feedback: {
      positive: defaultMap.toJS(),
      negative: defaultMap.toJS(),
      total: defaultMap.toJS(),
    },
    utilization: {
      available: defaultMap.toJS(),
      actual: defaultMap.toJS(),
      scheduled: defaultMap.toJS(),
    },
    timeOfVisit: {
      scheduled: defaultMap.map(() => Array(24).fill(0)).toJS(),
      walkins: defaultMap.map(() => Array(24).fill(0)).toJS(),
      max: 0,
    },
    durations: {
      data: techBars
        ? techBars.reduce((d, t) => {
            d[t.values['Id']] = {
              id: t.values['Id'],
              name: t.values['Name'],
              eventTypes: {},
            };
            return d;
          }, {})
        : {},
      datesMap: defaultMap,
      options: [],
    }, // data: <schedulerId>.eventTypes.<eventType>.data.<date> = {}
  };
};

const buildTrend = ({
  setTrend,
  schedulerId,
  eventType,
  metrics,
  dates,
  techBars,
  selectedDuration,
  setSelectedDuration,
}) => () => {
  if (!metrics) {
    return;
  }
  const records = schedulerId
    ? metrics.filter(m => m.schedulerId === schedulerId)
    : metrics;
  const trend = records.reduce(
    (trend, { data, period, schedulerId: techBarId }) => {
      // Add total available minutes
      trend.utilization.available[period] += toInt(data.totalMinutesAvailable);
      // If event type is not specified, add feedback results not associated to events
      if (!eventType) {
        trend.feedback.positive[period] += toInt(data.feedback.Positive);
        trend.feedback.negative[period] += toInt(data.feedback.Negative);
        trend.feedback.total[period] +=
          toInt(data.feedback.Positive) + toInt(data.feedback.Negative);
      }
      // Iterate through all the event types
      return (
        data.eventTypes
          // If event type is selected, filter to only that type
          .filter(event => !eventType || eventType === event.type)
          .reduce((t, event) => {
            // Add appointment counts
            t.appointments.scheduled[period] += toInt(
              event.scheduledAppointments,
            );
            t.appointments.walkins[period] += toInt(event.walkins);
            t.appointments.sameDay[period] += toInt(event.sameDayAppointments);
            t.appointments.total[period] +=
              toInt(event.scheduledAppointments) + toInt(event.walkins);
            // Add feedback counts
            t.feedback.positive[period] += toInt(event.feedback.Positive);
            t.feedback.negative[period] += toInt(event.feedback.Negative);
            t.feedback.total[period] +=
              toInt(event.feedback.Positive) + toInt(event.feedback.Negative);
            // Add total scheduled minutes and actual minutes
            t.utilization.scheduled[period] +=
              parseInt(event.scheduledAppointments, 10) * toInt(event.duration);
            t.utilization.actual[period] += toInt(event.scheduledTotalDuration);
            // Add time of visit counts for scheduled appointments
            Object.keys(event.scheduledAppointmentTimes).forEach(time => {
              t.timeOfVisit.scheduled[period][toInt(time)] += toInt(
                event.scheduledAppointmentTimes[time],
              );
            });
            Object.keys(event.walkinAppointmentTimes).forEach(time => {
              t.timeOfVisit.walkins[period][toInt(time)] += toInt(
                event.walkinAppointmentTimes[time],
              );
            });
            t.timeOfVisit.max = Math.max(
              t.timeOfVisit.max,
              ...(t.timeOfVisit.scheduled[period] || []),
              ...(t.timeOfVisit.walkins[period] || []),
            );
            // Add duration info
            if (t.durations.data[techBarId]) {
              if (!t.durations.data[techBarId].eventTypes[event.type]) {
                t.durations.data[techBarId].eventTypes[event.type] = {
                  duration: event.duration,
                  data: t.durations.datesMap
                    .map(() => ({
                      quantity: 0,
                      actual: 0,
                      waitTime: 0,
                    }))
                    .toJS(),
                };
              }
              const currentDuration =
                t.durations.data[techBarId].eventTypes[event.type];
              currentDuration.data[period].quantity +=
                toInt(event.scheduledAppointments) + toInt(event.walkins);
              currentDuration.data[period].actual +=
                toInt(event.walkinTotalDuration) +
                toInt(event.scheduledTotalDuration);
              currentDuration.data[period].waitTime +=
                toInt(event.walkinTotalWaitTime) +
                toInt(event.scheduledTotalWaitTime);
            }
            return t;
          }, trend)
      );
    },
    TrendSummary(
      dates,
      techBars.filter(t => !schedulerId || t.values['Id'] === schedulerId),
    ),
  );

  // Build options for duration select
  trend.durations.options = Object.keys(trend.durations.data).reduce(
    (options, techBarId) => {
      Object.keys(trend.durations.data[techBarId].eventTypes).forEach(
        eventType => {
          options.push({
            value: `${techBarId}||${eventType}`,
            techBarId,
            techBarName: trend.durations.data[techBarId].name,
            eventType,
          });
        },
      );
      return options;
    },
    [],
  );
  // Updated selectedDuration value if only a single value exists
  if (
    trend.durations.options.length === 1 &&
    (!selectedDuration ||
      selectedDuration.value !== trend.durations.options[0].value)
  ) {
    setSelectedDuration(trend.durations.options[0]);
  }
  // If selectedDuration value is no longer valid, clear the value
  else if (
    selectedDuration &&
    !trend.durations.options.find(o => o.value === selectedDuration.value)
  ) {
    setSelectedDuration(null);
  }

  setTrend(trend);
};

export const MetricsTrend = compose(
  connect(mapStateToProps),
  withState('trend', 'setTrend', TrendSummary()),
  withState('timeOfVisitData', 'toggleTimeOfVisitData', true),
  withState('selectedDuration', 'setSelectedDuration', null),
  withHandlers({
    buildTrend,
  }),
  lifecycle({
    componentDidMount() {
      this.props.buildTrend();
    },
    componentDidUpdate(prevProps) {
      if (this.props.metrics !== prevProps.metrics) {
        this.props.buildTrend();
      }
    },
  }),
)(MetricsTrendComponent);
