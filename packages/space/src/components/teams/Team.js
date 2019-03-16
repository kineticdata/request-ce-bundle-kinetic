import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getTeamColor, getTeamIcon } from '../../utils';
import {
  Avatar,
  DiscussionsPanel,
  PageTitle,
  ViewDiscussionsModal,
} from 'common';
import { I18n } from '../../../../app/src/I18nProvider';

const CreationForm = ({ onChange, values, errors }) => (
  <div className="form-group">
    <label htmlFor="title">Title</label>
    <input
      id="title"
      name="title"
      type="text"
      value={values.title}
      onChange={onChange}
    />
    {errors.title && (
      <small className="form-text text-danger">{errors.title}</small>
    )}
  </div>
);

export const Team = ({
  loading,
  creationFields,
  openDiscussions,
  closeDiscussions,
  viewDiscussionsModal,
  isSmallLayout,
  parent,
  team,
  subteams,
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
                <Link to="/">
                  <I18n>home</I18n>
                </Link>{' '}
                /{' '}
                <Link to="/teams">
                  <I18n>teams</I18n>
                </Link>{' '}
                /
              </h3>
              <h1>
                <I18n>Team Profile</I18n>
              </h1>
            </div>
            {me.spaceAdmin && (
              <Link
                to={`/settings/teams/${team.slug}/edit`}
                className="btn btn-secondary"
              >
                <I18n>Edit Team</I18n>
              </Link>
            )}
          </div>
          {userIsMember && (
            <button
              onClick={openDiscussions}
              className="btn btn-primary btn-inverse btn-discussion d-md-none d-lg-none d-xl-none"
            >
              <span className="fa fa-comments fa-fw icon" />
              <I18n>View Discussions</I18n>
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
              <h1>
                <I18n>{team.name}</I18n>
              </h1>

              {team.description && (
                <pre>
                  <I18n>{team.description}</I18n>
                </pre>
              )}

              {userIsMember ? (
                <button
                  onClick={openRequestToLeaveForm}
                  className="btn btn-primary btn-sm"
                >
                  <I18n>Request to Leave</I18n>
                </button>
              ) : (
                <button
                  onClick={openRequestToJoinForm}
                  className="btn btn-primary btn-sm"
                >
                  <I18n>Request to Join</I18n>
                </button>
              )}
            </div>
            <div className="card--team__footer">
              <h1>
                <I18n>Members</I18n>
              </h1>
              <div className="card--team__footer__members">
                {memberships.map(user => (
                  <Avatar user={user} key={user.username} />
                ))}
              </div>
            </div>
          </div>

          {parent && (
            <section>
              <h3 className="section__title">
                <I18n>Parent Team</I18n>
              </h3>
              <div className="parent">
                <Link to={`/teams/${parent.slug}`}>
                  <I18n>{parent.name}</I18n>
                </Link>
                {parent.description && (
                  <p>
                    <I18n>{parent.description}</I18n>
                  </p>
                )}
              </div>
            </section>
          )}
          {subteams.size > 0 && (
            <section>
              <h3 className="section__title">
                <I18n>Subteams</I18n>
              </h3>
              <div className="subteams">
                {subteams.map(subteam => (
                  <div key={subteam.slug} className="subteam">
                    <Link to={`/teams/${subteam.slug}`}>
                      <I18n>{subteam.name}</I18n>
                    </Link>
                    {subteam.description && (
                      <p>
                        <I18n>{subteam.description}</I18n>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <Fragment>
          {viewDiscussionsModal &&
            isSmallLayout && (
              <ViewDiscussionsModal
                close={closeDiscussions}
                itemType="Team"
                itemKey={team.slug}
                creationFields={creationFields}
                CreationForm={CreationForm}
                me={me}
              />
            )}
          <DiscussionsPanel
            itemType="Team"
            itemKey={team.slug}
            creationFields={creationFields}
            CreationForm={CreationForm}
            me={me}
          />
        </Fragment>
      </Fragment>
    )}
  </div>
);
