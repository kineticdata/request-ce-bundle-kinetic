import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  withProps,
} from 'recompose';
import { CoreForm } from 'react-kinetic-core';
import {
  KappLink as Link,
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  PageTitle,
} from 'common';
import { I18n } from '../../../app/src/I18nProvider';

const APPOINTMENT_FORM_SLUG = 'appointment';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const AppointmentFormComponent = ({
  match: {
    params: { id },
  },
  techBar,
  isPast,
  match,
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleDelete,
  kappSlug,
}) => (
  <Fragment>
    <PageTitle parts={['Appointment']} />
    <div className="page-container page-container--tech-bar container">
      {techBar ? (
        <Fragment>
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">
                  <I18n>tech bar</I18n>
                </Link>{' '}
                /{' '}
                {isPast && (
                  <Fragment>
                    <Link to="/past">
                      <I18n>past appointments</I18n>
                    </Link>{' '}
                    /{' '}
                  </Fragment>
                )}
              </h3>
              <h1>
                <I18n>{techBar.values['Name']}</I18n>{' '}
                <small>
                  <I18n>Appointment</I18n>
                </small>
              </h1>
            </div>
          </div>
          <I18n context={`kapps.${kappSlug}.forms.${APPOINTMENT_FORM_SLUG}`}>
            <div className="embedded-core-form--wrapper">
              {id ? (
                <CoreForm
                  submission={id}
                  review={true}
                  globals={globals}
                  loaded={handleLoaded}
                  completed={handleCompleted}
                />
              ) : (
                <CoreForm
                  kapp={kappSlug}
                  form={APPOINTMENT_FORM_SLUG}
                  globals={globals}
                  loaded={handleLoaded}
                  created={handleCreated}
                  completed={handleCompleted}
                  values={{ 'Scheduler Id': techBar.values['Id'] }}
                  notFoundComponent={ErrorNotFound}
                  unauthorizedComponent={ErrorUnauthorized}
                  unexpectedErrorComponent={ErrorUnexpected}
                />
              )}
            </div>
          </I18n>
        </Fragment>
      ) : (
        <ErrorNotFound />
      )}
    </div>
  </Fragment>
);

export const handleCompleted = props => response => {
  if (!response.submission.currentPage) {
    props.push(`/kapps/${props.kappSlug}`);
  }
};

export const handleCreated = props => response => {
  props.push(
    response.submission.coreState === 'Submitted'
      ? `/kapps/${props.kappSlug}`
      : `${props.match.url}/submissions/${response.submission.id}`,
  );
};

export const mapStateToProps = (state, { match: { params } }) => {
  return {
    kappSlug: state.app.config.kappSlug,
    techBar: state.techBar.techBarApp.schedulers.find(
      scheduler => scheduler.values['Id'] === params.techBarId,
    ),
  };
};

export const mapDispatchToProps = {
  push,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({ handleCompleted, handleCreated }),
);

export const AppointmentForm = enhance(AppointmentFormComponent);
