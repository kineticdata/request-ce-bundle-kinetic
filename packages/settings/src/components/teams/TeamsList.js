import React from 'react';
import { Link } from '@reach/router';
import { TeamsListItem } from './TeamsListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

const WallyEmptyMessage = ({ me }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Teams Right Now...</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      {me.spaceAdmin && (
        <h6>
          <I18n>Add a team by hitting the new button!</I18n>
        </h6>
      )}
    </div>
  );
};

export const TeamsList = ({ loading, teams, me }) => (
  <div className="space-teams--container page-container">
    <PageTitle parts={['Teams']} />
    {!loading && (
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/settings">
                <I18n>settings</I18n>
              </Link>{' '}
              /{' '}
            </h3>
            <h1>
              <I18n>Teams</I18n>
            </h1>
          </div>

          <Link to="/settings/teams/new" className="btn btn-secondary">
            <I18n>New Team</I18n>
          </Link>
        </div>
        {teams.size > 0 ? (
          <div className="space-admin-wrapper">
            <table className="table table-sm table--settings">
              <thead className="d-none d-md-table-header-group sortable">
                <tr className="header">
                  <th scope="col" width="33%">
                    <I18n>Team</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Description</I18n>
                  </th>
                  <th className="sort-disabled" />
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
