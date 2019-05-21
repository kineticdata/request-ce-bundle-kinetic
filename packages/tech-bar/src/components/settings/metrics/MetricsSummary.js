import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose, withProps } from 'recompose';
import {
  VictoryContainer,
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryTooltip,
  VictoryAxis,
} from 'victory';
import { Constants, Table, StateListWrapper } from 'common';
import { I18n } from '@kineticdata/react';
import moment from 'moment';
import { Record } from 'immutable';

const toInt = value => parseInt(value, 10) || 0;
const toPercent = (a, b) => (b !== 0 ? `${Math.round((a / b) * 100)}%` : '');

const Appointments = ({ appointments }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Appointments</I18n>
    </div>
    {appointments.total > 0 ? (
      <Fragment>
        <I18n
          render={translate => (
            <div className="text-center">
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.blueSky }}
                />
                {`${toPercent(
                  appointments.scheduled,
                  appointments.total,
                )} ${translate('Scheduled')} (${appointments.scheduled})`}
              </div>
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.sunflower }}
                />
                {`${toPercent(
                  appointments.walkins,
                  appointments.total,
                )} ${translate('Walk-Ins')} (${appointments.walkins})`}
              </div>
            </div>
          )}
        />
        <VictoryContainer
          className="VictoryContainer max-height-250"
          height={250}
          width={250}
          style={{ height: 'auto' }}
        >
          {' '}
          <VictoryPie
            standalone={false}
            colorScale={[Constants.COLORS.blueSky, Constants.COLORS.sunflower]}
            height={250}
            width={250}
            radius={100}
            innerRadius={62}
            labels={() => null}
            data={[{ y: appointments.scheduled }, { y: appointments.walkins }]}
          />
          <VictoryPie
            standalone={false}
            colorScale={[
              Constants.COLORS.blueLake,
              'whitesmoke',
              'transparent',
            ]}
            height={250}
            width={250}
            radius={55}
            innerRadius={42}
            labels={() => null}
            data={[
              { y: appointments.sameDay },
              { y: appointments.scheduled - appointments.sameDay },
              { y: appointments.walkins },
            ]}
          />
        </VictoryContainer>
        <div className="text-center">
          <div>
            <span
              className="fa fa-square fa-fw"
              style={{ color: Constants.COLORS.blueLake }}
            />
            <I18n>Same Day Appointments</I18n> {`(${appointments.sameDay})`}
          </div>
        </div>
      </Fragment>
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Appointments</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

const Feedback = ({ feedback }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Feedback</I18n>
    </div>
    {feedback.total > 0 ? (
      <Fragment>
        <I18n
          render={translate => (
            <div className="text-center">
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.green }}
                />
                {`${toPercent(feedback.positive, feedback.total)} ${translate(
                  'Happy',
                )} (${feedback.positive})`}
              </div>
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.red }}
                />
                {`${toPercent(feedback.negative, feedback.total)} ${translate(
                  'Unhappy',
                )} (${feedback.negative})`}
              </div>
            </div>
          )}
        />
        <VictoryPie
          containerComponent={
            <VictoryContainer
              className="VictoryContainer max-height-250"
              height={250}
              width={250}
              style={{ height: 'auto' }}
            />
          }
          colorScale={[Constants.COLORS.green, Constants.COLORS.red]}
          height={250}
          width={250}
          radius={100}
          innerRadius={62}
          labels={() => null}
          data={[{ y: feedback.positive }, { y: feedback.negative }]}
        />
      </Fragment>
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Feedback</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

