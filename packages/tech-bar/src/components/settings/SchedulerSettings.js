import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle } from 'recompose';
import { Link } from '@reach/router';
import { selectCurrentKapp, Schedulers } from 'common';
import { actions } from '../../redux/modules/techBarApp';
import { I18n } from '@kineticdata/react';

export const SchedulerSettingsComponent = props => (
  <Schedulers
    {...props}
    type="TechBar"
    breadcrumbs={
      <Fragment>
        <Link to="">
          <I18n>tech bar</I18n>
        </Link>{' '}
        /{' '}
        <Link to="settings">
          <I18n>settings</I18n>
        </Link>{' '}
        /{` `}
      </Fragment>
    }
  />
);

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
});

export const mapDispatchToProps = {
  fetchAppSettings: actions.fetchAppSettings,
};

export const SchedulerSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillUnmount() {
      this.props.fetchAppSettings(true);
    },
  }),
)(SchedulerSettingsComponent);
