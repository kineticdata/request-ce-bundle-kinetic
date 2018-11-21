import React from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from 'common';
import { TeamCard } from '../shared/TeamCard';
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

export const Teams = ({ loading, teams, me, openRequestNewTeam }) => (
  <div className="space-teams--container page--container">
    <PageTitle parts={['Teams']} />

    {!loading && (
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /
            </h3>
            <h1>Teams</h1>
          </div>
          {me.spaceAdmin ? (
            <Link to="/settings/teams/new" className="btn btn-secondary">
              New Team
            </Link>
          ) : (
            <button onClick={openRequestNewTeam} className="btn btn-secondary">
              Request New Team
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