const Utilization = ({ utilization }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Utilization</I18n>
    </div>
    {utilization.available > 0 ? (
      <Fragment>
        <div className="text-center">
          <div>
            <span
              className="fa fa-square fa-fw"
              style={{ color: Constants.COLORS.blueSky }}
            />
            {toPercent(utilization.scheduled, utilization.available)}{' '}
            <I18n>Scheduled</I18n>
          </div>
          <div>
            <span
              className="fa fa-square fa-fw"
              style={{ color: Constants.COLORS.greenGrass }}
            />
            {toPercent(utilization.actual, utilization.available)}{' '}
            <I18n>Actual</I18n>
          </div>
        </div>
        <VictoryContainer
          className="VictoryContainer max-height-250"
          height={250}
          width={250}
          style={{ height: 'auto' }}
        >
          }
          <VictoryPie
            standalone={false}
            colorScale={[Constants.COLORS.greenGrass, 'whitesmoke']}
            height={250}
            width={250}
            radius={100}
            innerRadius={62}
            labels={() => null}
            data={[
              { y: utilization.actual },
              { y: utilization.available - utilization.actual },
            ]}
          />
          <VictoryPie
            standalone={false}
            colorScale={[Constants.COLORS.blueSky, 'whitesmoke']}
            height={250}
            width={250}
            radius={55}
            innerRadius={17}
            labels={() => null}
            data={[
              { y: utilization.scheduled },
              { y: utilization.available - utilization.scheduled },
            ]}
          />
        </VictoryContainer>
      </Fragment>
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Availability</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

const TimeOfVisit = ({ timeOfVisit }) => {
  const scheduledData = Object.keys(timeOfVisit.scheduled).reduce((d, hour) => {
    d[toInt(hour)] = timeOfVisit.scheduled[hour];
    return d;
  }, Array(24).fill(0));
  const walkinsData = Object.keys(timeOfVisit.walkins).reduce((d, hour) => {
    d[toInt(hour)] = timeOfVisit.walkins[hour];
    return d;
  }, Array(24).fill(0));
  return (
    <Fragment>
      <div className="section__title">
        <I18n>Time of Visit</I18n>
      </div>
      {Object.keys(timeOfVisit.scheduled).length > 0 ||
      Object.keys(timeOfVisit.walkins).length > 0 ? (
        <Fragment>
          <I18n
            render={translate => (
              <VictoryChart
                containerComponent={
                  <VictoryContainer
                    className="VictoryContainer max-height-350"
                    style={{ height: 'auto' }}
                    zoomDimension="x"
                  />
                }
                width={900}
                height={350}
                domainPadding={14}
              >
                <VictoryGroup
                  colorScale={[
                    Constants.COLORS.blueSky,
                    Constants.COLORS.sunflower,
                  ]}
                  offset={14}
                  labelComponent={<VictoryTooltip />}
                >
                  <VictoryBar
                    barWidth={14}
                    data={scheduledData.map((count, index) => ({
                      x: moment(index, 'H').format('LT'),
                      y: count,
                      label: d => `${d.x}: ${d.y} ${translate('Scheduled')}`,
                    }))}
                  />
                  <VictoryBar
                    barWidth={14}
                    data={walkinsData.map((count, index) => ({
                      x: moment(index, 'H').format('LT'),
                      y: count,
                      label: d =>
                        `${d.x}: ${d.y} ${
                          d.y !== 1
                            ? translate('Walk-Ins')
                            : translate('Walk-In')
                        }`,
                    }))}
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
      ) : (
        <div className="text-center">
          <em>
            <I18n>No Visits</I18n>
          </em>
        </div>
      )}
    </Fragment>
  );
};

const Duration = ({ durations, techBars }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Average Durations</I18n>
    </div>
    {durations.length > 0 ? (
      <I18n
        render={translate => (
          <Table
            class="table-settings"
            data={durations.map(d => {
              const techBar = techBars.find(
                t => t.values['Id'] === d.schedulerId,
              );
              const schedulerName = techBar
                ? techBar.values['Name']
                : d.schedulerId;
              const actualAverage =
                d.quantity > 0 ? Math.round(d.actual / d.quantity) : null;
              return {
                ...d,
                actualAverage,
                variance:
                  d.quantity > 0
                    ? (actualAverage - d.duration) / d.duration
                    : null,
                waitTimeAverage:
                  d.quantity > 0 ? Math.round(d.waitTime / d.quantity) : null,
                schedulerName,
                sortValue: `${schedulerName} ${d.type}`,
              };
            })}
            columns={[
              {
                title: 'Event Type',
                value: 'sortValue',
                renderBodyCell: ({ value, row }) => (
                  <td>
                    <div>{translate(row.type)}</div>
                    <small className="text-muted">
                      {translate(row.schedulerName)}
                    </small>
                  </td>
                ),
              },
              {
                title: 'Scheduled',
                value: 'duration',
                renderBodyCell: ({ value }) => (
                  <td>{`${value} ${translate('min')}`}</td>
                ),
              },
              {
                title: 'Actual',
                value: 'actualAverage',
                renderBodyCell: ({ value }) => (
                  <td>
                    {value !== null ? `${value} ${translate('min')}` : ''}
                  </td>
                ),
              },
              {
                title: 'Variance',
                value: 'variance',
                renderBodyCell: ({ value, row }) => (
                  <td>{value !== null ? toPercent(value, 1) : ''}</td>
                ),
              },
              {
                title: 'Wait Time',
                value: 'waitTimeAverage',
                renderBodyCell: ({ value }) => (
                  <td>
                    {value !== null ? `${value} ${translate('min')}` : ''}
                  </td>
                ),
              },
              {
                title: 'Qty',
                value: 'quantity',
                width: '1%',
              },
            ]}
            filtering={false}
            pagination={false}
            render={({ table }) => <div className="table-wrapper">{table}</div>}
          />
        )}
      />
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Event Types</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

export const MetricsSummaryComponent = ({ error, metrics, ...data }) => (
  <StateListWrapper data={data} loading={!metrics} error={error}>
    {({ summary, techBars }) => (
      <div className="row">
        <div className="col-md-4 mb-5">
          <Appointments appointments={summary.appointments} />
        </div>
        <div className="col-md-4 mb-5">
          <Feedback feedback={summary.feedback} />
        </div>
        <div className="col-md-4 mb-5">
          <Utilization utilization={summary.utilization} />
        </div>
        <div className="col-xl-6 mb-5">
          <TimeOfVisit timeOfVisit={summary.timeOfVisit} />
        </div>
        <div className="col-xl-6 mb-5">
          <Duration durations={summary.durations} techBars={techBars} />
        </div>
      </div>
    )}
  </StateListWrapper>
);

export const mapStateToProps = (state, props) => ({
  error: state.metrics.error,
  metrics: state.metrics.data,
});

const Summary = Record({
  appointments: {
    walkins: 0,
    scheduled: 0,
    sameDay: 0,
  },
  feedback: {
    positive: 0,
    negative: 0,
  },
  utilization: {
    available: 0,
    actual: 0,
    scheduled: 0,
  },
  timeOfVisit: { scheduled: {}, walkins: {} },
  durations: [], // { quantity, actual, duration, schedulerId, type }
});

export const MetricsSummary = compose(
  connect(mapStateToProps),
  withProps(({ schedulerId, eventType, metrics }) => {
    if (!metrics) {
      return { summary: Summary() };
    }
    const records = schedulerId
      ? metrics.filter(m => m.schedulerId === schedulerId)
      : metrics;

    const summary = records.reduce((summary, { data }) => {
      // Add total available minutes
      summary.utilization.available += toInt(data.totalMinutesAvailable);
      // If event type is not specified, add feedback results not associated to events
      if (!eventType) {
        summary.feedback.positive += toInt(data.feedback.Positive);
        summary.feedback.negative += toInt(data.feedback.Negative);
      }
      // Iterate through all the event types
      return (
        data.eventTypes
          // If event type is selected, filter to only that type
          .filter(event => !eventType || eventType === event.type)
          .reduce((s, event) => {
            // Add appointment counts
            s.appointments.scheduled += toInt(event.scheduledAppointments);
            s.appointments.walkins += toInt(event.walkins);
            s.appointments.sameDay += toInt(event.sameDayAppointments);
            // Add feedback counts
            s.feedback.positive += toInt(event.feedback.Positive);
            s.feedback.negative += toInt(event.feedback.Negative);
            // Add total scheduled minutes and actual minutes
            s.utilization.scheduled +=
              parseInt(event.scheduledAppointments, 10) * toInt(event.duration);
            s.utilization.actual += toInt(event.scheduledTotalDuration);
            // Add time of visit counts for scheduled appointments
            Object.keys(event.scheduledAppointmentTimes).forEach(time => {
              if (!s.timeOfVisit.scheduled[time]) {
                s.timeOfVisit.scheduled[time] = toInt(
                  event.scheduledAppointmentTimes[time],
                );
              } else {
                s.timeOfVisit.scheduled[time] += toInt(
                  event.scheduledAppointmentTimes[time],
                );
              }
            });
            // Add time of visit counts for walkin appointments
            Object.keys(event.walkinAppointmentTimes).forEach(time => {
              if (!s.timeOfVisit.walkins[time]) {
                s.timeOfVisit.walkins[time] = toInt(
                  event.walkinAppointmentTimes[time],
                );
              } else {
                s.timeOfVisit.walkins[time] += toInt(
                  event.walkinAppointmentTimes[time],
                );
              }
            });
            // Add duration info
            const existingDuration = s.durations.find(
              d => d.schedulerId === data.schedulerId && d.type === event.type,
            );
            if (existingDuration) {
              existingDuration.quantity +=
                toInt(event.scheduledAppointments) + toInt(event.walkins);
              existingDuration.actual +=
                toInt(event.walkinTotalDuration) +
                toInt(event.scheduledTotalDuration);
              existingDuration.waitTime +=
                toInt(event.walkinTotalWaitTime) +
                toInt(event.scheduledTotalWaitTime);
            } else {
              s.durations.push({
                type: event.type,
                schedulerId: data.schedulerId,
                duration: toInt(event.duration),
                quantity:
                  toInt(event.scheduledAppointments) + toInt(event.walkins),
                actual:
                  toInt(event.walkinTotalDuration) +
                  toInt(event.scheduledTotalDuration),
                waitTime:
                  toInt(event.walkinTotalWaitTime) +
                  toInt(event.scheduledTotalWaitTime),
              });
            }
            return s;
          }, summary)
      );
    }, Summary().toJS());
    // Total appointments and feedback
    summary.appointments.total =
      summary.appointments.scheduled + summary.appointments.walkins;
    summary.feedback.total =
      summary.feedback.positive + summary.feedback.negative;
    return { summary };
  }),
)(MetricsSummaryComponent);
