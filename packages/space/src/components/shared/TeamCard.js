import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';

import { getTeamColor, getTeamIcon } from '../../utils';

import { Avatar } from 'common';

const TeamCardComponent = props => {
  const { team, showMembers, toggleShowMembers } = props;
  const { name, slug, description, memberships } = team;
  return (
    <div className="card card--team">
      <div
        className="card--team__header"
        style={{ backgroundColor: getTeamColor(team) }}
      >
        <i className={`fa fa-${getTeamIcon(team)} card-icon`} />
        <span />
      </div>
      <div className="card--team__body">
        <h1>{name}</h1>
        <pre className="text-truncate">{description}</pre>

        {slug && (
          <Link to={`/teams/${slug}`} className="btn btn-primary btn-sm">
            View Team
          </Link>
        )}
        {memberships && memberships.length > 0 ? (
          <p className="members-toggle" onClick={toggleShowMembers}>
            {showMembers ? 'Less' : 'More'}
            <span
              className={`fa fa-fw fa-chevron-${showMembers ? 'up' : 'down'}`}
            />
          </p>
        ) : (
          <p>No members</p>
        )}
      </div>
      {memberships && memberships.length > 0 && showMembers ? (
        <Members members={memberships} />
      ) : null}
    </div>
  );
};

const toggleShowMembers = ({ showMembers, setShowMembers }) => () =>
  setShowMembers(!showMembers);

export const TeamCard = compose(
  withState('showMembers', 'setShowMembers', false),
  withHandlers({
    toggleShowMembers,
  }),
)(TeamCardComponent);

const Members = ({ members }) => (
  <div className="card--team__footer">
    <h1>Members</h1>
    <div className="card--team__footer__members">
      {(members || []).map(member => {
        return (
          <div
            className={`card--team__footer__member ${
              member.online ? 'online' : ''
            }`}
            key={member.user.username}
          >
            <Avatar username={member.user.username} size={26} />
          </div>
        );
      })}
    </div>
  </div>
);
