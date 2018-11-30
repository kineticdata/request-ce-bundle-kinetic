import React, { Fragment } from 'react';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fromJS, List } from 'immutable';
import { modalFormActions, PageTitle } from 'common';

import { actions as usersActions } from '../../../redux/modules/settingsUsers';
import { actions as teamsActions } from '../../../redux/modules/teamList';
import { ProfileCard } from 'common';
import { UsersDropdown } from './DropDown';

export const UserFormComponent = ({
  mode,
  loading,
  userLoading,
  user,
  users,
  error,
  roles,
  teams,
  fieldValues,
  handleFieldChange,
  handleOptionChange,
  handleCheckboxChange,
  handleRolesChange,
  handleTeamsChange,
  handleSubmit,
  handleDelete,
  userProfileAttributes,
}) => (
  <div className="page-container page-container--panels page-container--space-profile-edit">
    <PageTitle parts={['Users', 'Settings']} />
    {!loading &&
      (!userLoading || !mode) && (
        <Fragment>
          <div className="page-panel page-panel--three-fifths page-panel--scrollable page-panel--space-profile-edit">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="/">home</Link> /{` `}
                  <Link to="/settings">settings</Link> /{` `}
                  <Link to={`/settings/users/`}>users</Link> /{` `}
                </h3>
                {mode === 'edit' ? (
                  <h1>Edit: {user.displayName || user.username}</h1>
                ) : (
                  <h1>New User</h1>
                )}
              </div>
            </div>
            <div>
              <h2 className="section__title">General</h2>
              <form onSubmit={handleSubmit}>
                <div className="user-admin">
                  <label htmlFor="spaceAdmin">
                    <input
                      type="checkbox"
                      id="spaceAdmin"
                      name="spaceAdmin"
                      onChange={handleCheckboxChange}
                      checked={fieldValues.spaceAdmin}
                    />Space Admin
                  </label>
                  <label htmlFor="enabled">
                    <input
                      type="checkbox"
                      id="enabled"
                      name="enabled"
                      onChange={handleCheckboxChange}
                      checked={fieldValues.enabled}
                    />Enabled
                  </label>
                </div>
                {mode !== 'edit' && (
                  <div className="form-group required">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={handleFieldChange}
                      value={fieldValues.username}
                    />
                  </div>
                )}
                <div className="form-group required">
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    onChange={handleFieldChange}
                    value={fieldValues.displayName}
                  />
                </div>
                <div className="form-group required">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={handleFieldChange}
                    value={fieldValues.email}
                  />
                </div>
                <div>
                  <h2 className="section__title">Profile Attributes</h2>
                  <div className="user-attributes-wrapper">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.firstName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.lastName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.phoneNumber}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="section__title">User Attributes</h2>
                  <div className="user-attributes-wrapper">
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <input
                        id="department"
                        name="department"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.department}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="manager">Manager</label>
                      <UsersDropdown
                        users={users}
                        initialValue={managerLookup(users, fieldValues.manager)}
                        onSelect={user =>
                          handleOptionChange('manager', user.username)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="organization">Organization</label>
                      <input
                        id="organization"
                        name="organization"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.organization}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="site">Site</label>
                      <input
                        id="site"
                        name="site"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.site}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="section__title">Roles</h2>
                    {roles &&
                      roles.map(role => (
                        <label key={role.slug} htmlFor={role.name}>
                          <input
                            type="checkbox"
                            id={role.name}
                            onChange={handleRolesChange}
                            checked={fieldValues.userRoles.includes(role.name)}
                            value={role.name}
                          />
                          {role.name.replace(/^Role::(.*?)/, '$1')}
                        </label>
                      ))}
                  </div>
                  <div>
                    <h2 className="section__title">Teams</h2>
                    {teams &&
                      teams.map(team => (
                        <label key={team.slug} htmlFor={team.name}>
                          <input
                            type="checkbox"
                            id={team.name}
                            onChange={handleTeamsChange}
                            checked={fieldValues.userTeams.includes(team.name)}
                            value={team.name}
                          />
                          {team.name}
                        </label>
                      ))}
                  </div>
                </div>
                <div className="form__footer">
                  {mode === 'edit' && (
                    <button
                      className="btn btn-link text-danger"
                      onClick={handleDelete}
                    >
                      Delete User
                    </button>
                  )}
                  <div className="form__footer__right">
                    <Link to={`/settings/users`} className="btn btn-link mb-0">
                      Cancel
                    </Link>
                    <button
                      disabled={!fieldValuesValid(fieldValues)}
                      className="btn btn-primary"
                    >
                      {mode === 'edit' ? 'Save User' : 'Create User'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {mode === 'edit' && (
            <div className="page-panel page-panel--two-fifths page-panel--sidebar page-panel--space-profile-edit-sidebar ">
              <ProfileCard user={buildProfile(fieldValues, user)} />
            </div>
          )}
        </Fragment>
      )}
  </div>
);

const managerLookup = (users, managerUsername) => {
  let manager = users.find(user => user.username === managerUsername);
  return manager ? manager.displayName : null;
};

const fieldValuesValid = fieldValues =>
  fieldValues.displayName && fieldValues.email && fieldValues.username;

const getProfileAttribute = (user, attr) =>
  user.profileAttributes && user.profileAttributes[attr]
    ? user.profileAttributes[attr].join(', ')
    : '';

const getAttribute = (user, attr) =>
  user.attributes && user.attributes[attr]
    ? user.attributes[attr].join(', ')
    : '';

const buildProfile = (fieldValues, profile) => {
  const profileAttributes =
    profile && profile.profileAttributes
      ? fromJS(profile.profileAttributes).toJS()
      : {};
  if (fieldValues.phoneNumber !== '') {
    profileAttributes['Phone Number'] = [fieldValues.phoneNumber];
  }
  return {
    ...profile,
    displayName: fieldValues.displayName,
    email: fieldValues.email,
    profileAttributes: profileAttributes,
  };
};

