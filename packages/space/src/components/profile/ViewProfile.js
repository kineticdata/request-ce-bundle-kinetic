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
  location,
  locationEnabled,
  manager,
  managerEnabled,
}) => (
  <div className="profile-container">
    <PageTitle parts={['Profile']} />
    {!loading && (
      <div className="profile-content pane">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to="/">home</Link> /
            </h3>
            <h1>Profile</h1>
          </div>
          {isMyProfile ? (
            <Link to="/profile" className="btn btn-secondary">
              Edit Profile
            </Link>
          ) : null}
        </div>
        <div className="p-card profile">
          <Avatar user={profile} size={96} />
          <h3>{profile.displayName}</h3>
          <p>{getEmail(profile)}</p>
          <p>{getProfilePhone(profile)}</p>
          <UserRoles roles={profile.memberships} />
          {(managerEnabled || locationEnabled) && (
            <dl>
              {managerEnabled && (
                <span>
                  <dt>Manager</dt>
                  <dd>{manager || <i>No Manager</i>}</dd>
                </span>
              )}
              {locationEnabled && (
                <span>
                  <dt>Location</dt>
                  <dd>{location || <i>No Location</i>}</dd>
                </span>
              )}
            </dl>
          )}
        </div>
        <h2 className="section-title">Teams</h2>
        <UserTeams teams={profile.memberships} />
      </div>
    )}
  </div>
);

const UserRoles = ({ roles }) => {
  const filteredTeams = roles.filter(item =>
    item.team.name.startsWith('Role::'),
  );

  return filteredTeams.length > 0 ? (
    <p>
      {filteredTeams.map(item => (
        <span className="profile-role" key={item.team.name}>
          {item.team.name.replace(/^Role::(.*?)/, '$1')}
        </span>
      ))}
    </p>
  ) : (
    <p>No user roles assigned</p>
  );
};

const UserTeams = ({ teams }) => {
  const filteredTeams = teams.filter(
    item => !item.team.name.startsWith('Role::'),
  );
  return filteredTeams.length > 0 ? (
    <div className="t-card-wrapper">
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
  loading: state.profiles.loading,
  profile: state.profiles.profile,
  error: state.profiles.error,
  location:
    state.profiles.profile &&
    state.profiles.profile.profileAttributes['Location'],
  locationEnabled: state.app.userProfileAttributeDefinitions['Location'],
  manager:
    state.profiles.profile && state.profiles.profile.attributes['Manager'],
  managerEnabled: state.app.userAttributeDefinitions['Manager'],
  isMyProfile: selectIsMyProfile(state),
});

export const mapDispatchToProps = {
  fetchProfile: actions.fetchProfile,
};

export const ViewProfile = compose(
  connect(mapStateToProps, mapDispatchToProps),
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
