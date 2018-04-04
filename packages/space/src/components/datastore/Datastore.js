import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { DatastoreSubmission } from './Submission';
import { FormList } from './FormList';
import { SubmissionSearch } from './SubmissionSearch/SubmissionSearch';
import { DatastoreSettings } from './DatastoreSettings';
import { CreateDatastore } from './CreateDatastore';
import { actions } from '../../redux/modules/datastore';

const DatastoreError = () => <h1>Error loading Datastore</h1>;

export const DatastoreComponent = ({ match, loading }) =>
  !loading && (
    <Switch>
      <Route exact path={`${match.path}/new`} component={CreateDatastore} />
      <Route exact path={`${match.path}/error`} component={DatastoreError} />
      <Route exact path={`${match.path}/:slug`} component={SubmissionSearch} />
      <Route
        exact
        path={`${match.path}/:slug/settings`}
        component={DatastoreSettings}
      />
      <Route
        exact
        path={`${match.path}/:slug/new`}
        component={DatastoreSubmission}
      />
      <Route
        exact
        path={`${match.path}/:slug/:id`}
        component={DatastoreSubmission}
      />
      <Route component={FormList} />
    </Switch>
  );

export const mapStateToProps = state => ({
  loading: state.datastore.loading,
});

export const mapDispatchToProps = {
  fetchForms: actions.fetchForms,
};

export const Datastore = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchForms();
    },
  }),
)(DatastoreComponent);
