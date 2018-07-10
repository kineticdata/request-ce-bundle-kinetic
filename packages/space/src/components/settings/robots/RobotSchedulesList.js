import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle } from 'recompose';
import moment from 'moment';
import { Constants, Loading } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/settingsRobots';

const getStatusColor = status =>
  status === 'Inactive'
    ? 'status--red'
    : status === 'Expired'
      ? 'status--yellow'
      : 'status--green';

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
  robot,
  robotSchedules,
  robotSchedulesLoading,
  robotSchedulesErrors,
  match,
}) => {
  const loading =
    robotSchedulesLoading &&
    (robotSchedules.size <= 0 ||
      robotSchedules.get(0).values['Robot ID'] !== robot.values['Robot ID']);
  return loading ? (
    <Loading />
  ) : (
    <Fragment>
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
              <th>Schedule Name</th>
              <th width="25%">Status</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {robotSchedules.map(schedule => {
              const isExpired =
                schedule.values['End Date'] &&
                moment(schedule.values['End Date']).isBefore(moment());
              return (
                <tr key={schedule.id}>
                  <td>
                    <Link
                      to={`/settings/robots/${robot.id}/schedules/${
                        schedule.id
                      }`}
                    >
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
                  <td>
                    {moment(schedule.values['Start Date']).format(
                      Constants.TIME_FORMAT,
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {robotSchedulesErrors.length <= 0 &&
        robotSchedules.size === 0 && <WallyEmptyMessage />}
    </Fragment>
  );
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotSchedules: state.space.settingsRobots.robotSchedules,
  robotSchedulesLoading: state.space.settingsRobots.robotSchedulesLoading,
  robotSchedulesErrors: state.space.settingsRobots.robotSchedulesErrors,
});

export const mapDispatchToProps = {
  push,
  fetchRobotSchedules: actions.fetchRobotSchedules,
};

export const RobotSchedulesList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotSchedules(this.props.robot.values['Robot ID']);
    },
  }),
)(RobotSchedulesListComponent);
