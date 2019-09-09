import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from '../../redux/store';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from 'common';
import { StateListWrapper } from '../StateMessages';
import { actions } from '../../redux/modules/schedulers';
import { selectHasRoleSchedulerAdmin } from '../../redux/selectors';
import { I18n } from '@kineticdata/react';

const getStatusColor = status =>
  status === 'Inactive' ? 'status--red' : 'status--green';

const SchedulersListComponent = ({
  pathPrefix = '',
  breadcrumbs = [],
  schedulers,
  error,
  isSchedulerAdmin,
}) => {
  return (
    <div className="page-container">
      <PageTitle parts={[' Schedulers', 'Settings']} />
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              {breadcrumbs.map(breadcrumb => (
                <Fragment key={breadcrumb.label}>
                  <Link to={breadcrumb.path}>
                    <I18n>{breadcrumb.label}</I18n>
                  </Link>{' '}
                  /{` `}
                </Fragment>
              ))}
            </h3>
            <h1>
              <I18n>Schedulers</I18n>
            </h1>
          </div>
          {isSchedulerAdmin && (
            <Link to={`${pathPrefix}/new`} className="btn btn-primary">
              <I18n>Create Scheduler</I18n>
            </Link>
          )}
        </div>

        <div className="list-wrapper">
          <StateListWrapper
            error={error}
            data={schedulers}
            emptyTitle="No schedulers found"
            emptyMessage="Schedulers are used to allow customers to schedule appointments"
            errorTitle="Failed to retrieve schedulers"
            errorMessage={true}
          >
            {data =>
              schedulers.size > 0 && (
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
                          <td>
                            <Link to={`${pathPrefix}/${scheduler.id}`}>
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
              )
            }
          </StateListWrapper>
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = (state, props) => ({
  error: state.schedulers.list.error,
  schedulers: state.schedulers.list.data,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(props.profile),
});

export const mapDispatchToProps = {
  fetchSchedulers: actions.fetchSchedulersRequest,
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
