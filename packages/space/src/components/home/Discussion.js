import React from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import { MessagesGroup } from 'discussions';

import { getTeamColor } from '../../utils';

import { Avatar } from '../shared/Avatar';

const getTeamHeaderStyle = (discussion, teams) => {
  const teamRI = discussion.relatedItems.find(ri => ri.type === 'Team');
  const teamSlug = teamRI ? teamRI.key : null;

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
  const relatedItem = discussion.relatedItems[0] || null;

  if (relatedItem && relatedItem.type === 'Queue Task') {
    return (
      <Link
        className="btn btn-inverse btn-sm"
        to={`/kapps/queue/submissions/${relatedItem.key}`}
      >
        View Task
      </Link>
    );
  }
  return <span />;
};

export const Discussion = ({ discussion, me, discussionServerUrl, teams }) => {
  const displayableMessages = discussion
    ? discussion.messages.items.filter(m => m.type !== 'System').slice(-1)
    : [];
  const messages = List(displayableMessages);

  return (
    <div
      className="discussion-summary"
      style={getTeamHeaderStyle(discussion, teams)}
    >
      <div className="header">
        <Link to={`/discussions/${discussion.id}`} className="header__title">
          {discussion.title}
        </Link>
        <RelatedItemBadge discussion={discussion} />
        <div className="participants">
          {discussion.participants
            .filter(p => p.user.unknown !== true)
            .map(participant => (
              <Avatar
                key={participant.user.username}
                user={participant.user}
                size={24}
              />
            ))}
        </div>
      </div>

      <div className="messages">
        {messages.size > 0 && (
          <MessagesGroup
            discussion={discussion}
            messages={messages}
            profile={me}
            discussionServerUrl={discussionServerUrl}
          />
        )}
      </div>
    </div>
  );
};
