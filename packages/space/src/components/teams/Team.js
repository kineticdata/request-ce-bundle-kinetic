import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getTeamColor, getTeamIcon } from '../../utils';
import {
  Discussion as KinopsDiscussion,
  ViewDiscussionsModal,
  DiscussionsList,
} from 'discussions';
import { PageTitle, Hoverable } from 'common';
import { ServiceCard } from '../shared/ServiceCard';
import { TeamMemberAvatar } from './TeamMemberAvatar';
import { ProfileCard } from '../shared/ProfileCard';

export const Team = ({
  loading,
  currentDiscussion,
  handleDiscussionClick,
  openDiscussion,
  clearDiscussion,
  openDiscussions,
  closeDiscussions,
  viewDiscussionsModal,
  isSmallLayout,
  handleCreateDiscussion,
  relatedDiscussions,
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
                to={`/teams/${team.slug}/edit`}
                className="btn btn-secondary"
              >
                Team
              </Link>
            )}
          </div>
          {userIsMember && (
            <button
              onClick={openDiscussions}
              className="btn btn-primary btn-inverse btn-discussion d-md-none d-lg-none d-xl-none"
            >
              <span className="fa fa-comments fa-fw icon" />
              View Discussions
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
        {userIsMember && (
          <Fragment>
            {viewDiscussionsModal &&
              isSmallLayout && (
                <ViewDiscussionsModal
                  handleCreateDiscussion={handleCreateDiscussion}
                  handleDiscussionClick={openDiscussion}
                  close={closeDiscussions}
                  discussions={relatedDiscussions}
                  me={me}
                />
              )}
            {currentDiscussion && currentDiscussion.id ? (
              <div className="kinops-discussions d-none d-md-flex">
                <button onClick={clearDiscussion} className="btn btn-inverse">
                  <span className="icon">
                    <span className="fa fa-fw fa-chevron-left" />
                  </span>
                  Back to Discussions
                </button>
                <KinopsDiscussion
                  discussionId={currentDiscussion.id}
                  isMobileModal
                  renderClose={() => null}
                />
              </div>
            ) : relatedDiscussions.size > 0 ? (
              <div className="recent-discussions-wrapper kinops-discussions d-none d-md-flex">
                <DiscussionsList
                  handleCreateDiscussion={handleCreateDiscussion}
                  handleDiscussionClick={handleDiscussionClick}
                  discussions={relatedDiscussions}
                  me={me}
                />
              </div>
            ) : (
              <div className="kinops-discussions d-none d-md-flex empty">
                <div className="empty-discussion">
                  <h5>No discussion to display</h5>
                  <p>
                    <button
                      onClick={handleCreateDiscussion}
                      className="btn btn-link"
                    >
                      Create a new discussion
                    </button>
                  </p>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    )}
  </div>
);
