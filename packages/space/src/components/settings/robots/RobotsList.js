import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/settingsRobots';

const getStatusColor = status =>
  status === 'Inactive' ? 'status--red' : 'status--green';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Robots Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Robots are used for scheduling recurring task processes.</h6>
    </div>
  );
};

const RobotsListComponent = ({ robots, loading, match }) => {
  return (
    <div className="page-container page-container--robots">
      <PageTitle parts={[' Robots', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--robots-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>Robots</h1>
          </div>
          <Link to={`${match.path}/new`} className="btn btn-primary">
            Create Robot
          </Link>
        </div>

        <div className="forms-list-wrapper">
          {robots.size > 0 && (
            <table className="table table-sm table-striped table-robots">
              <thead className="header">
                <tr>
                  <th>Name</th>
                  <th width="10%">Status</th>
                  <th>Category</th>
                  <th>Task Tree Name</th>
                  <th width="40%">Description</th>
                </tr>
              </thead>
              <tbody>
                {robots.map(robot => {
                  return (
                    <tr key={robot.id}>
                      <td>
                        <Link to={`${match.path}/${robot.id}`}>
                          <span>{robot.values['Name']}</span>
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
                      </td>
                      <td>{robot.values['Category']}</td>
                      <td>{robot.values['Task Tree Name']}</td>
                      <td>{robot.values['Description']}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && robots.size === 0 && <WallyEmptyMessage />}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.space.settingsRobots.loading,
  robots: state.space.settingsRobots.robots,
});

export const mapDispatchToProps = {
  push,
  fetchRobots: actions.fetchRobots,
};

export const RobotsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobots();
    },
  }),
)(RobotsListComponent);
