import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from './Avatar';

const getProfilePhone = profile =>
  profile.profileAttributes['Phone Number']
    ? profile.profileAttributes['Phone Number'].join(', ')
    : '';

export const ProfileCard = ({ user, button }) => {
  return (
    <div className="card card--profile">
      <Avatar user={user} size={96} previewable={false} />
      <h1>{user.displayName}</h1>
      <p>{user.email}</p>
      {getProfilePhone(user) && <p>{getProfilePhone(user)}</p>}
      {button ? button : null}
      <Link className="btn btn-primary btn-sm" to={`/profile/${user.username}`}>
        View Profile
      </Link>
    </div>
  );
};
