import React from 'react';
import { connect } from '../redux/store';
import { compose } from 'recompose';
import { Utils } from 'common';
import { Link } from '@reach/router';
import { Nav, NavItem } from 'reactstrap';
import { I18n } from '@kineticdata/react';

export const SidebarComponent = ({ forms, hasSettingsAccess }) => (
  <div className="sidebar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group">
        <h1>
          <I18n>Survey Navigation</I18n>
        </h1>
        <Nav vertical>
          <NavItem>
            <Link to="" getProps={Utils.addActiveLinkClass('nav-link')}>
              <I18n>Home</I18n>
            </Link>
          </NavItem>
        </Nav>
      </div>
    </div>
    {forms && (
      <div className="sidebar-group">
        <h1>
          <I18n>Forms</I18n>
        </h1>
        <Nav vertical>
          {forms.map(form => (
            <NavItem key={form.slug}>
              <Link
                to={`forms/${form.slug}`}
                getProps={Utils.addActiveLinkClass('nav-link')}
              >
                <I18n>{form.name}</I18n>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    )}
    {hasSettingsAccess && (
      <div className="sidebar-group sidebar-group--settings">
        <ul className="nav flex-column settings-group">
          <Link to="settings" className="nav-link">
            <I18n>Settings</I18n>
            <span className="fa fa-fw fa-angle-right" />
          </Link>
        </ul>
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  hasSettingsAccess: state.app.profile.spaceAdmin,
  forms: state.surveyApp.forms,
});

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
