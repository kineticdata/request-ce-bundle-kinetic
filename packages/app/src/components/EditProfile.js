import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { Link } from 'react-router-dom';
import {
  TeamCard,
  ErrorMessage,
  LoadingMessage,
  Utils,
  openModalForm,
} from 'common';
import { actions } from '../redux/modules/profile';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

export const EditProfileComponent = ({
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
  <div className="page-container page-container--panels">
    <PageTitle parts={['Edit Profile']} />
    {!error && !profile && <LoadingMessage />}
    {error && (
      <ErrorMessage title="Could not load profile" message={error.message} />
    )}
    {profile && (
      <Fragment>
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/profile">
                  <I18n>profile</I18n>
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
                    <label htmlFor="defaultKappDisplay">
                      <I18n>Default Kapp Display</I18n>
                    </label>
                    <I18n
                      render={translate => (
                        <select
                          className="form-control"
                          type="kapp"
                          id="defaultKappDisplay"
                          name="defaultKappDisplay"
                          onChange={handleFieldChange}
                          value={fieldValues.defaultKappDisplay}
                        >
                          <option value="" />
                          {kapps.map(k => (
                            <option key={k.slug} value={k.slug}>
                              {translate(k.name)}
                            </option>
                          ))}
                        </select>
                      )}
                    />
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
                      type="button"
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
                  type="button"
                  onClick={handleTogglePassword}
                  className="change-password btn btn-secondary btn-sm"
                >
                  <I18n>Change Password</I18n>
                </button>
              )}
              <div className="form__footer">
                <div className="form__footer__right">
                  <button
                    type="submit"
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
                        <td className="name">
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
                        <td className="name">
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
                        <td className="name">
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
                        <td className="name">
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
      </Fragment>
    )}
  </div>
);

const UserTeams = ({ teams }) => (
  <div className="cards__wrapper cards__wrapper--team">
    {Object.keys(teams).length > 0 ? (
      teams.map(item => (
        <TeamCard key={item.team.name} team={item.team} components={{ Link }} />
      ))
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

const buildProfile = (fieldValues, profile) => {
  const profileAttributesMap = {};
  profileAttributesMap['Phone Number'] = fieldValues.phoneNumber
    ? [fieldValues.phoneNumber]
    : [];
  profileAttributesMap['Default Kapp Display'] = fieldValues.defaultKappDisplay
    ? [fieldValues.defaultKappDisplay]
    : [];
  return {
    ...profile,
    displayName: fieldValues.displayName,
    email: fieldValues.email,
    preferredLocale: fieldValues.preferredLocale,
    timezone: fieldValues.timezone,
    profileAttributesMap,
  };
};

const translateProfileToFieldValues = profile => ({
  displayName: profile.displayName || '',
  email: profile.email || '',
  preferredLocale: profile.preferredLocale || '',
  timezone: profile.timezone || '',
  newPassword: '',
  confirmPassword: '',
  phoneNumber: Utils.getProfileAttributeValue(profile, 'Phone Number', ''),
  defaultKappDisplay: Utils.getProfileAttributeValue(
    profile,
    'Default Kapp Display',
    '',
  ),
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
    profileAttributesMap: updatedProfile.profileAttributesMap,
  };
  if (fieldValues.newPassword !== '') {
    result.password = fieldValues.newPassword;
  }
  return result;
};

const openChangeManagerForm = ({
  adminKappSlug,
  changeManagerFormSlug,
}) => config => {
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: changeManagerFormSlug,
    title: 'Change Manager',
    confirmationMessage: 'Your request has been submitted.',
  });
};

const selectAttributes = profile =>
  profile
    ? {
        departmentEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Department',
        ),
        department: Utils.getAttributeValue(profile, 'Department'),
        managerEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Manager',
        ),
        manager: Utils.getAttributeValue(profile, 'Manager'),
        organizationEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Organization',
        ),
        organization: Utils.getAttributeValue(profile, 'Organization'),
        siteEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Site',
        ),
        site: Utils.getAttributeValue(profile, 'Site'),
        defaultKappDisplayEnabled: Utils.hasAttributeDefinition(
          profile.space.userProfileAttributeDefinitions,
          'Default Kapp Display',
        ),
        defaultKappDisplay: Utils.getAttributeValue(
          { attributes: profile.profileAttributes },
          'Default Kapp Display',
        ),
      }
    : {};

const mapStateToProps = state => ({
  kapps: state.app.kapps,
  locales: state.app.locales,
  timezones: state.app.timezones,
  profile: state.profile.data,
  error: state.profile.error,
  ...selectAttributes(state.profile.data),
  adminKappSlug: Utils.getAttributeValue(
    state.app.space,
    'Admin Kapp Slug',
    'admin',
  ),
  changeManagerFormSlug: Utils.getAttributeValue(
    state.app.space,
    'Change Manager Form Slug',
    'change-manager-request',
  ),
});

const mapDispatchToProps = {
  fetchProfileRequest: actions.fetchProfileRequest,
  updateProfileRequest: actions.updateProfileRequest,
};

export const EditProfile = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('editingPassword', 'setEditingPassword', false),
  withState('fieldValues', 'setFieldValues', translateProfileToFieldValues({})),
  withHandlers({
    handleChangeManagerClick: openChangeManagerForm,
    handleFieldChange: props => ({ target: { name, value } }) => {
      name && props.setFieldValues({ ...props.fieldValues, [name]: value });
    },
    handleTogglePassword: props => event => {
      props.setEditingPassword(!props.editingPassword);
      props.setFieldValues({
        ...props.fieldValues,
        newPassword: '',
        confirmPassword: '',
      });
    },
    handleSubmit: props => event => {
      event.preventDefault();
      props.updateProfileRequest(
        translateFieldValuesToProfile(props.fieldValues, props.profile),
      );
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchProfileRequest();
    },
    componentDidUpdate(prevProps) {
      if (this.props.profile && prevProps.profile !== this.props.profile) {
        this.props.setFieldValues({
          ...prevProps.fieldValues,
          ...translateProfileToFieldValues(this.props.profile),
        });
      }
    },
  }),
)(EditProfileComponent);
