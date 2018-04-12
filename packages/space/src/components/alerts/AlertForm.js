import React from 'react';
import { CoreForm } from 'react-kinetic-core';
import { Utils, commonActions, PageTitle } from 'common';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

const AlertFormComponent = ({
  alertsKappSlug,
  alertsFormSlug,
  submissionId,
  submissionLabel,
  match,
  handleCreateOrUpdate,
  values,
  spaceName,
  editing,
}) => (
  <div className="space-alerts-container">
    <PageTitle parts={[editing ? 'Edit Alert' : 'New Alert', 'Alerts']} />

    <div className="alerts-content pane">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">home</Link> / <Link to="/alerts">alerts</Link> /
          </h3>
          <h1>{editing ? 'Edit' : 'New'} Alert</h1>
        </div>
      </div>
      {editing ? (
        <div>
          <CoreForm
            submission={submissionId}
            globals={globals}
            updated={handleCreateOrUpdate}
          />
        </div>
      ) : (
        <div>
          <CoreForm
            kapp={alertsKappSlug}
            form={alertsFormSlug}
            globals={globals}
            created={handleCreateOrUpdate}
            updated={handleCreateOrUpdate}
            values={values}
          />
        </div>
      )}
    </div>
  </div>
);

const mapStateToProps = (state, { match: { params } }) => ({
  spaceName: state.kinops.space.name,
  editing: params.id !== 'new',
  submissionId: params.id,
  alertsKappSlug: Utils.getAttributeValue(
    state.kinops.space,
    'Admin Kapp Slug',
    'admin',
  ),
  alertsFormSlug: Utils.getAttributeValue(
    state.kinops.space,
    'Alerts Form Slug',
    'alerts',
  ),
});

const handleCreateOrUpdate = props => response => {
  props.fetchAlerts();
  props.push(`/alerts`);
};

const mapDispatchToProps = {
  push,
  fetchAlerts: commonActions.fetchAlerts,
};

export const AlertForm = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({ handleCreateOrUpdate }),
)(AlertFormComponent);
