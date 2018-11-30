import React from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import { MessagesGroup } from 'discussions';

import { getTeamColor } from '../../utils';

import { Avatar } from 'common';

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

const RelatedItemBadge = ({ discussion }) => {
  const type = discussion.tag_list.find(t => t.startsWith('META:TYPE:'))
    ? discussion.tag_list
        .find(t => t.startsWith('META:TYPE:'))
        .replace('META:TYPE:', '')
    : null;

  const id = discussion.tag_list.find(t => t.startsWith('META:ID:'))
    ? discussion.tag_list
        .find(t => t.startsWith('META:ID:'))
        .replace('META:ID:', '')
    : null;

  switch (type) {
    case 'Queue Task':
      return (
        <Link
          className="btn btn-inverse btn-sm"
          to={`/kapps/queue/submissions/${id}`}
        >
          View Task
        </Link>
      );
    // Removed to differeniate between task and team discussions
    // case 'Team':
    //   return (
    //     <Link className="btn btn-inverse btn-sm" to={`/teams/${id}`}>
    //       View Team
    //     </Link>
    //   );
    default:
      return <span />;
  }
};

export const Discussion = ({ discussion, me, discussionServerUrl, teams }) => {
  const messages = discussion
    ? discussion.last_message
      ? List([discussion.last_message])
      : List()
    : List();

  return (
    <div
      className="discussion-summary"
      style={getTeamHeaderStyle(discussion, teams)}
    >
      <div className="header">
        <Link to={`/discussions/${discussion.guid}`} className="header__title">
          {discussion.name}
        </Link>
        <RelatedItemBadge discussion={discussion} />
        <div className="participants">
          {discussion.participants.map(participant => (
            <Avatar
              key={participant.guid}
              username={participant.email}
              size={24}
            />
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
