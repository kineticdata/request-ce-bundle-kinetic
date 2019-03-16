import React from 'react';

export const ArchivedBanner = props => (
  <div className="banner--archived text-danger">
    <i className="fa fa-fw fa-briefcase" />
    <span className="message">This discussion has been archived.</span>
    {props.canManage && (
      <a role="button" onClick={props.open}>
        Restore?
      </a>
    )}
  </div>
);
