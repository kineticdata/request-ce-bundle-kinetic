import React from 'react';
import { Link, Router } from '@reach/router';
import { connect } from '../../redux/store';
import { compose } from 'recompose';
import { Icon, ErrorUnauthorized } from 'common';
import { I18n } from '@kineticdata/react';
import { SampleSettings } from './SampleSettings';

export const SettingsComponent = ({ kappSlug, hasSettingsAccess }) =>
  hasSettingsAccess ? (
    <Router>
      <SampleSettings path="sample" />
      <SettingsNavigation default />
    </Router>
  ) : (
    <ErrorUnauthorized />
  );

const mapStateToProps = (state, props) => {
  return {
    kappSlug: state.app.kappSlug,
    hasSettingsAccess: state.app.profile.spaceAdmin,
  };
};

const mapDispatchToProps = {};

export const Settings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SettingsComponent);

const SettingsCard = ({ path, icon, name, description }) => (
  <Link to={path} className="card">
    <h1>
      <Icon image={icon || 'fa-sticky-note-o'} background="blueSlate" />
      <I18n>{name}</I18n>
    </h1>
    <p>
      <I18n>{description}</I18n>
    </p>
  </Link>
);

const SettingsNavigationComponent = () => (
  <div className="page-container page-container--no-padding">
    <div className="page-panel">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="../">
              <I18n>survey</I18n>
            </Link>{' '}
            /{` `}
          </h3>
          <h1>
            <I18n>Settings</I18n>
          </h1>
        </div>
      </div>

      <div className="cards__wrapper">
        <SettingsCard
          name="Sample Settings"
          path="sample"
          icon="fa-cog"
          description="Sample settings page."
        />
      </div>
    </div>
  </div>
);

const mapStateToPropsNav = state => ({
  kapp: state.app.kapp,
});

export const SettingsNavigation = compose(connect(mapStateToPropsNav))(
  SettingsNavigationComponent,
);
