import React from 'react';
import { Link } from 'react-router-dom';
import SVGInline from 'react-svg-inline';

import { PageTitle } from '../shared/PageTitle';
import { TeamCard } from '../shared/TeamCard';

import wallyHappyImage from '../../images/wally-happy.svg';

const WallyEmptyMessage = ({ me }) => {
  return (
    <div className="wally">
      <h5>No Teams Right Now...</h5>
      <SVGInline svg={wallyHappyImage} />
      {me.spaceAdmin && <h6>Add a team by hitting the new button!</h6>}
    </div>
  );
};

export const Teams = ({ loading, teams, me, openRequestNewTeam }) => (
  <div className="teams-container">
    <PageTitle parts={['Teams']} />

    {!loading && (
      <div>
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to="/">home</Link> /
            </h3>
            <h1>Teams</h1>
          </div>
          {me.spaceAdmin ? (
            <Link to="/teams/new" className="btn btn-default">
              Create New Team
            </Link>
          ) : (
            <button onClick={openRequestNewTeam} className="btn btn-default">
              Request New Team
            </button>
          )}
        </div>
        {teams.size > 0 ? (
          <div className="t-card-wrapper">
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
