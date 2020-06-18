import React from 'react';
import wallyMissingIMage from 'common/src/assets/images/wally-missing.svg';
import { I18n } from '@kineticdata/react';

export const NotificationsNotFound = () => (
  <div className="empty-state empty-state--wally">
    <div className="empty-state__title">
      <I18n>Notification Forms Not Found</I18n>
    </div>
    <img src={wallyMissingIMage} alt="Missing Wally" />
    <div className="empty-state__message">
      <I18n>
        There are several datastore forms used to implement the notification
        functionality that need to be installed first.
      </I18n>
    </div>
  </div>
);
