import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { CoreAPI } from 'react-kinetic-core';
import ReactAvatar from 'react-avatar';
import { Popover } from 'reactstrap';

import { Cache } from '../cache';
import { ProfileCard } from './ProfileCard';

const AvatarIcon = ({ target, user, size, onClick }) => (
  <span id={target}>
    <ReactAvatar
      name={user.displayName || user.username}
      email={user.email || user.username}
      onClick={onClick}
      round
      size={size}
    />
  </span>
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
    this.target = `avatar_${uuid()}`;
  }

  handleToggleVisibility = () =>
    this.setState({ visible: !this.state.visible });

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
      visible: false,
    };
  }

  render() {
    const user = this.state.user;
    const size = this.props.size || 28;
    const className = this.props.className || 'avatar';
    const previewable = this.props.previewable === false ? false : true;

    if (user) {
      if (previewable) {
        return (
          <Fragment>
            <AvatarIcon
              user={user}
              size={size}
              className={className}
              onClick={this.handleToggleVisibility}
              target={this.target}
            />
            <Popover
              placement="right"
              isOpen={this.state.visible}
              toggle={this.handleToggleVisibility}
              target={this.target}
              hideArrow
              className="avatar-popover"
            >
              <ProfileCard user={user} />
            </Popover>
          </Fragment>
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
