import React from 'react';
import { Utils } from 'common';
import { Link, NavLink } from 'react-router-dom';
import { getTeamColor } from '../utils';
import { KappCard } from './shared/KappCard';

export const SidebarContent = ({ kapps, teams, isSpaceAdmin }) => (
  <div className="sidebar space-sidebar">
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
  </div>
);
