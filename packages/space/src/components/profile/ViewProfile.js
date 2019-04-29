import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { actions, selectIsMyProfile } from '../../redux/modules/profiles';
import { context } from '../../redux/store';
import { TeamCard } from '../shared/TeamCard';
import { Avatar } from 'common';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

const ViewProfileComponent = ({
  loading,
  profile,
  isMyProfile,
  department,
  departmentEnabled,
  organization,
  organizationEnabled,
  site,
  siteEnabled,
  manager,
  managerEnabled,
}) => (
  <div className="page-container page-container--space-profile">
    <PageTitle parts={['Profile']} />
    {!loading && (
      <div className="page-panel page-panel--profile">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">
                <I18n>home</I18n>
              </Link>{' '}
              /
            </h3>
            <h1>
              <I18n>Profile</I18n>
            </h1>
          </div>
          {isMyProfile ? (
            <Link to="/settings/profile" className="btn btn-secondary">
              <I18n>Edit Profile</I18n>
            </Link>
          ) : null}
        </div>
        <div className="card card--profile">
          <Avatar user={profile} size={96} previewable={false} />
          <h3>{profile.displayName}</h3>
          <p>{getEmail(profile)}</p>
          <p>{getProfilePhone(profile)}</p>
          <UserRoles roles={profile.memberships} />
          {(managerEnabled ||
            siteEnabled ||
            departmentEnabled ||
            organizationEnabled) && (
            <dl>
              {managerEnabled && (
                <span>
                  <dt>
                    <I18n>Manager</I18n>
                  </dt>
                  <dd>
                    {manager ? (
                      <I18n>{manager}</I18n>
                    ) : (
                      <em>
                        <I18n>No Manager</I18n>
                      </em>
                    )}
                  </dd>
                </span>
              )}
              {departmentEnabled && (
                <span>
                  <dt>
                    <I18n>Department</I18n>
                  </dt>
                  <dd>
                    {department ? (
                      <I18n>{department}</I18n>
                    ) : (
                      <em>
                        <I18n>No Department</I18n>
                      </em>
                    )}
                  </dd>
                </span>
              )}
              {organizationEnabled && (
                <span>
                  <dt>
                    <I18n>Organization</I18n>
                  </dt>
                  <dd>
                    {organization ? (
                      <I18n>{organization}</I18n>
                    ) : (
                      <em>
                        <I18n>No Organization</I18n>
                      </em>
                    )}
                  </dd>
                </span>
              )}
              {siteEnabled && (
                <span>
                  <dt>
                    <I18n>Site</I18n>
                  </dt>
                  <dd>
                    {site ? (
                      <I18n>{site}</I18n>
                    ) : (
                      <em>
                        <I18n>No Site</I18n>
                      </em>
                    )}
                  </dd>
                </span>
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
    <div className="cards__wrapper cards__wrapper--team">
      {filteredTeams.map(item => (
        <TeamCard key={item.team.name} team={item.team} />
      ))}
    </div>
  ) : (
    <p>
      <I18n>No teams assigned</I18n>
    </p>
  );
};

const getEmail = profile =>
  profile.email ? profile.email : <I18n>No e-mail address</I18n>;

const getProfilePhone = profile =>
  profile.profileAttributes['Phone Number'] ? (
    profile.profileAttributes['Phone Number'].join(', ')
  ) : (
    <I18n>No phone number</I18n>
  );

export const mapStateToProps = state => ({
  loading: state.profiles.loading,
  profile: state.profiles.profile,
  error: state.profiles.error,
  department:
    state.profiles.profile &&
    state.profiles.profile.attributes['Department'] &&
    state.profiles.profile.attributes['Department'][0],
  departmentEnabled: state.spaceApp.userAttributeDefinitions['Department'],
  manager:
    state.profiles.profile &&
    state.profiles.profile.attributes['Manager'] &&
    state.profiles.profile.attributes['Manager'][0],
  managerEnabled: state.spaceApp.userAttributeDefinitions['Manager'],
  organization:
    state.profiles.profile &&
    state.profiles.profile.attributes['Organization'] &&
    state.profiles.profile.attributes['Organization'][0],
  organizationEnabled: state.spaceApp.userAttributeDefinitions['Organization'],
  site:
    state.profiles.profile &&
    state.profiles.profile.attributes['Site'] &&
    state.profiles.profile.attributes['Site'][0],
  siteEnabled: state.spaceApp.userAttributeDefinitions['Site'],
  isMyProfile: selectIsMyProfile(state),
});

export const mapDispatchToProps = {
  fetchProfile: actions.fetchProfile,
};

export const ViewProfile = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchProfile(this.props.username);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.username !== nextProps.username) {
        this.props.fetchProfile(nextProps.username);
      }
    },
  }),
)(ViewProfileComponent);
