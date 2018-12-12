import React from 'react';

export const MoreMessagesBanner = props => {
  let title;
  let subtitle;
  if (props.loading) {
    title = 'Loading More Messages';
    subtitle = 'Please wait while we load more messages...';
  } else {
    if (props.hasMore) {
      title = 'Load More Messages';
      subtitle = 'Scroll to the top to load more messages...';
    } else {
      title = null;
      subtitle =
        'There are no more messages to load, you are at the beginning.';
    }
  }
  return (
    <div className="load-more-messages">
      <h5>{title}</h5>
      <h6>{subtitle}</h6>
    </div>
  );
};