import React from 'react';
import { connect } from '../../redux/store';
import { compose } from 'recompose';
import { Link } from '@reach/router';
import { Utils } from 'common';
import { I18n } from '@kineticdata/react';

export const SidebarComponent = ({ spaceAdmin, kapp }) => (
  <div className="sidebar">
    <Link to={'../'} className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      <I18n>{`Return to ${kapp.name}`}</I18n>
    </Link>
    <div className="sidebar-group--content-wrapper">
      <ul className="nav flex-column sidebar-group">
        <li className="nav-item">
          <Link
            to="sample"
            className="nav-link"
            getProps={Utils.addActiveLinkClass('nav-link')}
          >
            <I18n>Sample Settings</I18n>
            <span className="fa fa-fw fa-angle-right" />
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  kapp: state.app.kapp,
});

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
