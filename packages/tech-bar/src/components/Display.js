import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose } from 'recompose';
import {
  selectCurrentKapp,
  ErrorNotFound,
  ErrorUnauthorized,
  Utils,
} from 'common';
import { PageTitle } from './shared/PageTitle';
import { Link } from '@reach/router';
import { CheckIn } from './CheckIn';
import { Feedback } from './Feedback';
import { Overhead } from './Overhead';
import { I18n } from '@kineticdata/react';

export const DisplayTabs = ({
  techBarId,
  checkInClassName = '',
  feedbackClassName = '',
  onClick,
}) => (
  <div className="display-tabs">
    <Link
      to={`../checkin?crosslink`}
      replace
      className={`display-tab-link ${checkInClassName}`}
      onClick={onClick}
    >
      <span>
        <I18n>Check In</I18n>
      </span>
    </Link>
    <Link
      to={`../feedback?crosslink`}
      replace
      className={`display-tab-link ${feedbackClassName}`}
      onClick={onClick}
    >
      <span>
        <I18n>Feedback</I18n>
      </span>
    </Link>
  </div>
);

export const DisplayComponent = ({
  navigate,
  location: { search, pathname },
  kapp,
  techBar,
  mode,
  hasTechBarDisplayRole,
}) => {
  return !hasTechBarDisplayRole ? (
    <ErrorUnauthorized />
  ) : (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        <div className="page-panel page-panel--display">
          {techBar && (
            <Fragment>
              <div className="location-title">
                <span className="fa fa-fw fa-map-marker" />
                <I18n>{techBar.values['Name']}</I18n>
              </div>
              {mode ? (
                <Fragment>
                  {mode === 'checkin' && (
                    <CheckIn
                      techBar={techBar}
                      crosslink={
                        search.includes('crosslink') ||
                        pathname.includes('crosslink')
                      }
                    />
                  )}
                  {mode === 'feedback' && (
                    <Feedback
                      techBar={techBar}
                      crosslink={
                        search.includes('crosslink') ||
                        pathname.includes('crosslink')
                      }
                    />
                  )}
                  {mode === 'overhead' && <Overhead techBar={techBar} />}
                </Fragment>
              ) : (
                <section className="tech-bar-display tech-bar-display--checkin">
                  <div className="full-screen-container">
                    <div className="header bg-dark" />
                    <div className="body">
                      <div className="row">
                        <div className="col-3">
                          <button
                            className="btn btn-outline-dark btn-block"
                            onClick={() =>
                              navigate('checkin', { replace: true })
                            }
                          >
                            <I18n>Check In</I18n>
                          </button>
                        </div>
                        <div className="col-3">
                          <button
                            className="btn btn-outline-dark btn-block"
                            onClick={() =>
                              navigate('feedback', { replace: true })
                            }
                          >
                            <I18n>Feedback</I18n>
                          </button>
                        </div>
                        <div className="col-3">
                          <button
                            className="btn btn-outline-dark btn-block"
                            onClick={() =>
                              navigate('checkin?crosslink', { replace: true })
                            }
                          >
                            <I18n>Check In</I18n> / <I18n>Feedback</I18n>
                          </button>
                        </div>
                        <div className="col-3">
                          <button
                            className="btn btn-outline-dark btn-block"
                            onClick={() =>
                              navigate('overhead', { replace: true })
                            }
                          >
                            <I18n>Overhead</I18n>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </Fragment>
          )}
          {!techBar && <ErrorNotFound />}
        </div>
      </div>
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => {
  const techBar = state.techBarApp.schedulers.find(
    scheduler => scheduler.values['Id'] === props.techBarId,
  );
  return {
    kapp: selectCurrentKapp(state),
    techBar,
    hasTechBarDisplayRole:
      techBar &&
      Utils.isMemberOf(
        state.app.profile,
        `Role::Tech Bar Display::${techBar.values['Name']}`,
      ),
  };
};

export const Display = compose(connect(mapStateToProps))(DisplayComponent);
