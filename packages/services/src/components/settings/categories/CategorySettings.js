import React from 'react';
import { compose, lifecycle } from 'recompose';
import { Router } from '@reach/router';
import { actions } from '../../../redux/modules/settingsCategories';
import { connect } from '../../../redux/store';
import { ErrorMessage } from 'common';
import { Categories } from './Categories';
import { Category } from './Category';

export const CategorySettingsComponent = ({ error }) =>
  error ? (
    <ErrorMessage title="Failed to load categories." message={error.message} />
  ) : (
    <Router>
      <Categories path="/" />
      <Category path="new" />
      <Category path="new/:parentSlug" />
      <Category path=":slug" />
    </Router>
  );

const mapStateToProps = state => ({
  error: state.settingsCategories.error,
});

const mapDispatchToProps = {
  fetchCategoriesRequest: actions.fetchCategoriesRequest,
};

export const CategorySettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchCategoriesRequest();
    },
  }),
)(CategorySettingsComponent);
