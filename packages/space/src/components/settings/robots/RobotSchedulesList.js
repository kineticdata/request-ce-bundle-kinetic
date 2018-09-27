import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle } from 'recompose';
import moment from 'moment';
import { Constants, Loading, PageTitle } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/settingsRobots';

const getStatusColor = status =>
  status === 'Inactive'
    ? 'status--red'
    : status === 'Expired'
      ? 'status--yellow'
      : 'status--green';

const getNextExecution = (nextExecutions, scheduleId) => {
  let nextExecution;
  const found = nextExecutions.find(
    execution => execution.values['Schedule ID'] === scheduleId,
  );

  if (found) {
    nextExecution = found.values['Next Scheduled Execution']
      ? found.values['Next Scheduled Execution']
      : 'No upcoming executions scheduled';
  } else {
    nextExecution = 'Unknowen';
  }

  return nextExecution;
};

const WallyEmptyMessage = () => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Schedules Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Schedules define when robots will execute</h6>
    </div>
  );
};

const RobotSchedulesListComponent = ({
  robotSchedules,
  robotSchedulesLoading,
  robotSchedulesErrors,
  nextExecutions,
  nextExecutionsLoading,
}) => {
  const loading =
    !nextExecutionsLoading &&
    !robotSchedulesLoading &&
    robotSchedules.size <= 0;
  return loading ? (
    <Loading />
  ) : (
    <div className="page-container page-container--robots">
      <PageTitle parts={['Schedules', 'Robots', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--robots-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>Robots</h1>
          </div>
          <Link
            to={`/settings/robots/schedules/new`}
            className="btn btn-primary"
          >
            Create Robot
          </Link>
        </div>
        {robotSchedules.size <= 0 &&
          robotSchedulesErrors.length > 0 && (
            <div className="text-center text-danger">
              <h1>Oops!</h1>
              <h2>Robot Schedules Not Found</h2>
              {robotSchedulesErrors.map(error => (
                <p className="error-details">{error}</p>
              ))}
            </div>
          )}
        {robotSchedules.size > 0 && (
          <table className="table table-sm table-striped table-robots">
            <thead className="header">
              <tr>
                <th>Robot Name</th>
                <th width="25%">Status</th>
                <th>Category</th>
                <th>Tree Name</th>
                <th>Description</th>
                <th>Next Execution Time</th>
              </tr>
            </thead>
            <tbody>
              {robotSchedules.map(schedule => {
                const nextExecution = nextExecutions
                  ? getNextExecution(nextExecutions, schedule.id)
                  : 'fetching';
                const isExpired =
                  schedule.values['End Date'] &&
                  moment(schedule.values['End Date']).isBefore(moment());
                return (
                  <tr key={schedule.id}>
                    <td>
                      <Link to={`/settings/robots/${schedule.id}`}>
                        <span>{schedule.values['Schedule Name']}</span>
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`status ${getStatusColor(
                          schedule.values['Status'],
                        )}`}
                      >
                        {schedule.values['Status']}
                      </span>
                      {isExpired && (
                        <span className={`status ${getStatusColor('Expired')}`}>
                          Expired
                        </span>
                      )}
                    </td>
                    <td>{schedule.values['Category']}</td>
                    <td>{schedule.values['Task Tree']}</td>
                    <td>{schedule.values['Description']}</td>
                    <td>{nextExecution}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {robotSchedulesErrors.length <= 0 &&
          robotSchedules.size === 0 && <WallyEmptyMessage />}
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotSchedules: state.space.settingsRobots.robotSchedules,
  robotSchedulesLoading: state.space.settingsRobots.robotSchedulesLoading,
  robotSchedulesErrors: state.space.settingsRobots.robotSchedulesErrors,
  nextExecutions: state.space.settingsRobots.nextExecutions,
  nextExecutionsLoading: state.space.settingsRobots.nextExecutionsLoading,
});

export const mapDispatchToProps = {
  push,
  fetchRobotSchedules: actions.fetchRobotSchedules,
  fetchNextExecutions: actions.fetchNextExecutions,
};

export const RobotSchedulesList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotSchedules();
      this.props.fetchNextExecutions();
    },
  }),
)(RobotSchedulesListComponent);
