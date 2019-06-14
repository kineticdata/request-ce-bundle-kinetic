import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Avatar } from 'common';

import { actions } from '../../redux/modules/settingsUsers';
import { context } from '../../redux/store';

import { TeamCard } from '../shared/TeamCard';
import { PageTitle } from '../shared/PageTitle';

const ViewUserComponent = ({ loading, profile }) => (
  <div className="page-container page-container--users">
    <PageTitle parts={['Users', 'Settings']} />
    {!loading && (
      <div className="page-panel page-panel--scrollable">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/settings">settings</Link> /{` `}
              <Link to={`/settings/users/`}>users</Link> /{` `}
            </h3>
            <h1>{profile.displayName}</h1>
          </div>
          <Link
            to={`/settings/users/${profile.username}/edit`}
            className="btn btn-secondary"
          >
            Edit User
          </Link>
        </div>
        <div className="card card--profile">
          <Avatar user={profile} size={96} />
          <h3>{profile.displayName}</h3>
          <p>{getEmail(profile)}</p>
          <p>{getProfilePhone(profile)}</p>
          <UserRoles roles={profile.memberships} />
        </div>
        <h2 className="section__title">Teams</h2>
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
  loading: state.settingsUsers.userLoading,
  profile: state.settingsUsers.user,
  error: state.settingsUsers.error,
});

export const mapDispatchToProps = {
  fetchUser: actions.fetchUser,
};

export const ViewUser = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchUser(this.props.username);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.username !== nextProps.username) {
        this.props.fetchUser(nextProps.username);
      }
    },
  }),
)(ViewUserComponent);
