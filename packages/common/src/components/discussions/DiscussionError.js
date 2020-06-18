import React from 'react';
import { Link } from 'react-router-dom';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';

const errors = {
  Unauthorized: "Sorry, you don't have access to this discussion",
  Unsubscribed: 'You have left the discussion',
};

export const DiscussionError = props => (
  <div className="discussions--error">
    <div className="empty-state empty-state--wally">
      <div className="empty-state__title">
        {errors[props.error] || props.error}
      </div>
      <img src={wallyMissingImage} alt="Missing Wally" />
      {props.fullPage && (
        <div className="empty-state__message">
          Head back to the <Link to="/">homepage</Link>.
        </div>
      )}
    </div>
  </div>
);

export const DiscussionFullPageError = props => (
  <DiscussionError error={props.error} fullPage />
);

export const DiscussionPanelError = props => (
  <DiscussionError error={props.error} />
);
