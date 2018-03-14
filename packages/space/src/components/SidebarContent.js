import React from 'react';
import { connect } from 'react-redux';
import { Utils } from 'react-kinops-common';
import { Link, NavLink } from 'react-router-dom';
import { getTeamColor } from '../utils';
import { KappCard } from './shared/KappCard';

const SidebarComponent = ({ kapps, teams, isSpaceAdmin }) => (
  <div className="sidebar">
    {kapps.length > 0 && (
      <div className="kapp-cards-wrapper">
        <h6>Kapps</h6>
        {kapps.map(kapp => <KappCard key={kapp.slug} kapp={kapp} />)}
      </div>
    )}
    <div className="my-teams-wrapper">
      <h6>
        My Teams
        <Link to="/teams" className="view-all">
          All Teams
        </Link>
      </h6>

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
                <i
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

export const mapStateToProps = ({ kinops }) => ({
  kapps: kinops.kapps
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(kapp => kapp.slug !== 'admin'),
  teams: Utils.getTeams(kinops.profile).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
  isSpaceAdmin: kinops.profile.spaceAdmin,
});

export const SidebarContent = connect(mapStateToProps)(SidebarComponent);
