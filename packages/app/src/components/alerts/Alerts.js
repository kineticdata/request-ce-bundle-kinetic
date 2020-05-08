import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import moment from 'moment';
import { AlertRow } from './AlertRow';
import { I18n } from '@kineticdata/react';
import { actions } from '../../redux/modules/alerts';
import { PageTitle } from '../shared/PageTitle';

const WallyEmptyMessage = ({ canEdit }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Alerts Right Now...</I18n>
      </h5>
      {canEdit && (
        <h6>
          <I18n>Add an alert by hitting the new button!</I18n>
        </h6>
      )}
    </div>
  );
};

const AlertsComponent = ({
  alerts,
  spaceAdminAlerts,
  loading,
  match,
  error,
  canEdit,
  id,
}) => {
  const selectedAlert = id;
  return (
    <div className="page-container page-container--space-alerts">
      <PageTitle parts={['Alerts']} />

      {!loading && (
        <div className="page-panel page-panel--space-alerts">
          <div className="page-title">
            <h1>
              <I18n>Alerts</I18n>
            </h1>

            {canEdit && (
              <Link to="/alerts/new" className="btn btn-secondary">
                <I18n>New Alert</I18n>
              </Link>
            )}
          </div>
          {error && (
            <h3>
              <I18n>There was a problem loading the alerts.</I18n>
            </h3>
          )}
          <div className="page-content  page-content--space-alerts">
            {!error &&
              ((canEdit && spaceAdminAlerts.size <= 0) ||
                (!canEdit && alerts.size <= 0)) && (
                <WallyEmptyMessage canEdit={canEdit} />
              )}
            {!error &&
              ((canEdit && spaceAdminAlerts.size > 0) ||
                (!canEdit && alerts.size > 0)) && (
                <table className="table table--alerts">
                  <thead>
                    <tr>
                      <th scope="col">
                        <I18n>Title</I18n>
                      </th>
                      <th scope="col" width="50%">
                        <I18n>Description</I18n>
                      </th>
                      {canEdit && <th width="10%" />}
                    </tr>
                  </thead>
                  <tbody>
                    {canEdit
                      ? spaceAdminAlerts.map(alert => (
                          <AlertRow
                            key={alert.id}
                            alert={alert}
                            active={alert.id === selectedAlert}
                          />
                        ))
                      : alerts.map(alert => (
                          <AlertRow
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
  loading: state.app.loading,
  spaceAdminAlerts: List(state.alerts.data)
    .sortBy(alert =>
      moment(alert.values['Start Date Time'] || alert.createdAt).unix(),
    )
    .reverse(),
  alerts: List(state.alerts.data)
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
  error: state.alerts.error,
  canEdit: state.app.profile.spaceAdmin ? true : false,
});

export const mapDispatchToProps = {
  fetchAlertsRequest: actions.fetchAlertsRequest,
};

export const Alerts = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchAlertsRequest();
    },
  }),
)(AlertsComponent);
