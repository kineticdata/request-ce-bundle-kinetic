import React from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import { MessagesGroup } from 'react-kinops-discussions';

import { getTeamColor } from '../../utils';

import { Avatar } from '../shared/Avatar';

const getTeamHeaderStyle = (discussion, teams) => {
  const teamSlug = discussion.tag_list.find(t => t === 'META:TYPE:Team')
    ? discussion.tag_list
        .find(t => t.startsWith('META:ID:'))
        .replace('META:ID:', '')
    : null;

  if (teamSlug) {
    const team = teams.find(t => t.slug === teamSlug);
    return team
      ? {
          borderTopWidth: '6px',
          borderTopColor: getTeamColor(team),
        }
      : {};
  }

  return {};
};

export const Discussion = ({ discussion, me, discussionServerUrl, teams }) => {
  const messages = discussion
    ? discussion.last_message ? List([discussion.last_message]) : List()
    : List();

  return (
    <div
      className="discussion-summary"
      style={getTeamHeaderStyle(discussion, teams)}
    >
      <div className="header">
        <Link to={`/discussions/${discussion.guid}`}>{discussion.name}</Link>

        <div className="participants">
          {discussion.participants.map(participant => (
            <Avatar key={participant.guid} user={participant} size={24} />
          ))}
        </div>
      </div>

      <div className="messages">
        {messages.size > 0 && (
          <MessagesGroup
            messages={messages}
            profile={me}
            discussionServerUrl={discussionServerUrl}
          />
        )}
      </div>
    </div>
  );
};
