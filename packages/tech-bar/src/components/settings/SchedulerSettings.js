import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withProps } from 'recompose';
import { KappLink as Link, selectCurrentKapp, Utils, Schedulers } from 'common';
import { actions } from '../../redux/modules/techBarApp';
import { I18n } from '../../../../app/src/I18nProvider';

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
  fetchAppSettings: actions.fetchAppSettings,
};

export const SchedulerSettings = compose(
  withProps(({ match: { params: { id } } }) => ({
    techBarId: id,
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillUnmount() {
      // this.props.fetchAppSettings();
    },
  }),
)(SchedulerSettingsComponent);
