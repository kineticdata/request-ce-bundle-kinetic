import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { I18n } from '@kineticdata/react';
import { actions } from '../../redux/modules/alerts';

const AlertsDropdownComponent = ({
  alerts,
  error,
  fetchAlertsRequest,
  isSpaceAdmin,
  isOpen,
  toggle,
}) => (
  <Dropdown isOpen={isOpen} toggle={toggle}>
    <DropdownToggle nav role="button" aria-label="Alerts">
      <span className="fa fa-fw fa-bell" alt="Alerts" />
      {alerts &&
        alerts.size > 0 && (
          <span className="badge badge-secondary">{alerts.size}</span>
        )}
      {error && <span className="badge badge-secondary">!</span>}
    </DropdownToggle>
    <DropdownMenu right className="alerts-menu">
      <div className="alerts-header">
        <span className="title">
          <I18n>Alerts</I18n>
        </span>
        <div className="actions">
          <button className="btn btn-link" onClick={fetchAlertsRequest}>
            <I18n>Refresh</I18n>
          </button>
          <span className="divider">&bull;</span>
          <Link to="/alerts" onClick={toggle} role="menuitem">
            <I18n>View All</I18n>
          </Link>
          {isSpaceAdmin && (
            <Fragment>
              <span className="divider">&bull;</span>
              <Link to="/alerts/new" onClick={toggle} role="menuitem">
                <I18n>New Alert</I18n>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
      <div className="alerts-list">
        {error && (
          <span className="empty-alerts">
            <I18n>There was an error fetching alerts.</I18n>
          </span>
        )}
        {alerts &&
          alerts.map(alert => (
            <div key={alert.id} className="alert-item" role="none">
              <h1 className="alert-item__title">
                <Link to={`/alerts/${alert.id}`} role="menuitem">
                  <small className="source">
                    <I18n>{alert.values.Source}</I18n>
                  </small>
                  <I18n>{alert.values.Title}</I18n>
                </Link>
              </h1>
              <I18n
                render={translate => (
                  <p
                    className="alert-item__content"
                    dangerouslySetInnerHTML={{
                      __html: translate(alert.values.Content),
                    }}
                  />
                )}
              />
              <span className="meta">{alert.values.CreatedAt}</span>
            </div>
          ))}
        {alerts &&
          alerts.size < 1 && (
            <span className="empty-alerts">
              <I18n>There are no active alerts.</I18n>
            </span>
          )}
      </div>
    </DropdownMenu>
  </Dropdown>
);

export const mapStateToProps = state => ({
  alerts: state.alerts.data,
  error: state.alerts.error,
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

const mapDispatchToProps = {
  fetchAlertsRequest: actions.fetchAlertsRequest,
};

export const AlertsDropdown = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    toggle: props => () => props.setIsOpen(open => !open),
  }),
)(AlertsDropdownComponent);
