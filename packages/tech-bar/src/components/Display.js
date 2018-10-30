import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withProps } from 'recompose';
import { PageTitle, selectCurrentKapp, ErrorNotFound } from 'common';
import { CheckIn } from './CheckIn';
import { Feedback } from './Feedback';

export const DisplayComponent = ({ kapp, techBar, displayMode }) => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container page-container--tech-bar-display">
      {techBar && (
        <Fragment>
          <div className="home-title text-center mb-4">
            {techBar.values['Name']}
          </div>
          {displayMode === 'checkin' && <CheckIn techBar={techBar} />}
          {displayMode === 'feedback' && <Feedback techBar={techBar} />}
        </Fragment>
      )}
      {!techBar && <ErrorNotFound />}
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
  techBar: state.techBar.techBarApp.schedulers.find(
    scheduler => scheduler.values['Id'] === props.techBarId,
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
