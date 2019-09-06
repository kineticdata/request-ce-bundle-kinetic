import React, { Fragment } from 'react';
import { push } from 'redux-first-history';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import { fromJS, List } from 'immutable';

import { actions as usersActions } from '../../redux/modules/settingsUsers';
import { actions as teamsActions } from '../../redux/modules/teamList';
import { ProfileCard } from 'common';
import { UsersDropdown } from './DropDown';
import { I18n } from '@kineticdata/react';
import { context } from '../../redux/store';
import { PageTitle } from '../shared/PageTitle';

export const UserFormComponent = ({
  mode,
  loading,
  userLoading,
  user,
  users,
  error,
  roles,
  teams,
  locales,
  timezones,
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
  <div className="page-container page-container--panels">
    <PageTitle parts={['Users', 'Settings']} />
    {!loading &&
      (!userLoading || !mode) && (
        <Fragment>
          <div className="page-panel page-panel--three-fifths page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="/settings">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to={`/settings/users/`}>
                    <I18n>users</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                {mode === 'edit' ? (
                  <h1>
                    <I18n>Edit</I18n>: {user.displayName || user.username}
                  </h1>
                ) : (
                  <h1>
                    <I18n>New User</I18n>
                  </h1>
                )}
              </div>
            </div>
            <div>
              <h2 className="section__title">
                <I18n>General</I18n>
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="user-admin">
                  <label htmlFor="spaceAdmin">
                    <input
                      type="checkbox"
                      id="spaceAdmin"
                      name="spaceAdmin"
                      onChange={handleCheckboxChange}
                      checked={fieldValues.spaceAdmin}
                    />
                    <I18n>Space Admin</I18n>
                  </label>
                  <label htmlFor="enabled">
                    <input
                      type="checkbox"
                      id="enabled"
                      name="enabled"
                      onChange={handleCheckboxChange}
                      checked={fieldValues.enabled}
                    />
                    <I18n>Enabled</I18n>
                  </label>
                </div>
                {mode !== 'edit' && (
                  <div className="form-group required">
                    <label htmlFor="username">
                      <I18n>Username</I18n>
                    </label>
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
                  <label htmlFor="displayName">
                    <I18n>Display Name</I18n>
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    onChange={handleFieldChange}
                    value={fieldValues.displayName}
                  />
                </div>
                <div className="form-group required">
                  <label htmlFor="email">
                    <I18n>Email</I18n>
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={handleFieldChange}
                    value={fieldValues.email}
                  />
                </div>
                <div>
                  <h2 className="section__title">
                    <I18n>Profile Attributes</I18n>
                  </h2>
                  <div className="user-attributes-wrapper">
                    <div className="form-group">
                      <label htmlFor="firstName">
                        <I18n>First Name</I18n>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.firstName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">
                        <I18n>Last Name</I18n>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.lastName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phoneNumber">
                        <I18n>Phone Number</I18n>
                      </label>
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
                  <h2 className="section__title">
                    <I18n>User Attributes</I18n>
                  </h2>
                  <div className="user-attributes-wrapper">
                    <div className="form-group">
                      <label htmlFor="department">
                        <I18n>Department</I18n>
                      </label>
                      <input
                        id="department"
                        name="department"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.department}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="manager">
                        <I18n>Manager</I18n>
                      </label>
                      <UsersDropdown
                        users={users}
                        initialValue={managerLookup(users, fieldValues.manager)}
                        onSelect={user =>
                          handleOptionChange('manager', user.username)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="organization">
                        <I18n>Organization</I18n>
                      </label>
                      <input
                        id="organization"
                        name="organization"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.organization}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="site">
                        <I18n>Site</I18n>
                      </label>
                      <input
                        id="site"
                        name="site"
                        className="form-control"
                        onChange={handleFieldChange}
                        value={fieldValues.site}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferredLocale">
                      <I18n>Preferred Locale</I18n>
                    </label>
                    <select
                      type="text"
                      id="preferredLocale"
                      name="preferredLocale"
                      className="form-control"
                      onChange={handleFieldChange}
                      value={fieldValues.preferredLocale}
                    >
                      <I18n
                        render={translate => (
                          <option value="">{translate('None Selected')}</option>
                        )}
                      />
                      {locales.map(locale => (
                        <option
                          value={locale.code}
                          key={`${locale.code}+${locale.name}`}
                        >
                          {locale.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="timezone">
                      <I18n>Timezone</I18n>
                    </label>
                    <select
                      type="text"
                      id="timezone"
                      name="timezone"
                      className="form-control"
                      onChange={handleFieldChange}
                      value={fieldValues.timezone}
                    >
                      <I18n
                        render={translate => (
                          <option value="">{translate('None Selected')}</option>
                        )}
                      />
                      {timezones.map(timezone => (
                        <option value={timezone.id} key={timezone.id}>
                          {timezone.name} ({timezone.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h2 className="section__title">
                      <I18n>Roles</I18n>
                    </h2>
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
                          <I18n>{role.name.replace(/^Role::(.*?)/, '$1')}</I18n>
                        </label>
                      ))}
                  </div>
                  <div>
                    <h2 className="section__title">
                      <I18n>Teams</I18n>
                    </h2>
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
                          <I18n>{team.name}</I18n>
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
                      <I18n>Delete User</I18n>
                    </button>
                  )}
                  <div className="form__footer__right">
                    <Link to={`/settings/users`} className="btn btn-link mb-0">
                      <I18n>Cancel</I18n>
                    </Link>
                    <button
                      disabled={!fieldValuesValid(fieldValues)}
                      className="btn btn-primary"
                    >
                      <I18n>
                        {mode === 'edit' ? 'Save User' : 'Create User'}
                      </I18n>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {mode === 'edit' && (
            <div className="page-panel page-panel--two-fifths page-panel--sidebar">
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
    preferredLocale: fieldValues.preferredLocale,
    timezone: fieldValues.timezone,
    profileAttributes: profileAttributes,
  };
};

const translateProfileToFieldValues = user => ({
  username: user.username || '',
  displayName: user.displayName || '',
  email: user.email || '',
  preferredLocale: user.preferredLocale || '',
  timezone: user.timezone || '',
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
    preferredLocale:
      fieldValues.preferredLocale === '' ? null : fieldValues.preferredLocale,
    timezone: fieldValues.timezone === '' ? null : fieldValues.timezone,
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
  mode: props.mode,
  loading: state.settingsUsers.loading,
  userLoading: state.settingsUsers.userLoading,
  user: state.settingsUsers.user,
  users: state.settingsUsers.users,
  error: state.settingsUsers.error,
  spaceAttributes:
    state.app.space &&
    state.app.space.attributes.reduce((memo, item) => {
      memo[item.name] = item.value;
      return memo;
    }, {}),
  roles: state.teamList.roles,
  teams: state.teamList.data,
  locales: state.app.locales,
  timezones: state.app.timezones,
});

const mapDispatchToProps = {
  fetchUsers: usersActions.fetchUsers,
  fetchTeams: teamsActions.fetchTeams,
  fetchUser: usersActions.fetchUser,
  updateUser: usersActions.updateUser,
  createUser: usersActions.createUser,
  deleteUser: usersActions.deleteUser,
  push,
};

export const UserForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
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
        this.props.fetchUser(this.props.username);
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
