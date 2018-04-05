import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle } from 'recompose';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/settingsUsers';

import { UsersListItem } from './UsersListItem';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="wally-empty-state">
      <h5>No Users Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Click Create User to add a new user</h6>
    </div>
  );
};

const UsersListComponent = ({ users, loading, match }) => {
  return (
    <div className="datastore-container">
      <div className="datastore-content pane">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>Users</h1>
          </div>
          <div>
            <Link
              to={`${match.path}/import`}
              className="btn btn-secondary"
              target="blank"
            >
              Bulk Import Users
            </Link>
            <Link
              to={`${match.path}/new`}
              className="btn btn-primary ml-3"
              target="blank"
            >
              Create User
            </Link>
          </div>
        </div>

        <div>
          {loading ? (
            <h3>Loading</h3>
          ) : users.length > 0 ? (
            <div className="space-admin-wrapper">
              <table className="table">
                <thead className="d-none d-md-table-header-group">
                  <tr className="header">
                    <th />
                    <th>Username</th>
                    <th>Display Name</th>
                    <th>Email</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <UsersListItem key={user.username} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <WallyEmptyMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsUsers.loading,
  users: state.settingsUsers.users,
});

export const mapDispatchToProps = {
  push,
  fetchUsers: actions.fetchUsers,
};

export const UsersList = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchUsers();
    },
  }),
)(UsersListComponent);
