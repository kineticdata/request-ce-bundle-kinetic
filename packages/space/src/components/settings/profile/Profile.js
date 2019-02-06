import React, { Fragment } from 'react';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fromJS } from 'immutable';
import { modalFormActions, PageTitle } from 'common';
import { actions } from '../../../redux/modules/profiles';
import { ProfileCard } from 'common';
import { TeamCard } from '../../shared/TeamCard';
import { I18n } from '../../../../../app/src/I18nProvider';

export const EditProfileComponent = ({
  loading,
  profile,
  error,
  editingPassword,
  fieldValues,
  department,
  departmentEnabled,
  organization,
  organizationEnabled,
  site,
  siteEnabled,
  defaultKappDisplayEnabled,
  manager,
  managerEnabled,
  handleChangeManagerClick,
  handleFieldChange,
  handleSubmit,
  handleTogglePassword,
  kapps,
  locales,
  timezones,
}) => (
  <div className="page-container page-container--panels page-container--space-profile-edit">
    <PageTitle parts={['Edit Profile']} />
    {!loading && (
      <Fragment>
        <div className="page-panel page-panel--three-fifths page-panel--scrollable page-panel--space-profile-edit">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">
                  <I18n>home</I18n>
                </Link>{' '}
                /{' '}
                <Link to="/settings">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{' '}
              </h3>
              <h1>
                <I18n>Edit Profile</I18n>
              </h1>
            </div>
          </div>
          <section>
            <h2 className="section__title">General</h2>
            <form onSubmit={handleSubmit}>
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
              <div className="profile-input-container row">
                <div className="form-group required col-md-6">
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
                <div className="form-group col-md-6">
                  <label htmlFor="phoneNumber">
                    <I18n>Phone Number</I18n>
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    onChange={handleFieldChange}
                    value={fieldValues.phoneNumber}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="preferredLocale">Preferred Locale</label>
                  <select
                    type="text"
                    id="preferredLocale"
                    name="preferredLocale"
                    className="form-control"
                    onChange={handleFieldChange}
                    value={fieldValues.preferredLocale}
                  >
                    <option value="">None Selected</option>
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
                <div className="form-group col-md-6">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    type="text"
                    id="timezone"
                    name="timezone"
                    className="form-control"
                    onChange={handleFieldChange}
                    value={fieldValues.timezone}
                  >
                    <option value="">None Selected</option>
                    {timezones.map(timezone => (
                      <option value={timezone.id} key={timezone.id}>
                        {timezone.name} ({timezone.id})
                      </option>
                    ))}
                  </select>
                </div>
                {defaultKappDisplayEnabled && (
                  <div className="form-group col-md-6">
                    <label htmlFor="phoneNumber">
                      <I18n>Default Kapp Display</I18n>
                    </label>
                    <select
                      className="form-control"
                      type="kapp"
                      id="defaultKappDisplay"
                      name="defaultKappDisplay"
                      onChange={handleFieldChange}
                      value={fieldValues.defaultKappDisplay}
                    >
                      <option value="">Home</option>

                      {kapps.map(k => (
                        <option key={k.slug} value={k.slug}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {editingPassword ? (
                <div>
                  <hr />
                  <div className="profile-input-container row">
                    <div className="form-group col">
                      <label htmlFor="newPassword" className="required">
                        <I18n>New Password</I18n>
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        onChange={handleFieldChange}
                        value={fieldValues.newPassword}
                      />
                    </div>
                    <div className="form-group col">
                      <label htmlFor="confirmPassword" className="required">
                        <I18n>Password Confirmation</I18n>
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
                    <p className="form-alert">
                      <I18n>Passwords Must Match</I18n>
                    </p>
                  )}
                  <div>
                    <button
                      onClick={handleTogglePassword}
                      className="btn btn-secondary btn-sm"
                    >
                      <I18n>Cancel Password Change</I18n>
                    </button>
                  </div>
                  <hr />
                </div>
              ) : (
                <button
                  onClick={handleTogglePassword}
                  className="change-password btn btn-secondary btn-sm"
                >
                  <I18n>Change Password</I18n>
                </button>
              )}
              <div className="form__footer">
                <div className="form__footer__right">
                  <button
                    disabled={!fieldValuesValid(fieldValues)}
                    className="btn btn-primary"
                    // TODO: Disable until a change is made. Save Changes
                  >
                    <I18n>Save Changes</I18n>
                  </button>
                </div>
              </div>
            </form>
          </section>
          {(managerEnabled ||
            siteEnabled ||
            departmentEnabled ||
            organizationEnabled) && (
            <section>
              <h2 className="section__title">User Attributes</h2>
              <div className="user-attributes-wrapper">
                <table className="table table--user-attributes">
                  <tbody>
                    {managerEnabled && (
                      <tr>
                        <td scope="row" className="name">
                          <I18n>Manager</I18n>
                        </td>
                        <td>
                          {manager || (
                            <em>
                              <I18n>No Manager</I18n>
                            </em>
                          )}
                          <button
                            className="btn btn-link btn-sm"
                            onClick={handleChangeManagerClick}
                          >
                            <I18n>Change Manager</I18n>
                          </button>
                        </td>
                      </tr>
                    )}
                    {departmentEnabled && (
                      <tr>
                        <td scope="row" className="name">
                          <I18n>Department</I18n>
                        </td>
                        <td>
                          {department || (
                            <em>
                              <I18n>No Department</I18n>
                            </em>
                          )}
                        </td>
                      </tr>
                    )}
                    {organizationEnabled && (
                      <tr>
                        <td scope="row" className="name">
                          <I18n>Organization</I18n>
                        </td>
                        <td>
                          {organization || (
                            <em>
                              <I18n>No Organization</I18n>
                            </em>
                          )}
                        </td>
                      </tr>
                    )}
                    {siteEnabled && (
                      <tr>
                        <td scope="row" className="name">
                          <I18n>Site</I18n>
                        </td>
                        <td>
                          {site || (
                            <em>
                              <I18n>No Site</I18n>
                            </em>
                          )}
                        </td>
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
            hideProfileLink
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
      <p>
        <I18n>No teams assigned</I18n>
      </p>
    )}
  </div>
);

const UserRoles = ({ roles }) => (
  <div className="profile-roles-wrapper">
    {Object.keys(roles).length > 0 ? (
      roles.map(item => (
        <span className="profile-role" key={item.team.name}>
          <I18n>{item.team.name.replace(/^Role::(.*?)/, '$1')}</I18n>
        </span>
      ))
    ) : (
      <p>
        <I18n>No roles assigned</I18n>
      </p>
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

const getDefaultKappDisplay = profile =>
  profile.profileAttributes && profile.profileAttributes['Default Kapp Display']
    ? profile.profileAttributes['Default Kapp Display'][0]
    : '';

const buildProfile = (fieldValues, profile) => {
  const profileAttributes =
    profile && profile.profileAttributes
      ? fromJS(profile.profileAttributes).toJS()
      : {};
  if (fieldValues.phoneNumber !== '') {
    profileAttributes['Phone Number'] = [fieldValues.phoneNumber];
  }
  profileAttributes['Default Kapp Display'] = [fieldValues.defaultKappDisplay];
  return {
    ...profile,
    displayName: fieldValues.displayName,
    email: fieldValues.email,
    preferredLocale: fieldValues.preferredLocale,
    timezone: fieldValues.timezone,
    profileAttributes: profileAttributes,
  };
};

const translateProfileToFieldValues = profile => ({
  displayName: profile.displayName || '',
  email: profile.email || '',
  preferredLocale: profile.preferredLocale || '',
  timezone: profile.timezone || '',
  newPassword: '',
  confirmPassword: '',
  phoneNumber: getProfilePhone(profile) || '',
  defaultKappDisplay: getDefaultKappDisplay(profile) || '',
});

const translateFieldValuesToProfile = (fieldValues, profile) => {
  const updatedProfile = buildProfile(fieldValues, profile);
  const result = {
    displayName: updatedProfile.displayName,
    email: updatedProfile.email,
    preferredLocale:
      updatedProfile.preferredLocale === ''
        ? null
        : updatedProfile.preferredLocale,
    timezone: updatedProfile.timezone === '' ? null : updatedProfile.timezone,
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
      spaceAttributes['Change Manager Form Slug'] || 'change-manager-request',
    title: 'Change Manager',
    confirmationMessage: 'Your request has been submitted.',
  });
};

const mapStateToProps = state => ({
  loading: state.space.profiles.loading,
  profile: state.space.profiles.profile,
  error: state.space.profiles.error,
  editingPassword: state.space.profiles.isChangePasswordVisible,
  department:
    state.space.profiles.profile &&
    state.space.profiles.profile.attributes['Department'],
  departmentEnabled:
    state.space.spaceApp.userAttributeDefinitions['Department'],
  manager:
    state.space.profiles.profile &&
    state.space.profiles.profile.attributes['Manager'],
  managerEnabled: state.space.spaceApp.userAttributeDefinitions['Manager'],
  organization:
    state.space.profiles.profile &&
    state.space.profiles.profile.attributes['Organization'],
  organizationEnabled:
    state.space.spaceApp.userAttributeDefinitions['Organization'],
  site:
    state.space.profiles.profile &&
    state.space.profiles.profile.attributes['Site'],
  siteEnabled: state.space.spaceApp.userAttributeDefinitions['Site'],
  defaultKappDisplay:
    state.space.profiles.profile &&
    state.space.profiles.profile.profileAttributes['Default Kapp Display'],
  defaultKappDisplayEnabled:
    state.space.spaceApp.userProfileAttributeDefinitions[
      'Default Kapp Display'
    ],
  spaceAttributes:
    state.app.space &&
    state.app.space.attributes.reduce((memo, item) => {
      memo[item.name] = item.value;
      return memo;
    }, {}),
  kapps: state.app.kapps,
  locales: state.app.config.locales,
  timezones: state.app.config.timezones,
});

const mapDispatchToProps = {
  fetchProfile: actions.fetchProfile,
  toggleChangePassword: actions.setChangePasswordVisible,
  updateProfile: actions.updateProfile,
  openForm: modalFormActions.openForm,
};

export const Profile = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
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
