import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getTeamColor, getTeamIcon } from '../../utils';
import { Discussion as KinopsDiscussion } from 'discussions';
import { PageTitle, Hoverable } from 'common';
import { ServiceCard } from '../shared/ServiceCard';
import { TeamMemberAvatar } from './TeamMemberAvatar';
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
  <div className="page-container page-container--panels page-container--space-team">
    <PageTitle parts={[team && team.name, 'Teams']} />
    {!loading && (
      <Fragment>
        <div
          className={`page-panel page-panel--three-fifths page-panel--scrollable page-panel--space-team ${userIsMember &&
            'page-panel--scrollable'}`}
        >
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> / <Link to="/teams">teams</Link> /
              </h3>
              <h1>Team Profile</h1>
            </div>
            {me.spaceAdmin && (
              <Link
                to={`/settings/teams/${team.slug}/edit`}
                className="btn btn-secondary"
              >
                Edit Team
              </Link>
            )}
          </div>
          {userIsMember &&
            discussionId && (
              <button
                onClick={openDiscussion}
                className="btn btn-primary btn-inverse btn-discussion d-md-none d-lg-none d-xl-none"
              >
                <span className="fa fa-comments fa-fw icon" />
                View Discussion
              </button>
            )}
          <div className="card card--team">
            <div
              className="card--team__header"
              style={{ backgroundColor: getTeamColor(team) }}
            >
              <span />
              <i className={`fa fa-${getTeamIcon(team)} card-icon`} />
              <span />
            </div>
            <div className="card--team__body">
              <h1>{team.name}</h1>

              {team.description && <pre>{team.description}</pre>}

              {userIsMember ? (
                <button
                  onClick={openRequestToLeaveForm}
                  className="btn btn-primary btn-sm"
                >
                  Request to Leave
                </button>
              ) : (
                <button
                  onClick={openRequestToJoinForm}
                  className="btn btn-primary btn-sm"
                >
                  Request to Join
                </button>
              )}
            </div>
            <div className="card--team__footer">
              <h1>Members</h1>
              <div className="card--team__footer__members">
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

          {parent && (
            <section>
              <h3 className="section__title">Parent Team</h3>
              <div className="parent">
                <Link to={`/teams/${parent.slug}`}>{parent.name}</Link>
                {parent.description && <p>{parent.description}</p>}
              </div>
            </section>
          )}
          {subteams.size > 0 && (
            <section>
              <h3 className="section__title">Subteams</h3>
              <div className="subteams">
                {subteams.map(subteam => (
                  <div key={subteam.slug} className="subteam">
                    <Link to={`/teams/${subteam.slug}`}>{subteam.name}</Link>
                    {subteam.description && <p>{subteam.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {services.length > 0 && (
            <section>
              <h3 className="section__title">Services</h3>
              <div className="cards__wrapper cards__wrapper--services">
                {services.map(service => (
                  <ServiceCard
                    key={service.slug}
                    path={`/kapps/services/forms/${service.slug}`}
                    form={service}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
        {userIsMember &&
          discussionId && (
            <KinopsDiscussion
              discussionId={discussionId}
              isMobileModal
              renderClose={() => (
                <Link to={`/`} className="btn btn-link">
                  Close
                </Link>
              )}
            />
          )}
      </Fragment>
    )}
  </div>
);
