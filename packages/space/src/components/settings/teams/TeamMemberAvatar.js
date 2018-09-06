import React, { Fragment } from 'react';

import { Avatar } from '../../shared/Avatar';

export const TeamMemberAvatar = ({ user }) => (
  <Fragment>
    <Avatar user={user} />
  </Fragment>
);
