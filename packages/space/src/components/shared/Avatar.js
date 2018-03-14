import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import md5 from 'md5';

export const Avatar = ({ user, size = 28, className = 'avatar' }) => (
  <div className={className}>
    <Link to={`/profile/${user.username || user.email}`}>
      <img
        alt={user.displayName || user.username || user.name}
        src={`https://www.gravatar.com/avatar/${md5(
          user.username || user.email || '',
        )}?s=${size}&d=mm`}
        className={`gravatarimg${size} features`}
        height={`${size}px`}
        width={`${size}px`}
      />
    </Link>
  </div>
);

Avatar.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.number,
};
