import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import SVGInline from 'react-svg-inline';
import { bundle } from 'react-kinetic-core';

import bellIcon from 'font-awesome-svg-png/white/svg/bell.svg';

export const Alerts = ({ alerts, fetchAlerts }) => (
  <UncontrolledDropdown className="nav-item-right">
    <DropdownToggle nav role="button" className="icon-wrapper">
      <SVGInline svg={bellIcon} className="icon" />
      {alerts.size > 0 && <span className="badge">{alerts.size}</span>}
    </DropdownToggle>
    <DropdownMenu right className="alerts-menu">
      <div className="alerts-header">
        <span className="title">Alerts</span>
        <div className="actions">
          <a role="button" tabIndex="0" onClick={fetchAlerts}>
            Refresh
          </a>
          <span className="divider">&bull;</span>
          <a href={`${bundle.spaceLocation()}?page=alerts`}>View All</a>
          <span className="divider">&bull;</span>
          <a href={`${bundle.spaceLocation()}/admin/alerts`}>Create Alert</a>
        </div>
      </div>
      <ul className="alerts-list">
        {alerts.map(alert => (
          <li key={alert.id} className="alert-item">
            <h1>
              <a
                href={
                  alert.values.URL ||
                  `${bundle.spaceLocation()}?page=alerts#id-${alert.id}`
                }
              >
                <small className="source">{alert.values.Source}</small>
                {alert.values.Title}
              </a>
            </h1>

            <p dangerouslySetInnerHTML={{ __html: alert.values.Content }} />
            <span className="meta">{alert.values.CreatedAt}</span>
          </li>
        ))}
        {alerts.size < 1 && (
          <h6 className="empty-alerts icon-wrapper">
            There are no active alerts.
          </h6>
        )}
      </ul>
    </DropdownMenu>
  </UncontrolledDropdown>
);
