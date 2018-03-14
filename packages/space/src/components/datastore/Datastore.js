import React from 'react';
import { compose, lifecycle } from 'recompose';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { DatastoreSubmission } from './Submission';
import { FormList } from './FormList';
import { SubmissionList } from './SubmissionList';

import { actions } from '../../redux/modules/datastore';

const NewDatastore = () => <h1>Create a new Datastore</h1>;

const DatstoreSettings = ({ match }) => (
  <h1>Viewing Settings for the{match.params.slug} Datastore</h1>
);

export const DatastoreRouter = ({ loading, match }) =>
  !loading && (
    <Switch>
      <Route exact path={`${match.path}/new`} component={NewDatastore} />
      <Route exact path={`${match.path}/:slug`} component={SubmissionList} />
      <Route
        exact
        path={`${match.path}/:slug/settings`}
        component={DatstoreSettings}
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
  datastoreForms: state.datastore.forms,
});

export const mapDispatchToProps = {
  push,
  fetchForms: actions.fetchForms,
};

export const Datastore = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchForms();
    },
  }),
)(DatastoreRouter);
