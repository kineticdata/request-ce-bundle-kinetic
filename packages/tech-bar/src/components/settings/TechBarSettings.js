import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle } from 'recompose';
import { selectCurrentKapp, Utils, selectHasRoleSchedulerAdmin } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { Link } from '@reach/router';
import { actions } from '../../redux/modules/techBarApp';
import { I18n } from '@kineticdata/react';

const getStatusColor = status =>
  status === 'Inactive' ? 'status--red' : 'status--green';

export const TechBarSettingsComponent = ({ techBars }) => (
  <Fragment>
    <PageTitle parts={['Tech Bar Settings']} />
    <div className="page-container">
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div
            role="navigation"
            aria-label="breadcrumbs"
            className="page-title__breadcrumbs"
          >
            <span className="breadcrumb-item">
              <Link to="../../">
                <I18n>tech bar</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <span className="breadcrumb-item">
              <Link to="../">
                <I18n>settings</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <h1>
              <I18n>Tech Bars</I18n>
            </h1>
          </div>
        </div>
        <div className="list-wrapper">
          {techBars.size > 0 && (
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
                    <I18n>Location</I18n>
                  </th>
                </tr>
              </thead>
              <tbody>
                {techBars.map(scheduler => {
                  return (
                    <tr key={scheduler.id}>
                      <td>
                        <Link to={`${scheduler.id}`}>
                          <I18n>{scheduler.values['Name']}</I18n>
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
                        <I18n>{scheduler.values['Location']}</I18n>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {techBars.size === 0 && (
            <div className="empty-state">
              <h5>
                <I18n>No Tech Bars Found</I18n>
              </h5>
            </div>
          )}
        </div>
      </div>
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => {
  const techBars = selectHasRoleSchedulerAdmin(state.app.profile)
    ? state.techBarApp.schedulers
    : state.techBarApp.schedulers.filter(
        s =>
          Utils.isMemberOf(
            state.app.profile,
            `Role::Scheduler::${s.values['Name']}`,
          ) ||
          Utils.isMemberOf(state.app.profile, `Scheduler::${s.values['Name']}`),
      );
  return {
    kapp: selectCurrentKapp(state),
    techBars,
  };
};

export const mapDispatchToProps = {
  fetchAppDataRequest: actions.fetchAppDataRequest,
};

export const TechBarSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      // this.props.fetchAppDataRequest();
    },
  }),
)(TechBarSettingsComponent);
