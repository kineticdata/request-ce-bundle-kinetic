import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from '@reach/router';
import { getTeamColor, getTeamIcon } from '../../utils';
import { Avatar } from 'common';
import { I18n } from '@kineticdata/react';

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
        <h1>
          <I18n>{name}</I18n>
        </h1>
        <pre className="text-truncate">
          <I18n>{description}</I18n>
        </pre>

        {!name.startsWith('Role') &&
          slug && (
            <Link to={`/teams/${slug}`} className="btn btn-primary btn-sm">
              <I18n>View Team</I18n>
            </Link>
          )}
        {memberships && memberships.length > 0 ? (
          <p className="members-toggle" onClick={toggleShowMembers}>
            <I18n>{showMembers ? 'Less' : 'More'}</I18n>
            <span
              className={`fa fa-fw fa-chevron-${showMembers ? 'up' : 'down'}`}
            />
          </p>
        ) : (
          <p>
            <I18n>No members</I18n>
          </p>
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
    <h1>
      <I18n>Members</I18n>
    </h1>
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
