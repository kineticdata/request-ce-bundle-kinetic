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
            <h1>Schedulers</h1>
          </div>
          {isSchedulerAdmin && (
            <Link to={`${match.path}/new`} className="btn btn-primary">
              Create Scheduler
            </Link>
          )}
        </div>

        <div className="list-wrapper">
          {loading && schedulers.size === 0 && <LoadingMessage />}
          {schedulers.size > 0 && (
            <table className="table table-sm table-striped table-schedulers settings-table">
              <thead className="header">
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {schedulers.map(scheduler => {
                  return (
                    <tr key={scheduler.id}>
                      <td>
                        <Link to={`${match.path}/${scheduler.id}`}>
                          <span>{scheduler.values['Name']}</span>
                        </Link>
                      </td>
                      <td>
                        <span
                          className={`status ${getStatusColor(
                            scheduler.values['Status'],
                          )}`}
                        >
                          {scheduler.values['Status']}
                        </span>
                      </td>
                      <td>{scheduler.values['Type']}</td>
                      <td>{scheduler.values['Location']}</td>
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
                text={errors.map(e => <div>{e}</div>)}
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
      });
    },
  }),
)(SchedulersListComponent);
