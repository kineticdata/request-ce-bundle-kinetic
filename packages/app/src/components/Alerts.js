import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { I18n } from '../I18nProvider';

export const Alerts = ({
  alerts,
  fetchAlerts,
  isSpaceAdmin,
  isOpen,
  toggle,
}) => (
  <Dropdown isOpen={isOpen} toggle={toggle}>
    <DropdownToggle nav role="button">
      <i className="fa fa-fw fa-bell" />
      {alerts.size > 0 && (
        <span className="badge badge-secondary">{alerts.size}</span>
      )}
    </DropdownToggle>
    <DropdownMenu right className="alerts-menu">
      <div className="alerts-header">
        <span className="title">
          <I18n>Alerts</I18n>
        </span>
        <div className="actions">
          <a role="button" tabIndex="0" onClick={fetchAlerts}>
            <I18n>Refresh</I18n>
          </a>
          <span className="divider">&bull;</span>
          <Link to="/alerts" onClick={toggle}>
            <I18n>View All</I18n>
          </Link>
          {isSpaceAdmin && (
            <Fragment>
              <span className="divider">&bull;</span>
              <Link to="/alerts/new" onClick={toggle}>
                <I18n>New Alert</I18n>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
      <ul className="alerts-list">
        {alerts.map(alert => (
          <li key={alert.id} className="alert-item">
            <h1>
              <Link to={`/alerts/${alert.id}`}>
                <small className="source">
                  <I18n>{alert.values.Source}</I18n>
                </small>
                <I18n>{alert.values.Title}</I18n>
              </Link>
            </h1>

            <p dangerouslySetInnerHTML={{ __html: alert.values.Content }} />
            <span className="meta">{alert.values.CreatedAt}</span>
          </li>
        ))}
        {alerts.size < 1 && (
          <h6 className="empty-alerts">
            <I18n>There are no active alerts.</I18n>
          </h6>
        )}
      </ul>
    </DropdownMenu>
  </Dropdown>
);
