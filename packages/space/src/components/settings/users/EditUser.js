import React, { Fragment } from 'react';

import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fromJS, List } from 'immutable';
import { commonActions, PageTitle } from 'common';
import { actions as profileActions } from '../../../redux/modules/profiles';
import { actions as usersActions } from '../../../redux/modules/settingsUsers';
import { actions as teamsActions } from '../../../redux/modules/teamList';
import { ProfileCard } from '../../shared/ProfileCard';
import { TeamCard } from '../../shared/TeamCard';
import { UsersDropdown } from './DropDown';
import { get } from 'https';

export const EditUserComponent = ({
  loading,
  user,
  users,
  error,
  roles,
  fieldValues,
  location,
  locationEnabled,
  handleFieldChange,
  handleOptionChange,
  handleCheckboxChange,
  handleRolesChange,
  handleSubmit,
  userProfileAttributes,
}) => (
  <div className="page-container page-container--panels page-container--space-profile-edit">
    <PageTitle parts={['Users', 'Settings']} />
    {!loading && (
      <Fragment>
        <div className="page-panel page-panel--sixty page-panel--scrollable page-panel--space-profile-edit">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> /{` `}
                <Link to="/settings">settings</Link> /{` `}
                <Link to={`/settings/users/`}>users</Link> /{` `}
              </h3>
              <h1>Edit: {user.displayName || user.username}</h1>
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
                    name="spaceAdmin"
                    onChange={handleCheckboxChange}
                    checked={fieldValues.enabled}
                  />Enabled
                </label>
              </div>
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
              </div>
              <div>
                <h2 className="section-title">Roles</h2>
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
                <UserTeams
                  teams={user.memberships.filter(
                    item => !item.team.name.startsWith('Role::'),
                  )}
                />
              </div>
              <div className="footer-save">
                <button
                  disabled={!fieldValuesValid(fieldValues)}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="page-panel page-panel--forty page-panel--sidebar page-panel--space-profile-edit-sidebar ">
          <ProfileCard
            user={buildProfile(fieldValues, user)}
            button={
              <Link to={`/settings/users/${user.username}`}>
                <button className="btn btn-primary btn-sm">View Profile</button>
              </Link>
            }
          />
        </div>
      </Fragment>
    )}
  </div>
);

const managerLookup = (users, managerUsername) => {
  let manager = users.find(user => user.username === managerUsername);
  return manager ? manager.displayName : null;
};

const UserTeams = ({ teams }) => (
  <div className="t-card-wrapper">
    {Object.keys(teams).length > 0 ? (
      teams.map(item => <TeamCard key={item.team.name} team={item.team} />)
    ) : (
      <p>No teams assigned</p>
    )}
  </div>
);

const fieldValuesValid = fieldValues =>
  fieldValues.displayName && fieldValues.email;

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
    : [],
});

const translateFieldValuesToProfile = (fieldValues, profile) => {
  const result = {
    username: profile.username,
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
    memberships: fieldValues.userRoles.map(role => ({
      team: {
        name: role,
      },
    })),
  };
  return result;
};

const mapStateToProps = state => ({
  loading: state.profiles.loading,
  user: state.profiles.profile,
  users: state.settingsUsers.users,
  error: state.profiles.error,
  location:
    state.profiles.profile &&
    state.profiles.profile.profileAttributes['Location'],
  locationEnabled: state.app.userProfileAttributeDefinitions['Location'],
  spaceAttributes:
    state.kinops.space &&
    state.kinops.space.attributes.reduce((memo, item) => {
      memo[item.name] = item.value;
      return memo;
    }, {}),
  roles: state.teamList.roles,
});

const mapDispatchToProps = {
  fetchUsers: usersActions.fetchUsers,
  fetchTeams: teamsActions.fetchTeams,
  fetchProfile: profileActions.fetchProfile,
  updateProfile: profileActions.updateProfile,
  openForm: commonActions.openForm,
};

export const EditUser = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState(
    'fieldValues',
    'setFieldValues',
    translateProfileToFieldValues({ spaceAdmin: false, enabled: false }),
  ),
  withHandlers({
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
        userRoles = [value, ...props.fieldValues.userRoles];
      }
      props.setFieldValues({
        ...props.fieldValues,
        userRoles,
      });
    },
    handleSubmit: props => event => {
      event.preventDefault();
      props.updateProfile(
        translateFieldValuesToProfile(props.fieldValues, props.user),
      );
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchProfile(this.props.match.params.username);
      if (this.props.users.size <= 0) {
        this.props.fetchUsers();
      }
      this.props.fetchTeams();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.user !== nextProps.user) {
        this.props.setFieldValues({
          ...this.props.fieldValues,
          ...translateProfileToFieldValues(nextProps.user),
        });
      }
    },
  }),
)(EditUserComponent);
