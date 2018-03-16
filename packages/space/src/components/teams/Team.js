import React from 'react';
import { Link } from 'react-router-dom';
import { getTeamColor, getTeamIcon } from '../../utils';
import { Discussion as KinopsDiscussion } from 'discussions';

import { PageTitle } from '../shared/PageTitle';
import { ServiceCard } from '../shared/ServiceCard';
import { TeamMemberAvatar } from './TeamMemberAvatar';
import { Hoverable } from '../shared/Hoverable';
import { ProfileCard } from '../shared/ProfileCard';

export const Team = ({
  loading,
  discussionId,
  openDiscussion,
  parent,
  team,
  subteams,
  services,
  memberships,
  me,
  userIsMember,
  openRequestToJoinForm,
  openRequestToLeaveForm,
}) => (
  <div className="team-container">
    <PageTitle parts={[team && team.name, 'Teams']} />
    {!loading && (
      <div className="fragment">
        <div className={`team-content pane ${userIsMember && 'scrollable'}`}>
          <div className="page-title-wrapper">
            <div className="page-title">
              <h3>
                <Link to="/">home</Link> / <Link to="/teams">teams</Link> /
              </h3>
              <h1>Team Profile</h1>
            </div>
            {me.spaceAdmin && (
              <Link to={`/teams/${team.slug}/edit`} className="btn btn-default">
                Edit Team
              </Link>
            )}
          </div>
          {userIsMember &&
            discussionId && (
              <div className="discussion-button-wrapper">
                <button
                  onClick={openDiscussion}
                  className="btn btn-primary btn-inverse discussion-button hidden-md-up"
                >
                  <span className="fa fa-comments fa-fw icon" />
                  View Discussion
                </button>
              </div>
            )}
          <div className="t-card">
            <div
              className="header"
              style={{ backgroundColor: getTeamColor(team) }}
            >
              <span />
              <i className={`fa fa-${getTeamIcon(team)} card-icon`} />
              <span />
            </div>
            <div className="content">
              <h1>{team.name}</h1>

              {team.description && <pre>{team.description}</pre>}

              {userIsMember ? (
                <button
                  onClick={openRequestToLeaveForm}
                  className="btn btn-primary"
                >
                  Request to Leave
                </button>
              ) : (
                <button
                  onClick={openRequestToJoinForm}
                  className="btn btn-primary"
                >
                  Request to Join
                </button>
              )}

              <div className="t-card-members-container">
                <h1>Members</h1>
                <div className="t-card-members-wrapper">
                  {memberships.map(user => (
                    <Hoverable
                      key={user.username}
                      render={() => <ProfileCard user={user} />}
                    >
                      <TeamMemberAvatar user={user} />
                    </Hoverable>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {parent && (
            <div>
              <h3 className="section-title">Parent Team</h3>
              <div className="parent">
                <Link to={`/teams/${parent.slug}`}>{parent.name}</Link>
                {parent.description && <p>{parent.description}</p>}
              </div>
            </div>
          )}
          {subteams.size > 0 && (
            <div>
              <h3 className="section-title">Subteams</h3>
              <div className="subteams">
                {subteams.map(subteam => (
                  <div key={subteam.slug} className="subteam">
                    <Link to={`/teams/${subteam.slug}`}>{subteam.name}</Link>
                    {subteam.description && <p>{subteam.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {services.length > 0 && (
            <div>
              <h3 className="section-title">Services</h3>
              <div className="services s-cards-wrapper">
                {services.map(service => (
                  <ServiceCard
                    key={service.slug}
                    path={`/services/${service.slug}`}
                    form={service}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {userIsMember &&
          discussionId && (
            <div className="team-sidebar hidden-sm-down">
              <KinopsDiscussion
                discussionId={discussionId}
                isMobileModal
                renderClose={() => (
                  <Link to={`/`} className="btn btn-link">
                    Close
                  </Link>
                )}
              />
            </div>
          )}
      </div>
    )}
  </div>
);
