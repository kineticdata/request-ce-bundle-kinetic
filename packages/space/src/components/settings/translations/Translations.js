import React from 'react';
import { Link } from 'react-router-dom';


export const Translations = () => (
  <div className="datastore-container">
    <div className="datastore-content panel">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
          </h3>
          <h1>Translations</h1>
        </div>
      </div>
      <h2>Translations Go Here</h2>
    </div>
  </div>
);
