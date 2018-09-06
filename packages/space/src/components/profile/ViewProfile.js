import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from 'common';
import { actions, selectIsMyProfile } from '../../redux/modules/profiles';
import { TeamCard } from '../shared/TeamCard';
import { Avatar } from '../shared/Avatar';

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
              <Link to="/">home</Link> /
            </h3>
            <h1>Profile</h1>
          </div>
          {isMyProfile ? (
            <Link to="/settings/profile" className="btn btn-secondary">
              Edit Profile
            </Link>
          ) : null}
        </div>
        <div className="card card--profile">
          <Avatar user={profile} size={96} />
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
                  <dt>Manager</dt>
                  <dd>{manager || <em>No Manager</em>}</dd>
                </span>
              )}
              {departmentEnabled && (
                <span>
                  <dt>Department</dt>
                  <dd>{department || <em>No Department</em>}</dd>
                </span>
              )}
              {organizationEnabled && (
                <span>
                  <dt>Organization</dt>
                  <dd>{organization || <em>No Organization</em>}</dd>
                </span>
              )}
              {siteEnabled && (
                <span>
                  <dt>Site</dt>
                  <dd>{site || <em>No Site</em>}</dd>
                </span>
              )}
            </dl>
          )}
        </div>
        <section>
          <h2 className="section__title">Teams</h2>
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
          {item.team.name.replace(/^Role::(.*?)/, '$1')}
        </span>
      ))}
    </div>
  ) : (
    <p>No user roles assigned</p>
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
    <p>No teams assigned</p>
  );
};

const getEmail = profile =>
  profile.email ? profile.email : 'No e-mail address';

const getProfilePhone = profile =>
  profile.profileAttributes['Phone Number']
    ? profile.profileAttributes['Phone Number'].join(', ')
    : 'No phone number';

export const mapStateToProps = state => ({
  loading: state.space.profiles.loading,
  profile: state.space.profiles.profile,
  error: state.space.profiles.error,
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
  isMyProfile: selectIsMyProfile(state),
});

export const mapDispatchToProps = {
  fetchProfile: actions.fetchProfile,
};

export const ViewProfile = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchProfile(this.props.match.params.username);
    },
    componentWillReceiveProps(nextProps) {
      if (
        this.props.match.params.username !== nextProps.match.params.username
      ) {
        this.props.fetchProfile(nextProps.match.params.username);
      }
    },
  }),
)(ViewProfileComponent);
