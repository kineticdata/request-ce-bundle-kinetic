import React from 'react';
import Avatar from 'react-avatar';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { bundle } from 'react-kinetic-core';

export const Profile = ({
  profile,
  openFeedbackForm,
  openHelpForm,
  openInviteOthersForm,
  openKitchenSinkForm,
}) => (
  <UncontrolledDropdown>
    <DropdownToggle
      nav
      role="button"
      className="icon-wrapper"
      style={{ padding: '0 1em' }}
    >
      <Avatar
        size={24}
        email={profile.email}
        name={profile.displayName}
        round
      />
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
        <a
          href={`${bundle.spaceLocation()}?page=profile`}
          className="dropdown-item"
        >
          Profile
        </a>
        {profile.spaceAdmin && (
          <a
            role="button"
            tabIndex="0"
            onClick={openInviteOthersForm}
            className="dropdown-item"
          >
            Invite Others
          </a>
        )}
        <a
          role="button"
          tabIndex="0"
          onClick={openHelpForm}
          className="dropdown-item"
        >
          Get Help
        </a>
        <a
          role="button"
          tabIndex="0"
          onClick={openFeedbackForm}
          className="dropdown-item"
        >
          Give Feedback
        </a>
        <a
          href={`${bundle.spaceLocation()}?page=about`}
          className="dropdown-item"
        >
          About My Space
        </a>
        <div className="dropdown-divider" />
        <a
          href={`${bundle.spaceLocation()}/app/logout`}
          className="dropdown-item"
        >
          Logout
        </a>
      </div>
    </DropdownMenu>
  </UncontrolledDropdown>
);
