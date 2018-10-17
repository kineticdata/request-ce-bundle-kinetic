import React from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from 'common';
import { TeamsListItem } from './TeamsListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';

const WallyEmptyMessage = ({ me }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Teams Right Now...</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      {me.spaceAdmin && <h6>Add a team by hitting the new button!</h6>}
    </div>
  );
};

export const TeamsList = ({ loading, teams, me }) => (
  <div className="space-teams--container page--container">
    <PageTitle parts={['Teams']} />
    {!loading && (
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /
              <Link to="/settings"> settings</Link> /
            </h3>
            <h1>Teams</h1>
          </div>

          <Link to="/settings/teams/new" className="btn btn-secondary">
            New Team
          </Link>
        </div>
        {teams.size > 0 ? (
          <div className="space-admin-wrapper">
            <table className="table">
              <thead className="d-none d-md-table-header-group">
                <tr className="header">
                  <th>Team</th>
                  <th>Description</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {teams.map(team => {
                  return <TeamsListItem key={team.slug} team={team} />;
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <WallyEmptyMessage me={me} />
        )}
      </div>
    )}
  </div>
);
