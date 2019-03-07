import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle } from 'recompose';
import {
  KappLink as Link,
  PageTitle,
  selectCurrentKapp,
  Moment,
  Constants,
} from 'common';
import { actions } from '../redux/modules/appointments';
import moment from 'moment';
import { I18n } from '../../../app/src/I18nProvider';
import { DATE_FORMAT, TIME_FORMAT } from '../App';

export const PastComponent = ({
  kapp,
  techBars,
  loadingPast,
  pastErrors,
  pastAppointments,
}) => (
  <Fragment>
    <PageTitle parts={['Past Appointments']} />
    <div className="page-container page-container--tech-bar">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">
              <I18n>tech bar</I18n>
            </Link>{' '}
            /{' '}
          </h3>
          <h1>
            <I18n>Past Appointments</I18n>
          </h1>
        </div>
      </div>
      <section className="mb-4">
        <div className="cards__wrapper cards__wrapper--appt">
          {pastAppointments.map(appt => {
            const techBar = techBars.find(
              t => t.values['Id'] === appt.values['Scheduler Id'],
            );
            const date = moment.utc(appt.values['Event Date'], DATE_FORMAT);
            const start = moment.utc(appt.values['Event Time'], TIME_FORMAT);
            const end = start
              .clone()
              .add(appt.values['Event Duration'], 'minute');
            return (
              <div className="card card--appt" key={appt.id}>
                <i
                  className="fa fa-calendar fa-fw card-icon"
                  style={{ background: 'rgb(255, 74, 94)' }}
                />
                <div className="card-body">
                  <h1 className="card-title">
                    <Moment
                      timestamp={date}
                      format={Constants.MOMENT_FORMATS.dateWithDay}
                    />
                    <span
                      className={`badge ${
                        appt.coreState === 'Closed'
                          ? 'badge-dark'
                          : 'badge-success'
                      }`}
                    >
                      <I18n>{appt.values['Status']}</I18n>
                    </span>
                  </h1>
                  <p className="card-subtitle">
                    <Moment
                      timestamp={start}
                      format={Constants.MOMENT_FORMATS.time}
                    />
                    {` - `}
                    <Moment
                      timestamp={end}
                      format={Constants.MOMENT_FORMATS.time}
                    />
                  </p>
                  <p className="card-text">
                    {techBar && (
                      <I18n
                        render={translate => (
                          <strong>{`${translate(
                            techBar.values['Name'],
                          )}: `}</strong>
                        )}
                      />
                    )}
                    {appt.values['Summary']}
                  </p>
                  <Link
                    to={`/past/forms/appointment/${appt.id}`}
                    className="btn btn-link text-left pl-0"
                  >
                    <I18n>View Details</I18n> →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {pastAppointments.size === 0 &&
          !loadingPast &&
          pastErrors.length === 0 && (
            <h6 className="text-muted">
              <em>
                <I18n>You do not have any past appointments.</I18n>
              </em>
            </h6>
          )}
      </section>
    </div>
  </Fragment>
);

export const mapStateToProps = state => ({
  kapp: selectCurrentKapp(state),
  techBars: state.techBar.techBarApp.schedulers.filter(
    s => s.values['Status'] === 'Active',
  ),
  loadingPast: state.techBar.appointments.past.loading,
  pastErrors: state.techBar.appointments.past.errors,
  pastAppointments: state.techBar.appointments.past.data,
  profile: state.app.profile,
});

export const mapDispatchToProps = {
  push,
  fetchPastAppointments: actions.fetchPastAppointments,
};

export const Past = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchPastAppointments();
    },
  }),
)(PastComponent);
