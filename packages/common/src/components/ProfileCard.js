import React from 'react';

import { Avatar } from './Avatar';

const getProfilePhone = profile =>
  profile.profileAttributes['Phone Number']
    ? profile.profileAttributes['Phone Number'].join(', ')
    : '';

export const ProfileCard = ({ user, button }) => {
  return (
    <div className="card card--profile">
      <Avatar user={user} size={96} />
      <h1>{user.displayName}</h1>
      <p>{user.email}</p>
      {getProfilePhone(user) && <p>{getProfilePhone(user)}</p>}
      {button ? button : null}
    </div>
  );
};
