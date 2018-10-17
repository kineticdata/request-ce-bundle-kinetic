import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { commonActions, PageTitle } from 'common';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import moment from 'moment';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { Alert } from './Alert';

const WallyEmptyMessage = ({ canEdit }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Alerts Right Now...</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      {canEdit && <h6>Add an alert by hitting the new button!</h6>}
    </div>
  );
};

const AlertsComponent = ({ alerts, loading, match, error, canEdit }) => {
  const selectedAlert = match.params.id;
  return (
    <div className="page-container page-container--space-alerts">
      <PageTitle parts={['Alerts']} />

      {!loading && (
        <div className="page-panel page-panel--space-alerts">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> /
              </h3>
              <h1>Alerts</h1>
            </div>
            {canEdit && (
              <Link to="/alerts/new" className="btn btn-secondary">
                New Alert
              </Link>
            )}
          </div>
          {error && <h3>There was a problem loading the alerts.</h3>}
          <div className="page-content  page-content--space-alerts">
            {!error &&
              alerts.size <= 0 && <WallyEmptyMessage canEdit={canEdit} />}
            {!error &&
              alerts.size > 0 && (
                <table className="table table--alerts">
                  <thead>
                    <tr>
                      <th width="25%">Title</th>
                      <th width="65%">Description</th>
                      {canEdit && <th width="10%">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map(alert => (
                      <Alert
                        key={alert.id}
                        alert={alert}
                        active={alert.id === selectedAlert}
                      />
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.app.alerts.loading,
  alerts: List(state.app.alerts.get('data'))
    .filter(
      alert =>
        !alert.values['End Date Time'] ||
        moment(alert.values['End Date Time']).isAfter(),
    )
    .filter(
      alert =>
        !alert.values['Start Date Time'] ||
        moment(alert.values['Start Date Time']).isBefore(),
    )
    .sortBy(alert =>
      moment(alert.values['Start Date Time'] || alert.createdAt).unix(),
    )
    .reverse(),
  error: state.app.alerts.error,
  canEdit: state.app.profile.spaceAdmin ? true : false,
});

export const mapDispatchToProps = {
  fetchAlerts: commonActions.fetchAlerts,
};

export const Alerts = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchAlerts();
    },
  }),
)(AlertsComponent);
