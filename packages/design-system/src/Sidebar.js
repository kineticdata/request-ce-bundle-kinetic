import React from 'react';

import { Link, Route } from 'react-router-dom';

export const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-group">
      <h1>System Styles</h1>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/avatars" className="nav-link">
            Avatars
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/breadcrumbs" className="nav-link">
            Breadcrumbs
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/buttons" className="nav-link">
            Buttons
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/cards" className="nav-link">
            Cards
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/forms" className="nav-link">
            Forms
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/layout" className="nav-link">
            Layouts
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/markupstyles" className="nav-link">
            Markup and style
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/modals" className="nav-link">
            Modals
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/navigations" className="nav-link">
            Navigation
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/popovers" className="nav-link">
            Popovers
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/toasts" className="nav-link">
            Toasts
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/typography" className="nav-link">
            Typography
            {/* <Route
              path="/buttons"
              exact
              render={() => (
                <ul>
                  <li>Matt is awesome</li>
                </ul>
              )}
            /> */}
          </Link>
        </li>
      </ul>
    </div>
  </div>
);
