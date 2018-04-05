import React from 'react';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fromJS } from 'immutable';
import { commonActions, PageTitle } from 'common';
import { actions } from '../../../redux/modules/profiles';
import { ProfileCard } from '../../shared/ProfileCard';
import { TeamCard } from '../../shared/TeamCard';

export const EditUserComponent = ({
  loading,
  profile,
  error,
  editingPassword,
  fieldValues,
  location,
  locationEnabled,
  manager,
  managerEnabled,
  handleChangeManagerClick,
  handleFieldChange,
  handleSubmit,
  handleTogglePassword,
}) => (
  <div className="profile-container">
    <PageTitle parts={['Users', 'Settings']} />
    {!loading && (
      <div className="fragment">
        <div className="profile-content pane">
          <div className="page-title-wrapper">
            <div className="page-title">
              <h3>
                <Link to="/">home</Link> /{` `}
                <Link to="/settings">settings</Link> /{` `}
                <Link to={`/settings/users/`}>users</Link> /{` `}
              </h3>
              <h1>Edit: {profile.displayName || profile.username}</h1>
            </div>
          </div>
          <div>
            <h2 className="section-title">General</h2>
            <form onSubmit={handleSubmit}>
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
              <div className="profile-input-container">
                <div className="form-group required two-columns first-column">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={handleFieldChange}
                    value={fieldValues.email}
                  />
                </div>
                <div className="form-group two-columns second-column">
                  <label htmlFor="phoneNumber">Phone number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    onChange={handleFieldChange}
                    value={fieldValues.phoneNumber}
                  />
                </div>
              </div>
              {editingPassword ? (
                <div>
                  <hr />
                  <div className="profile-input-container">
                    <div className="form-group required two-columns first-column">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="text"
                        id="newPassword"
                        name="newPassword"
                        onChange={handleFieldChange}
                        value={fieldValues.newPassword}
                      />
                    </div>
                    <div className="form-group required two-columns second-column">
                      <label htmlFor="confirmPassword">
                        Password Confirmation
                      </label>
                      <input
                        type="text"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={handleFieldChange}
                        value={fieldValues.confirmPassword}
                      />
                    </div>
                  </div>
                  {fieldValues.newPassword !== fieldValues.confirmPassword && (
                    <p className="form-alert">Passwords Must Match</p>
                  )}
                  <div>
                    <button
                      onClick={handleTogglePassword}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel Password Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleTogglePassword}
                  className="change-password btn btn-secondary btn-sm"
                >
                  Change Password
                </button>
              )}
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
          {(managerEnabled || locationEnabled) && (
            <div>
              <h2 className="section-title">User Attributes</h2>
              <div className="user-attributes-wrapper">
                <table className="user-attributes table">
                  <tbody>
                    {managerEnabled && (
                      <tr>
                        <td className="name">Manager</td>
                        <td>
                          {manager || <i>No Manager</i>}
                          <button
                            className="btn btn-link btn-sm"
                            onClick={handleChangeManagerClick}
                          >
                            Change Manager
                          </button>
                        </td>
                      </tr>
                    )}
                    {locationEnabled && (
                      <tr>
                        <td className="name">Location</td>
                        <td>{location || <i>No Location</i>}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div>
            <h2 className="section-title">Roles</h2>

            <UserRoles
              roles={profile.memberships.filter(item =>
                item.team.name.startsWith('Role::'),
              )}
            />
          </div>
          <div>
            <h2 className="section-title">Teams</h2>
            <UserTeams
              teams={profile.memberships.filter(
                item => !item.team.name.startsWith('Role::'),
              )}
            />
          </div>
        </div>

        <div className="profile-sidebar pane d-none d-sm-block">
          <ProfileCard
            user={buildProfile(fieldValues, profile)}
            button={
              <Link to={`/settings/users/${profile.username}`}>
                <button className="btn btn-primary btn-sm">View Profile</button>
              </Link>
            }
          />
        </div>
      </div>
    )}
  </div>
);

const UserTeams = ({ teams }) => (
  <div className="t-card-wrapper">
    {Object.keys(teams).length > 0 ? (
      teams.map(item => <TeamCard key={item.team.name} team={item.team} />)
    ) : (
      <p>No teams assigned</p>
    )}
  </div>
);

const UserRoles = ({ roles }) => (
  <div className="profile-roles-wrapper">
    {Object.keys(roles).length > 0 ? (
      roles.map(item => (
        <span className="profile-role" key={item.team.name}>
          {item.team.name.replace(/^Role::(.*?)/, '$1')}
        </span>
      ))
    ) : (
      <p>No roles assigned</p>
    )}
  </div>
);

const fieldValuesValid = fieldValues =>
  fieldValues.displayName &&
  fieldValues.email &&
  fieldValues.newPassword === fieldValues.confirmPassword;

const getProfilePhone = profile =>
  profile.profileAttributes && profile.profileAttributes['Phone Number']
    ? profile.profileAttributes['Phone Number'].join(', ')
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

const translateProfileToFieldValues = profile => ({
  displayName: profile.displayName || '',
  email: profile.email || '',
  newPassword: '',
  confirmPassword: '',
  phoneNumber: getProfilePhone(profile) || '',
});

const translateFieldValuesToProfile = (fieldValues, profile) => {
  const updatedProfile = buildProfile(fieldValues, profile);
  const result = {
    displayName: updatedProfile.displayName,
    email: updatedProfile.email,
    profileAttributes: updatedProfile.profileAttributes,
  };
  if (fieldValues.newPassword !== '') {
    result.password = fieldValues.newPassword;
  }
  return result;
};

const openChangeManagerForm = ({ spaceAttributes, openForm }) => config => {
  openForm({
    kappSlug: spaceAttributes['Admin Kapp Slug'] || 'admin',
    formSlug:
      spaceAttributes['Change Manager Form Slug'] || 'manager-change-request',
    title: 'Change Manager',
    confirmationMessage: 'Your request has been submitted.',
  });
};

const mapStateToProps = state => ({
  loading: state.profiles.loading,
  profile: state.profiles.profile,
  error: state.profiles.error,
  editingPassword: state.profiles.isChangePasswordVisible,
  location:
    state.profiles.profile &&
    state.profiles.profile.profileAttributes['Location'],
  locationEnabled: state.app.userProfileAttributeDefinitions['Location'],
  manager:
    state.profiles.profile && state.profiles.profile.attributes['Manager'],
  managerEnabled: state.app.userAttributeDefinitions['Manager'],
  spaceAttributes:
    state.kinops.space &&
    state.kinops.space.attributes.reduce((memo, item) => {
      memo[item.name] = item.value;
      return memo;
    }, {}),
});

const mapDispatchToProps = {
  fetchProfile: actions.fetchProfile,
  toggleChangePassword: actions.setChangePasswordVisible,
  updateProfile: actions.updateProfile,
  openForm: commonActions.openForm,
};

export const EditUser = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('fieldValues', 'setFieldValues', translateProfileToFieldValues({})),
  withHandlers({
    handleChangeManagerClick: openChangeManagerForm,
    handleFieldChange: props => ({ target: { name, value } }) => {
      name && props.setFieldValues({ ...props.fieldValues, [name]: value });
    },
    handleTogglePassword: props => event => {
      props.toggleChangePassword(!props.editingPassword);
      props.setFieldValues({
        ...props.fieldValues,
        newPassword: '',
        confirmPassword: '',
      });
    },
    handleSubmit: props => event => {
      event.preventDefault();
      props.updateProfile(
        translateFieldValuesToProfile(props.fieldValues, props.profile),
      );
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchProfile(this.props.match.params.username);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.profile !== nextProps.profile) {
        this.props.setFieldValues({
          ...this.props.fieldValues,
          ...translateProfileToFieldValues(nextProps.profile),
        });
      }
    },
  }),
)(EditUserComponent);
