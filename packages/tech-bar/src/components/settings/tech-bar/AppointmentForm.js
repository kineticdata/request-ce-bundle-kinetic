import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose } from 'recompose';
import { Utils, ErrorNotFound, selectHasRoleSchedulerAdmin } from 'common';
import { PageTitle } from '../../shared/PageTitle';
import { Link } from '@reach/router';
import { CoreForm, I18n } from '@kineticdata/react';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const AppointmentFormComponent = ({ id, kapp, techBar }) => {
  return techBar ? (
    <Fragment>
      <PageTitle
        parts={[
          'Appointment Details',
          techBar.values['Name'],
          'Tech Bar Settings',
        ]}
      />
      <div className="page-container">
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div
              role="navigation"
              aria-label="breadcrumbs"
              className="page-title__breadcrumbs"
            >
              <span className="breadcrumb-item">
                <Link to="../../../../../">
                  <I18n>tech bar</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <span className="breadcrumb-item">
                <Link to="../../../../">
                  <I18n>settings</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <span className="breadcrumb-item">
                <Link to="../../../">
                  <I18n>tech bars</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <span className="breadcrumb-item">
                <Link to={`../../`}>
                  <I18n>{techBar.values['Name']}</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <h1>
                <I18n>Appointment Details</I18n>
              </h1>
            </div>
          </div>
          <div className="content-wrapper">
            <I18n context={`kapps.${kapp.slug}.forms.appointment`}>
              <CoreForm submission={id} review={true} globals={globals} />
            </I18n>
          </div>
        </div>
      </div>
    </Fragment>
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
  };
};

export const AppointmentForm = compose(connect(mapStateToProps))(
  AppointmentFormComponent,
);
