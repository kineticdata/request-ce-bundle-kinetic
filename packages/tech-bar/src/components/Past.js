import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose, lifecycle } from 'recompose';
import { Constants, StateListWrapper } from 'common';
import { PageTitle } from './shared/PageTitle';
import { Link } from '@reach/router';
import { actions } from '../redux/modules/appointments';
import moment from 'moment';
import { I18n, Moment } from '@kineticdata/react';
import { DATE_FORMAT, TIME_FORMAT } from '../constants';

export const PastComponent = ({ techBars, error, pastAppointments }) => (
  <Fragment>
    <PageTitle parts={['Past Appointments']} />
    <div className="page-container page-container--tech-bar container">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../">
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
          <StateListWrapper
            data={pastAppointments}
            error={error}
            emptyTitle="You have no past appointments."
            emptyMessage="Your completed and cancelled appointments will appear here."
          >
            {data => (
              <div className="cards__wrapper">
                {data.map(appt => {
                  const techBar = techBars.find(
                    t => t.values['Id'] === appt.values['Scheduler Id'],
                  );
                  const date = moment.utc(
                    appt.values['Event Date'],
                    DATE_FORMAT,
                  );
                  const start = moment.utc(
                    appt.values['Event Time'],
                    TIME_FORMAT,
                  );
                  const end = start
                    .clone()
                    .add(appt.values['Event Duration'], 'minute');
                  return (
                    <Link
                      to={`appointment/${appt.values['Scheduler Id']}/${
                        appt.id
                      }`}
                      className="card card--appt"
                      key={appt.id}
                    >
                      <i
                        className="fa fa-calendar fa-fw card-icon"
                        style={{ background: 'rgb(255, 74, 94)' }}
                      />
                      <div className="card-body">
                        <span className="card-title">
                          <Moment
                            timestamp={date}
                            format={Constants.MOMENT_FORMATS.dateWithDay}
                          />
                        </span>
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
                        {techBar && (
                          <span className="card-meta">
                            <strong>
                              <I18n>{techBar.values['Name']}</I18n>
                            </strong>
                          </span>
                        )}
                        <span
                          className={`badge ${
                            appt.coreState === 'Closed'
                              ? 'badge-dark'
                              : 'badge-success'
                          }`}
                        >
                          <I18n>{appt.values['Status']}</I18n>
                        </span>
                        <p className="card-text">{appt.values['Summary']}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </StateListWrapper>
        </section>
      </div>
    </div>
  </Fragment>
);

export const mapStateToProps = state => ({
  techBars: state.techBarApp.schedulers.filter(
    s => s.values['Status'] === 'Active',
  ),
  error: state.appointments.error,
  pastAppointments: state.appointments.past,
});

export const mapDispatchToProps = {
  fetchPastAppointmentsRequest: actions.fetchPastAppointmentsRequest,
};

export const Past = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchPastAppointmentsRequest();
    },
  }),
)(PastComponent);
