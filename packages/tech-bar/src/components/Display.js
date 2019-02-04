import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withProps } from 'recompose';
import {
  PageTitle,
  selectCurrentKapp,
  ErrorNotFound,
  ErrorUnauthorized,
  Utils,
  KappLink as Link,
} from 'common';
import { CheckIn } from './CheckIn';
import { Feedback } from './Feedback';
import { Overhead } from './Overhead';
import { I18n } from '../../../app/src/I18nProvider';

export const DisplayTabs = ({
  techBarId,
  checkInClassName = '',
  feedbackClassName = '',
  onClick,
}) => (
  <div className="display-tabs">
    <Link
      to={`/display/${techBarId}/checkin?crosslink`}
      className={`display-tab-link ${checkInClassName}`}
      onClick={onClick}
    >
      <span>
        <I18n>Check In</I18n>
      </span>
    </Link>
    <Link
      to={`/display/${techBarId}/feedback?crosslink`}
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
  location: { search },
  kapp,
  techBar,
  displayMode,
  hasTechBarDisplayRole,
}) => {
  return !hasTechBarDisplayRole ? (
    <ErrorUnauthorized />
  ) : (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container page-container--tech-bar page-container--display">
        {techBar && (
          <Fragment>
            <div className="location-title">
              <span className="fa fa-fw fa-map-marker" />
              <I18n>{techBar.values['Name']}</I18n>
            </div>
            {displayMode === 'checkin' && (
              <CheckIn
                techBar={techBar}
                crosslink={search.includes('crosslink')}
              />
            )}
            {displayMode === 'feedback' && (
              <Feedback
                techBar={techBar}
                crosslink={search.includes('crosslink')}
              />
            )}
            {displayMode === 'overhead' && <Overhead techBar={techBar} />}
          </Fragment>
        )}
        {!techBar && <ErrorNotFound />}
      </div>
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => {
  const techBar = state.techBar.techBarApp.schedulers.find(
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

export const mapDispatchToProps = {
  push,
};

export const Display = compose(
  withProps(({ match: { params: { id, mode } } }) => ({
    techBarId: id,
    displayMode: ['checkin', 'feedback', 'overhead'].includes(mode)
      ? mode
      : 'checkin',
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DisplayComponent);
