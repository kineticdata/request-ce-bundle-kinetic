import React, { Fragment } from 'react';

import { Avatar } from '../../shared/Avatar';

export const TeamMemberAvatar = ({ user, size }) => (
  <Fragment>
    <Avatar user={user} size={size || '24px'} />
  </Fragment>
);
