import React from 'react';
import { Avatar } from 'common';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { bundle } from 'react-kinetic-core';
import { I18n } from '../I18nProvider';

export const Profile = ({
  profile,
  openFeedbackForm,
  openHelpForm,
  openInviteOthersForm,
  openKitchenSinkForm,
  isOpen,
  toggle,
  isGuest,
}) => (
  <Dropdown isOpen={isOpen} toggle={toggle}>
    <DropdownToggle
      nav
      role="button"
      className="icon-wrapper"
      style={{ padding: '0 1em' }}
    >
      <Avatar size={24} user={profile} previewable={false} />
    </DropdownToggle>
    <DropdownMenu right className="profile-menu">
      <div className="profile-header">
        <h6>
          {profile.displayName}
          <br />
          <small>{profile.email}</small>
        </h6>
      </div>
      <div className="profile-links">
        <div className="dropdown-divider" />
        <Link to="/settings/profile" className="dropdown-item" onClick={toggle}>
          <I18n>Profile</I18n>
        </Link>
        {profile.spaceAdmin && (
          <a
            role="button"
            tabIndex="0"
            onClick={openInviteOthersForm}
            className="dropdown-item"
          >
            <I18n>Invite Others</I18n>
          </a>
        )}
        {!isGuest && (
          <a
            role="button"
            tabIndex="0"
            onClick={openHelpForm}
            className="dropdown-item"
          >
            <I18n>Get Help</I18n>
          </a>
        )}
        {!isGuest && (
          <a
            role="button"
            tabIndex="0"
            onClick={openFeedbackForm}
            className="dropdown-item"
          >
            <I18n>Give Feedback</I18n>
          </a>
        )}
        {!isGuest && (
          <Link to="/about" className="dropdown-item" onClick={toggle}>
            <I18n>About My Space</I18n>
          </Link>
        )}
        <div className="dropdown-divider" />
        <a
          onClick={() => localStorage.removeItem('token')}
          href={`${bundle.spaceLocation()}/app/logout`}
          className="dropdown-item"
        >
          <I18n>Logout</I18n>
        </a>
      </div>
    </DropdownMenu>
  </Dropdown>
);
