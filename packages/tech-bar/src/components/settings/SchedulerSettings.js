import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withProps } from 'recompose';
import { Link } from '@reach/router';
import { selectCurrentKapp, Utils, Schedulers } from 'common';
import { actions } from '../../redux/modules/techBarApp';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

export const SchedulerSettingsComponent = props => (
  <Schedulers
    {...props}
    type="TechBar"
    breadcrumbs={
      <Fragment>
        <Link to="/">
          <I18n>tech bar</I18n>
        </Link>{' '}
        /{' '}
        <Link to="/settings">
          <I18n>settings</I18n>
        </Link>{' '}
        /{` `}
      </Fragment>
    }
  />
);

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
  techBar: state.techBarApp.schedulers.find(
    scheduler => scheduler.values['Id'] === props.techBarId,
  ),
});

export const mapDispatchToProps = {
  push,
  fetchAppSettings: actions.fetchAppSettings,
};

export const SchedulerSettings = compose(
  withProps(({ match: { params: { id } } }) => ({
    techBarId: id,
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillUnmount() {
      this.props.fetchAppSettings(true);
    },
  }),
)(SchedulerSettingsComponent);
