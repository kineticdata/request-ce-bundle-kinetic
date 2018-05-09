import React from 'react';
import wallyMissingIMage from 'common/src/assets/images/wally-missing.svg';

export const NotificationsNotFound = () => (
  <div className="empty-state empty-state--wally">
    <h5>Notification Forms Not Found</h5>
    <img src={wallyMissingIMage} alt="Missing Wally" />
    <h6>
      There are several datastore forms used to implement the notification
      functionality that need to be installed first.
    </h6>
  </div>
);
