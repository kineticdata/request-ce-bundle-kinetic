import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { Avatar, ErrorMessage, LoadingMessage, TeamCard, Utils } from 'common';
import { actions } from '../redux/modules/profile';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

const ProfileComponent = ({
  me,
  profile,
  error,
  department,
  departmentEnabled,
  organization,
  organizationEnabled,
  site,
  siteEnabled,
  manager,
  managerEnabled,
}) => (
  <div className="page-container">
    <PageTitle parts={['Profile']} />
    {!error && !profile && <LoadingMessage />}
    {error && (
      <ErrorMessage title="Could not load profile" message={error.message} />
    )}
    {profile && (
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <h1>
            <I18n>Profile</I18n>
          </h1>

          {profile.username === me.username ? (
            <div className="page-title__actions">
              <Link to="/profile/edit" className="btn btn-secondary">
                <I18n>Edit Profile</I18n>
              </Link>
            </div>
          ) : null}
        </div>
        <div className="card card--profile">
          <Avatar user={profile} size={96} previewable={false} />
          <h3>{profile.displayName}</h3>
          {profile.email ? (
            <p>{profile.email}</p>
          ) : (
            <p className="text-muted">
              <em>
                <I18n>No Email Address</I18n>
              </em>
            </p>
          )}
          {profile.profileAttributesMap['Phone Number'].length > 0 ? (
            <p>{profile.profileAttributesMap['Phone Number'].join(', ')}</p>
          ) : (
            <p className="text-muted">
              <em>
                <I18n>No Phone Number</I18n>
              </em>
            </p>
          )}
          <UserRoles roles={profile.memberships} />
          {(managerEnabled ||
            siteEnabled ||
            departmentEnabled ||
            organizationEnabled) && (
            <dl className="row">
              {managerEnabled && (
                <>
                  <dt className="col-6">
                    <I18n>Manager</I18n>
                  </dt>
                  <dd className="col-6">
                    {manager ? (
                      <I18n>{manager}</I18n>
                    ) : (
                      <em className="text-muted">
                        <I18n>No Manager</I18n>
                      </em>
                    )}
                  </dd>
                </>
              )}
              {departmentEnabled && (
                <>
                  <dt className="col-6">
                    <I18n>Department</I18n>
                  </dt>
                  <dd className="col-6">
                    {department ? (
                      <I18n>{department}</I18n>
                    ) : (
                      <em className="text-muted">
                        <I18n>No Department</I18n>
                      </em>
                    )}
                  </dd>
                </>
              )}
              {organizationEnabled && (
                <>
                  <dt className="col-6">
                    <I18n>Organization</I18n>
                  </dt>
                  <dd className="col-6">
                    {organization ? (
                      <I18n>{organization}</I18n>
                    ) : (
                      <em className="text-muted">
                        <I18n>No Organization</I18n>
                      </em>
                    )}
                  </dd>
                </>
              )}
              {siteEnabled && (
                <>
                  <dt className="col-6">
                    <I18n>Site</I18n>
                  </dt>
                  <dd className="col-6">
                    {site ? (
                      <I18n>{site}</I18n>
                    ) : (
                      <em className="text-muted">
                        <I18n>No Site</I18n>
                      </em>
                    )}
                  </dd>
                </>
              )}
            </dl>
          )}
        </div>
        <section>
          <h2 className="section__title">
            <I18n>Teams</I18n>
          </h2>
          <UserTeams teams={profile.memberships} />
        </section>
      </div>
    )}
  </div>
);

const UserRoles = ({ roles }) => {
  const filteredTeams = roles.filter(item =>
    item.team.name.startsWith('Role::'),
  );

  return filteredTeams.length > 0 ? (
    <div className="profile-roles-wrapper">
      {filteredTeams.map(item => (
        <span className="profile-role" key={item.team.name}>
          <I18n>{item.team.name.replace(/^Role::(.*?)/, '$1')}</I18n>
        </span>
      ))}
    </div>
  ) : (
    <p>
      <I18n>No user roles assigned</I18n>
    </p>
  );
};

const UserTeams = ({ teams }) => {
  const filteredTeams = teams.filter(
    item => !item.team.name.startsWith('Role::'),
  );
  return filteredTeams.length > 0 ? (
    <div className="cards__wrapper cards__wrapper--thirds">
      {filteredTeams.map(item => (
        <TeamCard key={item.team.name} team={item.team} components={{ Link }} />
      ))}
    </div>
  ) : (
    <p>
      <I18n>No teams assigned</I18n>
    </p>
  );
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
      }
    : {};

export const mapStateToProps = state => ({
  me: state.app.profile,
  profile: state.profile.data,
  error: state.profile.error,
  ...selectAttributes(state.profile.data),
});

export const mapDispatchToProps = {
  fetchProfileRequest: actions.fetchProfileRequest,
};

export const Profile = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ match: { params: { username } } }) => ({ username })),
  lifecycle({
    componentDidMount() {
      this.props.fetchProfileRequest(this.props.username);
    },
    componentDidUpdate(prevProps) {
      if (this.props.username !== prevProps.username) {
        this.props.fetchProfileRequest(this.props.username);
      }
    },
  }),
)(ProfileComponent);
