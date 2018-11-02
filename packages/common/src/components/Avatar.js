import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import md5 from 'md5';
import { CoreAPI } from 'react-kinetic-core';

import { Cache } from '../cache';
import { Hoverable } from './Hoverable';
import { ProfileCard } from './ProfileCard';

const AvatarIcon = ({ user, className, size }) => (
  <div className={className || 'avatar'}>
    <img
      alt={user.displayName || user.username || user.name}
      src={`https://www.gravatar.com/avatar/${md5(
        user.username || user.email || '',
      )}?s=${size}&d=mm`}
      className={`gravatarimg${size} features`}
      height={`${size}px`}
      width={`${size}px`}
    />
  </div>
);

const userCache = new Cache(() =>
  CoreAPI.fetchUsers({ include: 'profileAttributes' }).then(
    ({ users }) => users,
  ),
);

export class AvatarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getState(props);
  }

  componentDidMount() {
    this.gettingUsers = true;
    if (this.props.user) {
      this.gettingUsers && this.setState({ user: this.props.user });
    } else {
      userCache.get().then(users => {
        const user = users.find(u => u.username === this.props.username);
        this.gettingUsers && this.setState({ user });
      });
    }
  }
  componentWillUnmount() {
    this.gettingUsers = false;
  }

  getState(props) {
    return {
      user: props.user,
      username: props.username,
    };
  }

  render() {
    const user = this.state.user;
    const size = this.props.size || 28;
    const className = this.props.className || 'avatar';
    const previewable = this.props.previewable === false ? false : true;
    const hoverable = this.props.hoverable === true ? true : false;

    if (user) {
      if (previewable) {
        return (
          <Hoverable
            hoverable={hoverable}
            key={user.username}
            render={() => <ProfileCard user={user} />}
          >
            <AvatarIcon user={user} size={size} className={className} />
          </Hoverable>
        );
      } else {
        return <AvatarIcon user={user} size={size} className={className} />;
      }
    } else {
      return <span />;
    }
  }
}

export const Avatar = connect(
  null,
  { push },
)(AvatarComponent);

Avatar.propTypes = {
  user: PropTypes.object,
  username: PropTypes.string,
  size: PropTypes.number,
};
