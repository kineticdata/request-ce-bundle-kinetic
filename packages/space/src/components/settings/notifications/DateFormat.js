import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { CoreForm } from 'react-kinetic-core';
import { push } from 'connected-react-router';
import { toastActions, PageTitle } from 'common';
import { NOTIFICATIONS_DATE_FORMAT_FORM_SLUG } from '../../../redux/modules/settingsNotifications';

export const DateFormatComponent = props => (
  <div className="page-container page-container--notifications">
    <PageTitle parts={['Date Formats', 'Notifications', 'Settings']} />
    <div className="page-panel page-panel--scrollable">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to="/settings/notifications/date-formats">
              notification date formats
            </Link>
            {` `}
            /
          </h3>
          <h1>{props.submissionId ? 'Edit' : 'New'} Date Format</h1>
          <CoreForm
            datastore
            form={!props.submissionId && NOTIFICATIONS_DATE_FORMAT_FORM_SLUG}
            submission={props.submissionId}
            onCreated={props.handleCreated}
            onUpdated={props.handleUpdated}
          />
        </div>
      </div>
    </div>
  </div>
);

export const handleCreated = props => (response, actions) => {
  props.push('/settings/notifications/date-formats');
  props.addSuccess(
    `Successfully created date format (${response.submission.handle})`,
    'Date Format Created!',
  );
};

export const handleUpdated = props => (response, actions) => {
  props.push('/settings/notifications/date-formats');
  props.addSuccess(
    `Successfully updated date format (${response.submission.handle})`,
    'Date Format Updated!',
  );
};

export const mapDispatchToProps = {
  push,
  addSuccess: toastActions.addSuccess,
};

export const DateFormat = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  withProps(props => ({
    submissionId:
      props.match.params.id !== 'new' ? props.match.params.id : null,
  })),
  withHandlers({ handleCreated, handleUpdated }),
)(DateFormatComponent);
