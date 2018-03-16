import React from 'react';

export const LoadMoreMessages = ({ discussion }) => {
  let title = 'Load More Messages';
  let subtitle = 'Scroll to the top to load more messages...';
  const hasMessages = discussion.messages.size > 0;

  if (discussion.loadingMoreMessages) {
    title = 'Loading More Messages';
    subtitle = 'Please wait while we load more messages...';
  } else if (!discussion.hasMoreMessages && !hasMessages) {
    title = 'No Messages';
    subtitle = 'There are no messages, enter a message below.';
  } else if (!discussion.hasMoreMessages) {
    title = null;
    subtitle = 'There are no more messages to load, you are at the beginning.';
  }

  return discussion.messagesLoading ? null : (
    <div className="load-more-messages">
      <h5>{title}</h5>
      <h6>{subtitle}</h6>
    </div>
  );
};
