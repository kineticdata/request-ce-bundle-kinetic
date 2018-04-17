import React, { Fragment } from 'react';
import { Utils } from 'common';
import { Link, NavLink, Switch, Route } from 'react-router-dom';
import { getTeamColor } from '../utils';
import { KappCard } from './shared/KappCard';

export const SidebarContent = ({
  kapps,
  teams,
  isSpaceAdmin,
  openSettings,
  settingsBackPath,
}) => (
  <div className="sidebar space-sidebar">
    <Switch>
      <Route
        path="/settings"
        render={() => (
          <Fragment>
            <Link to={settingsBackPath} className="nav-return">
              <span className="fa fa-fw fa-chevron-left" />
              Return to Home
            </Link>
            <ul className="nav flex-column settings-group">
              <li className="nav-item">
                <NavLink
                  to="/settings/space"
                  className="nav-link"
                  activeClassName="active"
                >
                  General
                  <span className="fa fa-fw fa-angle-right" />
                </NavLink>
                <NavLink
                  to="/settings/datastore"
                  className="nav-link"
                  activeClassName="active"
                >
                  Datastore
                  <span className="fa fa-fw fa-angle-right" />
                </NavLink>
                <NavLink
                  to="/settings/notifications"
                  className="nav-link"
                  activeClassName="active"
                >
                  Notifications
                  <span className="fa fa-fw fa-angle-right" />
                </NavLink>
                <NavLink
                  to="/settings/users"
                  className="nav-link"
                  activeClassName="active"
                >
                  Users
                  <span className="fa fa-fw fa-angle-right" />
                </NavLink>
                <NavLink
                  to="/settings/profile"
                  className="nav-link"
                  activeClassName="active"
                >
                  Profile
                  <span className="fa fa-fw fa-angle-right" />
                </NavLink>
              </li>
            </ul>
          </Fragment>
        )}
      />
      <Route
        render={() => (
          <Fragment>
            {kapps.length > 0 && (
              <div className="sidebar-group sidebar-kapp-cards">
                <h1>Kapps</h1>
                {kapps.map(kapp => <KappCard key={kapp.slug} kapp={kapp} />)}
              </div>
            )}
            <div className="sidebar-group sidebar-my-teams">
              <h1>
                My Teams
                <Link to="/teams" className="view-all">
                  All Teams
                </Link>
              </h1>

              {teams.length === 0 && (
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link to="/teams" className="nav-link">
                      Join a team
                    </Link>
                  </li>
                  {isSpaceAdmin && (
                    <li className="nav-item">
                      <Link to="/teams/new" className="nav-link">
                        Create a team
                      </Link>
                    </li>
                  )}
                </ul>
              )}
              <ul className="nav flex-column">
                {teams.length > 0 &&
                  teams.map(team => (
                    <li key={team.slug} className="nav-item">
                      <NavLink
                        to={`/teams/${team.slug}`}
                        className="nav-link"
                        activeClassName="active"
                      >
                        <span
                          style={{ background: getTeamColor(team) }}
                          className={`fa ${Utils.getAttributeValue(
                            team,
                            'Icon',
                            'fa-group',
                          )} fa-fw card-icon`}
                        />
                        {`${team.name}`}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </div>
            <ul className="nav flex-column settings-group">
              <Link to="/settings" onClick={openSettings} className="nav-link">
                Settings
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            </ul>
          </Fragment>
        )}
      />
    </Switch>
  </div>
);
