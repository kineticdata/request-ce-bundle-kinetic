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

const getNextExecution = (nextExecutions, robotId) => {
  let nextExecution;
  const found = nextExecutions.find(
    execution => execution.values['Robot ID'] === robotId,
  );

  if (found) {
    nextExecution = found.values['Next Execution']
      ? found.values['Next Execution']
      : 'No upcoming executions scheduled';
  } else {
    nextExecution = 'Unknown';
  }

  return nextExecution;
};

const WallyEmptyMessage = () => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Robots Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
    </div>
  );
};

const RobotsListComponent = ({
  robots,
  robotsLoading,
  robotsErrors,
  nextExecutions,
  nextExecutionsLoading,
}) => {
  const loading = !nextExecutionsLoading && !robotsLoading && robots.size <= 0;
  return loading ? (
    <Loading />
  ) : (
    <div className="page-container page-container--robots">
      <PageTitle parts={['Robots', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--robots-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>Robots</h1>
          </div>
          <Link to={`/settings/robots/robots/new`} className="btn btn-primary">
            Create Robot
          </Link>
        </div>
        {robots.size <= 0 &&
          robotsErrors.length > 0 && (
            <div className="text-center text-danger">
              <h1>Oops!</h1>
              <h2>Robots Not Found</h2>
              {robotsErrors.map(error => (
                <p className="error-details">{error}</p>
              ))}
            </div>
          )}
        {robots.size > 0 && (
          <table className="table table-sm table-striped table-robots">
            <thead className="header">
              <tr>
                <th scope="col">Robot Name</th>
                <th scope="col" width="25%">
                  Status
                </th>
                <th scope="col">Category</th>
                <th scope="col">Tree Name</th>
                <th scope="col">Description</th>
                <th scope="col">Next Execution Time</th>
              </tr>
            </thead>
            <tbody>
              {robots.map(robot => {
                const nextExecution = nextExecutions
                  ? getNextExecution(nextExecutions, robot.id)
                  : 'fetching';
                const isExpired =
                  robot.values['End Date'] &&
                  moment(robot.values['End Date']).isBefore(moment());
                return (
                  <tr key={robot.id}>
                    <td scope="row">
                      <Link to={`/settings/robots/${robot.id}`}>
                        <span>{robot.values['Robot Name']}</span>
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`status ${getStatusColor(
                          robot.values['Status'],
                        )}`}
                      >
                        {robot.values['Status']}
                      </span>
                      {isExpired && (
                        <span className={`status ${getStatusColor('Expired')}`}>
                          Expired
                        </span>
                      )}
                    </td>
                    <td>{robot.values['Category']}</td>
                    <td>{robot.values['Task Tree']}</td>
                    <td>{robot.values['Description']}</td>
                    <td>
                      {moment(nextExecution).isValid()
                        ? moment(nextExecution).format(Constants.TIME_FORMAT)
                        : nextExecution}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {robotsErrors.length <= 0 && robots.size === 0 && <WallyEmptyMessage />}
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robots: state.space.settingsRobots.robots,
  robotsLoading: state.space.settingsRobots.robotsLoading,
  robotsErrors: state.space.settingsRobots.robotsErrors,
  nextExecutions: state.space.settingsRobots.nextExecutions,
  nextExecutionsLoading: state.space.settingsRobots.nextExecutionsLoading,
});

export const mapDispatchToProps = {
  push,
  fetchRobots: actions.fetchRobots,
  fetchNextExecutions: actions.fetchNextExecutions,
};

export const RobotsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobots();
      this.props.fetchNextExecutions();
    },
  }),
)(RobotsListComponent);
