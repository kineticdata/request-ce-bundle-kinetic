import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import {
  KappLink as Link,
  PageTitle,
  selectCurrentKapp,
  Utils,
  selectHasRoleSchedulerAdmin,
} from 'common';
import { CoreForm } from 'react-kinetic-core';
import {
  actions,
  SCHEDULER_FORM_SLUG,
  TECH_BAR_SETTINGS_FORM_SLUG,
} from '../../redux/modules/techBarApp';
import { I18n } from '../../../../app/src/I18nProvider';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

const getStatusColor = status =>
  status === 'Inactive' ? 'status--red' : 'status--green';

export const TechBarSettingsComponent = ({
  techBar,
  techBars,
  handleSaved,
  isSchedulerAdmin,
  isSchedulerManager,
}) => (
  <Fragment>
    <PageTitle parts={['Tech Bar Settings']} />
    <div className="page-container page-container--tech-bar">
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
            {techBar && (
              <Fragment>
                <Link to="/settings/general">
                  <I18n>tech bars</I18n>
                </Link>{' '}
                /{` `}
              </Fragment>
            )}
          </h3>
          <h1>
            <I18n>{techBar ? techBar.values['Name'] : 'Tech Bars'}</I18n>
          </h1>
        </div>
      </div>
      {techBar ? (
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
      ) : (
        <div className="list-wrapper">
          {techBars.size > 0 && (
            <table className="table table-sm table-striped table-schedulers table--settings">
              <thead className="header">
                <tr>
                  <th scope="col">
                    <I18n>Name</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Status</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Location</I18n>
                  </th>
                </tr>
              </thead>
              <tbody>
                {techBars.map(scheduler => {
                  return (
                    <tr key={scheduler.id}>
                      <td scope="row">
                        <Link to={`/settings/general/${scheduler.id}`}>
                          <I18n>{scheduler.values['Name']}</I18n>
                        </Link>
                      </td>
                      <td>
                        <span
                          className={`status ${getStatusColor(
                            scheduler.values['Status'],
                          )}`}
                        >
                          <I18n>{scheduler.values['Status']}</I18n>
                        </span>
                      </td>
                      <td>
                        <I18n>{scheduler.values['Location']}</I18n>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {techBars.size === 0 && (
            <div className="empty-state">
              <h5>
                <I18n>No Tech Bars Found</I18n>
              </h5>
            </div>
          )}
        </div>
      )}
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => {
  const techBars = selectHasRoleSchedulerAdmin(state)
    ? state.techBar.techBarApp.schedulers
    : state.techBar.techBarApp.schedulers.filter(s =>
        Utils.isMemberOf(
          state.app.profile,
          `Role::Scheduler::${s.values['Name']}`,
        ),
      );
  return {
    kapp: selectCurrentKapp(state),
    techBars,
    techBar: techBars.find(scheduler => scheduler.id === props.techBarId),
  };
};

export const mapDispatchToProps = {
  push,
  fetchAppSettings: actions.fetchAppSettings,
};

export const TechBarSettings = compose(
  withProps(({ match: { params: { id } } }) => ({
    techBarId: id,
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleSaved: ({ push, kapp }) => () =>
      push(`/kapps/${kapp.slug}/settings/general`),
  }),
  lifecycle({
    componentDidMount() {
      // this.props.fetchAppSettings();
    },
  }),
)(TechBarSettingsComponent);
