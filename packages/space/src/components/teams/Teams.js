import React from 'react';
import { Link } from '@reach/router';
import { TeamCard } from '../shared/TeamCard';
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

export const Teams = ({ loading, teams, me, openRequestNewTeam }) => (
  <div className="space-teams--container page-container">
    <PageTitle parts={['Teams']} />

    {!loading && (
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">
                <I18n>home</I18n>
              </Link>{' '}
              /
            </h3>
            <h1>Teams</h1>
          </div>
          {me.spaceAdmin ? (
            <Link to="/settings/teams/new" className="btn btn-secondary">
              <I18n>New Team</I18n>
            </Link>
          ) : (
            <button onClick={openRequestNewTeam} className="btn btn-secondary">
              <I18n>Request New Team</I18n>
            </button>
          )}
        </div>
        {teams.size > 0 ? (
          <div className="cards__wrapper cards__wrapper--team">
            {teams.map(team => {
              return <TeamCard key={team.slug} team={team} />;
            })}
          </div>
        ) : (
          <WallyEmptyMessage me={me} />
        )}
      </div>
    )}
  </div>
);