const translateProfileToFieldValues = user => ({
  username: user.username || '',
  displayName: user.displayName || '',
  email: user.email || '',
  phoneNumber: getProfileAttribute(user, 'Phone Number'),
  firstName: getProfileAttribute(user, 'First Name'),
  lastName: getProfileAttribute(user, 'Last Name'),
  department: getAttribute(user, 'Department'),
  organization: getAttribute(user, 'Organization'),
  manager: getAttribute(user, 'Manager'),
  site: getAttribute(user, 'Site'),
  spaceAdmin: user.spaceAdmin,
  enabled: user.enabled,
  userRoles: user.memberships
    ? user.memberships
        .filter(membership => membership.team.name.startsWith('Role::'))
        .reduce((acc, membership) => acc.push(membership.team.name), List([]))
    : List([]),
  userTeams: user.memberships
    ? user.memberships
        .filter(membership => !membership.team.name.startsWith('Role::'))
        .reduce((acc, membership) => acc.push(membership.team.name), List([]))
    : List([]),
});

const translateFieldValuesToProfile = (fieldValues, user) => {
  const result = {
    username: user ? user.username : fieldValues.username,
    displayName: fieldValues.displayName,
    email: fieldValues.email,
    spaceAdmin: fieldValues.spaceAdmin,
    enabled: fieldValues.enabled,
    profileAttributesMap: {
      'First Name': [fieldValues.firstName],
      'Last Name': [fieldValues.lastName],
      'Phone Number': [fieldValues.phoneNumber],
    },
    attributesMap: {
      Department: [fieldValues.department],
      Organization: [fieldValues.organization],
      Manager: [fieldValues.manager],
      Site: [fieldValues.site],
    },
    memberships: [
      ...fieldValues.userRoles.map(role => ({
        team: {
          name: role,
        },
      })),
      ...fieldValues.userTeams.map(team => ({
        team: {
          name: team,
        },
      })),
    ],
  };
  return result;
};

const mapStateToProps = (state, props) => ({
  mode: props.match.params.mode,
  loading: state.space.settingsUsers.loading,
  userLoading: state.space.settingsUsers.userLoading,
  user: state.space.settingsUsers.user,
  users: state.space.settingsUsers.users,
  error: state.space.settingsUsers.error,
  spaceAttributes:
    state.app.space &&
    state.app.space.attributes.reduce((memo, item) => {
      memo[item.name] = item.value;
      return memo;
    }, {}),
  roles: state.space.teamList.roles,
  teams: state.space.teamList.data,
});

const mapDispatchToProps = {
  fetchUsers: usersActions.fetchUsers,
  fetchTeams: teamsActions.fetchTeams,
  fetchUser: usersActions.fetchUser,
  updateUser: usersActions.updateUser,
  createUser: usersActions.createUser,
  deleteUser: usersActions.deleteUser,
  openForm: modalFormActions.openForm,
  push,
};

export const UserForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState(
    'fieldValues',
    'setFieldValues',
    translateProfileToFieldValues({ spaceAdmin: false, enabled: false }),
  ),
  withHandlers({
    handleDelete: props => () => {
      props.deleteUser(props.user.username);
      props.push('/settings/users');
    },
    handleFieldChange: props => ({ target: { name, value } }) => {
      name && props.setFieldValues({ ...props.fieldValues, [name]: value });
    },
    handleOptionChange: props => (name, value) => {
      name && props.setFieldValues({ ...props.fieldValues, [name]: value });
    },
    handleCheckboxChange: props => ({ target: { name, checked } }) => {
      name && props.setFieldValues({ ...props.fieldValues, [name]: checked });
    },
    handleRolesChange: props => ({ target: { value, checked } }) => {
      let userRoles;
      if (!checked) {
        userRoles = props.fieldValues.userRoles.delete(
          props.fieldValues.userRoles.findIndex(role => role === value),
        );
      } else {
        userRoles = props.fieldValues.userRoles.push(value);
      }
      props.setFieldValues({
        ...props.fieldValues,
        userRoles,
      });
    },
    handleTeamsChange: props => ({ target: { value, checked } }) => {
      let userTeams;
      if (!checked) {
        userTeams = props.fieldValues.userTeams.delete(
          props.fieldValues.userTeams.findIndex(team => team === value),
        );
      } else {
        userTeams = props.fieldValues.userTeams.push(value);
      }
      props.setFieldValues({
        ...props.fieldValues,
        userTeams,
      });
    },
    handleSubmit: props => event => {
      event.preventDefault();
      if (props.mode === 'edit') {
        props.updateUser(
          translateFieldValuesToProfile(props.fieldValues, props.user),
        );
      } else {
        props.createUser(translateFieldValuesToProfile(props.fieldValues));
        props.push(`/settings/users`);
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      if (this.props.mode !== undefined) {
        this.props.fetchUser(this.props.match.params.username);
      }
      if (this.props.users.size <= 0) {
        this.props.fetchUsers();
      }
      this.props.fetchTeams();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.user !== nextProps.user) {
        let newUser = { ...nextProps.user };
        if (nextProps.mode === 'clone') {
          delete newUser.username;
          delete newUser.displayName;
          delete newUser.email;
          newUser.profileAttributes['First Name'] = '';
          newUser.profileAttributes['Last Name'] = '';
          newUser.profileAttributes['Phone Number'] = '';
        }
        this.props.setFieldValues({
          ...this.props.fieldValues,
          ...translateProfileToFieldValues(newUser),
        });
      }
    },
  }),
)(UserFormComponent);
