import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withProps } from 'recompose';
import {
  KappLink as Link,
  PageTitle,
  selectCurrentKapp,
  Utils,
  ErrorNotFound,
  ErrorUnauthorized,
  selectHasRoleSchedulerAdmin,
} from 'common';
import { CoreForm } from 'react-kinetic-core';
import {
  actions,
  TECH_BAR_SETTINGS_FORM_SLUG,
} from '../../../redux/modules/techBarApp';
import { I18n } from '../../../../../app/src/I18nProvider';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const TechBarSettingsFormComponent = ({
  techBar,
  handleSaved,
  hasManagerAccess,
}) => {
  return techBar ? (
    hasManagerAccess ? (
      <Fragment>
        <PageTitle
          parts={['Edit Settings', techBar.values['Name'], 'Tech Bar Settings']}
        />
        <div className="page-container page-container--tech-bar-settings">
          <div className="page-panel page-panel--scrollable">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="/">
                    <I18n>tech bar</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="/settings">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="/settings/general">
                    <I18n>tech bars</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to={`/settings/general/${techBar.id}`}>
                    <I18n>{techBar.values['Name']}</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>Edit Settings</I18n>
                </h1>
              </div>
              <Link
                to={`/settings/general/${techBar.id}`}
                className="btn btn-secondary"
              >
                <I18n>Cancel Edit</I18n>
              </Link>
            </div>
            <div className="content-wrapper">
              <I18n context={`datastore.forms.${TECH_BAR_SETTINGS_FORM_SLUG}`}>
                {techBar.settings.submissionId ? (
                  <CoreForm
                    datastore
                    submission={techBar.settings.submissionId}
                    globals={globals}
                    created={handleSaved}
                    updated={handleSaved}
                  />
                ) : (
                  <CoreForm
                    datastore
                    form={TECH_BAR_SETTINGS_FORM_SLUG}
                    globals={globals}
                    created={handleSaved}
                    updated={handleSaved}
                    values={{ 'Scheduler Id': techBar.values['Id'] }}
                  />
                )}
              </I18n>
            </div>
          </div>
        </div>
      </Fragment>
    ) : (
      <ErrorUnauthorized />
    )
  ) : (
    <ErrorNotFound />
  );
};

export const mapStateToProps = (state, props) => {
  const isSchedulerAdmin = selectHasRoleSchedulerAdmin(state);
  const techBar = state.techBar.techBarApp.schedulers.find(
    scheduler =>
      scheduler.id === props.techBarId &&
      (isSchedulerAdmin ||
        Utils.isMemberOf(
          state.app.profile,
          `Role::Scheduler::${scheduler.values['Name']}`,
        ) ||
        Utils.isMemberOf(
          state.app.profile,
          `Scheduler::${scheduler.values['Name']}`,
        )),
  );
  return {
    kapp: selectCurrentKapp(state),
    techBar,
    hasManagerAccess:
      isSchedulerAdmin ||
      (techBar &&
        Utils.isMemberOf(
          state.app.profile,
          `Role::Scheduler::${techBar.values['Name']}`,
        )),
  };
};

export const mapDispatchToProps = {
  push,
  updateTechBarSettings: actions.updateTechBarSettings,
};

export const TechBarSettingsForm = compose(
  withProps(({ match: { params: { id } } }) => ({
    techBarId: id,
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleSaved: ({ push, kapp, techBarId, updateTechBarSettings }) => ({
      submission,
    }) => {
      updateTechBarSettings({
        techBarId,
        submission,
      });
      push(`/kapps/${kapp.slug}/settings/general/${techBarId}`);
    },
  }),
)(TechBarSettingsFormComponent);
