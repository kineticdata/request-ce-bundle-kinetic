import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose, withHandlers, withProps } from 'recompose';
import { CoreForm, I18n } from '@kineticdata/react';
import { Link } from '@reach/router';
import { ErrorNotFound, ErrorUnauthorized, ErrorUnexpected } from 'common';
import { PageTitle } from './shared/PageTitle';
import { APPOINTMENT_FORM_SLUG } from '../constants';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const AppointmentFormComponent = ({
  techBarId,
  id,
  techBar,
  past,
  relativeHomePath,
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
                <Link to={relativeHomePath}>
                  <I18n>tech bar</I18n>
                </Link>{' '}
                /{' '}
                {past && (
                  <Fragment>
                    <Link to={`${relativeHomePath}/past`}>
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
  console.log('handleCompleted', response.submission.id);
  if (!response.submission.currentPage) {
    props.navigate(`/kapps/${props.kappSlug}`);
  }
};

export const handleCreated = props => response => {
  console.log('handleCreated', response.submission.id);
  props.navigate(
    response.submission.coreState === 'Submitted'
      ? `/kapps/${props.kappSlug}`
      : response.submission.id,
  );
};

export const mapStateToProps = (state, props) => {
  const past = !!props.path.match(/^\/kapps/);
  const relativeHomePath = `../${props.techBarId ? '../' : ''}${
    props.id ? '../' : ''
  }${past ? '../' : ''}`;
  return {
    kappSlug: state.app.kappSlug,
    techBar: state.techBarApp.schedulers.find(
      scheduler => scheduler.values['Id'] === props.techBarId,
    ),
    past,
    relativeHomePath,
  };
};

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({ handleCompleted, handleCreated }),
);

export const AppointmentForm = enhance(AppointmentFormComponent);
