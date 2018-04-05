import React from 'react';
import { Link } from 'react-router-dom';


export const Notifications = () => (
  <div className="datastore-container">
    <div className="datastore-content pane">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
          </h3>
          <h1>Notifications</h1>
        </div>
      </div>
      <h2>Notifications Go Here</h2>
    </div>
  </div>
);
