import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose, withHandlers } from 'recompose';
import {
  Utils,
  ErrorNotFound,
  ErrorUnauthorized,
  selectHasRoleSchedulerAdmin,
} from 'common';
import { PageTitle } from '../../shared/PageTitle';
import { Link } from '@reach/router';
import { CoreForm } from '@kineticdata/react';
import { actions } from '../../../redux/modules/techBarApp';
import { TECH_BAR_SETTINGS_FORM_SLUG } from '../../../constants';
import { I18n } from '@kineticdata/react';

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
        <div className="page-container">
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="../../../../">
                    <I18n>tech bar</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../../../">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../../">
                    <I18n>tech bars</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../">
                    <I18n>{techBar.values['Name']}</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>Edit Settings</I18n>
                </h1>
              </div>
              <Link to={`../`} className="btn btn-secondary">
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
  const isSchedulerAdmin = selectHasRoleSchedulerAdmin(state.app.profile);
  const techBar = state.techBarApp.schedulers.find(
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
    kapp: state.app.kapp,
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
  updateTechBarSettingsSuccess: actions.updateTechBarSettingsSuccess,
};

export const TechBarSettingsForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleSaved: ({
      navigate,
      kapp,
      techBarId,
      updateTechBarSettingsSuccess,
    }) => ({ submission }) => {
      updateTechBarSettingsSuccess({
        techBarId,
        submission,
      });
      navigate(`../`);
    },
  }),
)(TechBarSettingsFormComponent);
