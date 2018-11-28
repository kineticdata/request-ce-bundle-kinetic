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
} from 'common';
import { CheckIn } from './CheckIn';
import { Feedback } from './Feedback';
import { Overhead } from './Overhead';
import { I18n } from '../../../app/src/I18nProvider';

export const DisplayComponent = ({
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
      <div className="page-container page-container--tech-bar">
        {techBar && (
          <Fragment>
            <div className="home-title text-center mb-4">
              <I18n>{techBar.values['Name']}</I18n>
            </div>
            {displayMode === 'checkin' && <CheckIn techBar={techBar} />}
            {displayMode === 'feedback' && <Feedback techBar={techBar} />}
            {displayMode === 'overhead' && <Overhead techBar={techBar} />}
          </Fragment>
        )}
        {!techBar && <ErrorNotFound />}
      </div>
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
  techBar: state.techBar.techBarApp.schedulers.find(
    scheduler => scheduler.values['Id'] === props.techBarId,
  ),
  hasTechBarDisplayRole: Utils.isMemberOf(
    state.app.profile,
    'Role::Tech Bar Display',
  ),
});

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
