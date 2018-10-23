import React, { Fragment } from 'react';

import { Avatar } from 'common';

export const TeamMemberAvatar = ({ user }) => (
  <Fragment>
    <Avatar user={user} />
  </Fragment>
);
