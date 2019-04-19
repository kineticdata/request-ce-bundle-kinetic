import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from 'common';
import { Link } from '@reach/router';
import { List } from 'immutable';
import moment from 'moment';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { Alert } from './Alert';
import { I18n } from '../../../../app/src/I18nProvider';
import { context } from '../../redux/store';
import { actions as appActions } from '../../redux/modules/spaceApp';

const WallyEmptyMessage = ({ canEdit }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Alerts Right Now...</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
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
}) => {
  const selectedAlert = match.params.id;
  return (
    <div className="page-container page-container--space-alerts">
      <PageTitle parts={['Alerts']} />

      {!loading && (
        <div className="page-panel page-panel--space-alerts">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">
                  <I18n>home</I18n>
                </Link>{' '}
                /
              </h3>
              <h1>
                <I18n>Alerts</I18n>
              </h1>
            </div>
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
                          <Alert
                            key={alert.id}
                            alert={alert}
                            active={alert.id === selectedAlert}
                          />
                        ))
                      : alerts.map(alert => (
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
  spaceAdminAlerts: List(state.app.alerts.get('data'))
    .sortBy(alert =>
      moment(alert.values['Start Date Time'] || alert.createdAt).unix(),
    )
    .reverse(),
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
  fetchAlerts: appActions.fetchAlerts,
};

export const Alerts = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchAlerts();
    },
  }),
)(AlertsComponent);
