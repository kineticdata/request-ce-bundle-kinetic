import React from 'react';
import { Link } from 'react-router-dom';

export const Translations = () => (
  <div className="page-container page-container--translations">
    <div className="page-panel page-panel--scrollable page-panel--translations">
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
