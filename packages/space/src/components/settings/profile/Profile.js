import React, { Fragment } from 'react';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fromJS } from 'immutable';
import { modalFormActions, PageTitle } from 'common';
import { actions } from '../../../redux/modules/profiles';
import { ProfileCard } from '../../shared/ProfileCard';
import { TeamCard } from '../../shared/TeamCard';

export const EditProfileComponent = ({
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
  <div className="page-container page-container--panels page-container--space-profile-edit">
    <PageTitle parts={['Edit Profile']} />
    {!loading && (
      <Fragment>
        <div className="page-panel page-panel--three-fifths page-panel--scrollable page-panel--space-profile-edit">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> / <Link to="/settings">settings</Link>{' '}
                /{' '}
              </h3>
              <h1>Edit Profile</h1>
            </div>
          </div>
          <section>
            <h2 className="section__title">General</h2>
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
                <div className="form-group">
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
                        type="password"
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
                        type="password"
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
              <div className="form__footer">
                <div className="form__footer__right">
                  <button
                    disabled={!fieldValuesValid(fieldValues)}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </section>
          {(managerEnabled || locationEnabled) && (
            <section>
              <h2 className="section__title">User Attributes</h2>
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
            </section>
          )}
          <section>
            <h2 className="section__title">Roles</h2>

            <UserRoles
              roles={profile.memberships.filter(item =>
                item.team.name.startsWith('Role::'),
              )}
            />
          </section>
          <section>
            <h2 className="section__title">Teams</h2>
            <UserTeams
              teams={profile.memberships.filter(
                item => !item.team.name.startsWith('Role::'),
              )}
            />
          </section>
        </div>

        <div className="page-panel page-panel--two-fifths page-panel--sidebar page-panel--space-profile-edit-sidebar">
          <ProfileCard
            user={buildProfile(fieldValues, profile)}
            button={
              <Link to={`/profile/${profile.username}`}>
                <button className="btn btn-primary btn-sm">View Profile</button>
              </Link>
            }
          />
        </div>
      </Fragment>
    )}
  </div>
);

const UserTeams = ({ teams }) => (
  <div className="cards__wrapper cards__wrapper--team">
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
  loading: state.space.profiles.loading,
  profile: state.space.profiles.profile,
  error: state.space.profiles.error,
  editingPassword: state.space.profiles.isChangePasswordVisible,
  location:
    state.space.profiles.profile &&
    state.space.profiles.profile.profileAttributes['Location'],
  locationEnabled: state.space.spaceApp.userProfileAttributeDefinitions['Location'],
  manager:
    state.space.profiles.profile && state.space.profiles.profile.attributes['Manager'],
  managerEnabled: state.space.spaceApp.userAttributeDefinitions['Manager'],
  spaceAttributes:
    state.app.space &&
    state.app.space.attributes.reduce((memo, item) => {
      memo[item.name] = item.value;
      return memo;
    }, {}),
});

const mapDispatchToProps = {
  fetchProfile: actions.fetchProfile,
  toggleChangePassword: actions.setChangePasswordVisible,
  updateProfile: actions.updateProfile,
  openForm: modalFormActions.openForm,
};

export const Profile = compose(
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
      this.props.fetchProfile();
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
)(EditProfileComponent);
