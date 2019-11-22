import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import papaparse from 'papaparse';
import { fromJS } from 'immutable';
import downloadjs from 'downloadjs';
import { PageTitle } from '../shared/PageTitle';

import { actions } from '../../redux/modules/settingsUsers';
import { context } from '../../redux/store';

import { UsersListItem } from './UsersListItem';
import { I18n } from '@kineticdata/react';

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
      <h5>
        <I18n>No Users Found</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        <I18n>Click Create User to add a new user</I18n>
      </h6>
    </div>
  );
};

const UsersListComponent = ({
  users,
  loading,
  handleChange,
  handleDownload,
}) => {
  return (
    <div className="page-container">
      <PageTitle parts={['Users', 'Settings']} />
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/settings">
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
            </h3>
            <h1>
              <I18n>Users</I18n>
            </h1>
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
              <I18n>Import Users</I18n>
            </label>
            <button className="btn btn-secondary" onClick={handleDownload}>
              <I18n>Export Users</I18n>
            </button>
            <Link to="new" className="btn btn-primary">
              <I18n>New User</I18n>
            </Link>
          </div>
        </div>

        <div>
          {loading ? (
            <h3>
              <I18n>Loading</I18n>
            </h3>
          ) : users.length > 0 ? (
            <div className="space-admin-wrapper">
              <table className="table table--settings table-sm">
                <thead className="d-none d-md-table-header-group sortable">
                  <tr className="header">
                    <th className="sort-disabled" />
                    <th scope="col">
                      <I18n>Username</I18n>
                    </th>
                    <th scope="col">
                      <I18n>Display Name</I18n>
                    </th>
                    <th scope="col">
                      <I18n>Email</I18n>
                    </th>
                    <th className="sort-disabled" />
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
  return csv;
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

export const handleDownload = props => () => {
  downloadjs(props.data, 'user.csv', 'text/csv');
};

export const mapStateToProps = state => ({
  loading: state.settingsUsers.loading,
  users: state.settingsUsers.users,
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
    null,
    { context },
  ),
  withState('data', 'setData', ''),
  withHandlers({ handleChange, handleDownload }),
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
