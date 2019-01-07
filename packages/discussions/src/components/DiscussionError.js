import React from 'react';
import { Link } from 'react-router-dom';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';

const errors = {
  Unauthorized: "Sorry, you don't have access to this discussion",
  Unsubscribed: 'You have left the discussion',
};

export const DiscussionError = props => (
  <div className="discussions">
    <div className="empty-state empty-state--wally">
      <h5 className="empty-state__title">
        {errors[props.error] || props.error}
      </h5>
      <img src={wallyMissingImage} alt="Missing Wally" />
      {props.fullPage && (
        <h6 className="empty-state__subtitle">
          Head back to the <Link to="/">homepage</Link>.
        </h6>
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
