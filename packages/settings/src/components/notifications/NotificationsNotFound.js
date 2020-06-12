import React from 'react';
import wallyMissingIMage from 'common/src/assets/images/wally-missing.svg';
import { I18n } from '@kineticdata/react';

export const NotificationsNotFound = () => (
  <div className="empty-state empty-state--wally">
    <h5>
      <I18n>Notification Forms Not Found</I18n>
    </h5>
    <img src={wallyMissingIMage} alt="Missing Wally" role="presentation" />
    <h6>
      <I18n>
        There are several datastore forms used to implement the notification
        functionality that need to be installed first.
      </I18n>
    </h6>
  </div>
);
