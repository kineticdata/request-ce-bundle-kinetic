import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import papaparse from 'papaparse';
import { fromJS } from 'immutable';
import { PageTitle } from 'common';

import { actions } from '../../../redux/modules/settingsUsers';

import { UsersListItem } from './UsersListItem';

const IsJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Users Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Click Create User to add a new user</h6>
    </div>
  );
};

const UsersListComponent = ({ users, loading, match, handleChange, data }) => {
  return (
    <div className="page-container page-container--settings-users">
      <PageTitle parts={['Users', 'Settings']} />
      <div className="page-panel page-panel--scrollable">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>Users</h1>
          </div>
          <div className="page-title__actions">
            <input
              type="file"
              accept=".csv"
              id="file-input"
              style={{ display: 'none' }}
              onChange={handleChange}
              ref={element => {
                this.fileEl = element;
              }}
            />
            <label
              htmlFor="file-input"
              className="btn btn-info"
              style={{ marginBottom: '0px' }}
            >
              Import Users
            </label>
            <a className="btn btn-secondary" href={data} download="users.csv">
              Export Users
            </a>
            <Link to={`${match.path}/new`} className="btn btn-primary">
              New User
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

const createCSV = users => {
  let csv = papaparse.unparse(
    users.reduce((acc, user) => {
      acc.push({
        ...user,
        attributesMap: JSON.stringify(user.attributesMap),
        memberships: JSON.stringify(
          // Remove the slugs from the teams prior to export.
          user.memberships.reduce((acc, membership) => {
            const team = { team: { name: membership.team.name } };
            acc.push(team);
            return acc;
          }, []),
        ),
        profileAttributesMap: JSON.stringify(user.profileAttributesMap),
      });
      return acc;
    }, []),
  );
  csv = 'data:text/csv;charset=utf-8,' + csv;
  return encodeURI(csv);
};

const handleChange = props => () => {
  const file = this.fileEl.files[0];
  const extention = file.name.split('.')[file.name.split('.').length - 1];

  if (file && extention === 'csv') {
    const reader = new FileReader();
    reader.readAsText(this.fileEl.files[0]);
    reader.onload = event => {
      papaparse.parse(event.target.result, {
        header: true,
        dynamicTyping: true,
        complete: results => {
          // When streaming, parse results are not available in this callback.
          if (results.errors.length <= 0) {
            const { users, updateUser, createUser } = props;
            const importedUsers = fromJS(results.data)
              .map(user => {
                return user
                  .update('allowedIps', val => (val ? val : ''))
                  .update(
                    'attributesMap',
                    val => (IsJsonString(val) ? fromJS(JSON.parse(val)) : {}),
                  )
                  .update(
                    'profileAttributesMap',
                    val => (IsJsonString(val) ? fromJS(JSON.parse(val)) : {}),
                  )
                  .update(
                    'memberships',
                    val => (IsJsonString(val) ? fromJS(JSON.parse(val)) : {}),
                  );
              })
              .toSet();
            const existingUsers = fromJS(
              users.map(user => ({
                ...user,
                memberships: user.memberships.reduce((acc, membership) => {
                  const team = { team: { name: membership.team.name } };
                  acc.push(team);
                  return acc;
                }, []),
              })),
            ).toSet();
            const userdiff = importedUsers.subtract(existingUsers);
            userdiff.forEach(user => {
              const found = existingUsers.find(
                existingUser =>
                  user.get('username') === existingUser.get('username'),
              );
              if (found) {
                updateUser(user.toJS());
              } else {
                createUser(user.toJS());
              }
            });
          } else {
            console.log(results.errors);
          }
        },
      });
    };
  }
};

export const mapStateToProps = state => ({
  loading: state.space.settingsUsers.loading,
  users: state.space.settingsUsers.users,
});

export const mapDispatchToProps = {
  push,
  fetchUsers: actions.fetchUsers,
  updateUser: actions.updateUser,
  createUser: actions.createUser,
};

export const UsersList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('data', 'setData', ''),
  withHandlers({ handleChange }),
  lifecycle({
    componentWillMount() {
      this.props.fetchUsers();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.users !== nextProps.users) {
        nextProps.setData(createCSV(nextProps.users));
      }
    },
  }),
)(UsersListComponent);
