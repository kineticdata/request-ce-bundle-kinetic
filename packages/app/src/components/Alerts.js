import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

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
        <span className="title">Alerts</span>
        <div className="actions">
          <a role="button" tabIndex="0" onClick={fetchAlerts}>
            Refresh
          </a>
          <span className="divider">&bull;</span>
          <Link to="/alerts" onClick={toggle}>
            View All
          </Link>
          {isSpaceAdmin && (
            <Fragment>
              <span className="divider">&bull;</span>
              <Link to="/alerts/new" onClick={toggle}>
                New Alert
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
                <small className="source">{alert.values.Source}</small>
                {alert.values.Title}
              </Link>
            </h1>

            <p dangerouslySetInnerHTML={{ __html: alert.values.Content }} />
            <span className="meta">{alert.values.CreatedAt}</span>
          </li>
        ))}
        {alerts.size < 1 && (
          <h6 className="empty-alerts">There are no active alerts.</h6>
        )}
      </ul>
    </DropdownMenu>
  </Dropdown>
);
