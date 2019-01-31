import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from 'common';
import { LoadingMessage, EmptyMessage, ErrorMessage } from './Schedulers';
import { actions } from '../../redux/modules/schedulers';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from '../../redux/selectors';
import { I18n } from '../../../../app/src/I18nProvider';

const getStatusColor = status =>
  status === 'Inactive' ? 'status--red' : 'status--green';

const SchedulersListComponent = ({
  breadcrumbs,
  match,
  schedulers,
  loading,
  errors,
  isSchedulerAdmin,
  isSchedulerManager,
}) => {
  return (
    <div className="page-container page-container--schedulers">
      <PageTitle parts={[' Schedulers', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--schedulers-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>{breadcrumbs}</h3>
            <h1>
              <I18n>Schedulers</I18n>
            </h1>
          </div>
          {isSchedulerAdmin && (
            <Link to={`${match.path}/new`} className="btn btn-primary">
              <I18n>Create Scheduler</I18n>
            </Link>
          )}
        </div>

        <div className="list-wrapper">
          {loading && schedulers.size === 0 && <LoadingMessage />}
          {schedulers.size > 0 && (
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
                    <I18n>Type</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Location</I18n>
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedulers.map(scheduler => {
                  return (
                    <tr key={scheduler.id}>
                      <td scope="row">
                        <Link to={`${match.path}/${scheduler.id}`}>
                          <span>
                            <I18n>{scheduler.values['Name']}</I18n>
                          </span>
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
                        <I18n>{scheduler.values['Type']}</I18n>
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
          {!loading &&
            errors.length === 0 &&
            schedulers.size === 0 && (
              <EmptyMessage
                heading="No Schedulers Found"
                text="Schedulers are used to allow customers to schedule appointments."
              />
            )}
          {!loading &&
            errors.length > 0 && (
              <ErrorMessage
                heading="Failed to retrieve schedulers."
                text={errors.map((e, i) => (
                  <div key={`error-${i}`}>
                    <I18n>{e}</I18n>
                  </div>
                ))}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.common.schedulers.list.loading,
  errors: state.common.schedulers.list.errors,
  schedulers: state.common.schedulers.list.data,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state),
  isSchedulerManager: selectHasRoleSchedulerManager(state),
});

export const mapDispatchToProps = {
  push,
  fetchSchedulers: actions.fetchSchedulers,
};

export const SchedulersList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchSchedulers({
        isSchedulerAdmin: this.props.isSchedulerAdmin,
        type: this.props.type,
      });
    },
  }),
)(SchedulersListComponent);
