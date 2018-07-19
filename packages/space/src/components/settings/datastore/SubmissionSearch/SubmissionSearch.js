import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';

import { actions } from '../../../../redux/modules/settingsDatastore';

import { Searchbar } from './Searchbar';
import { SubmissionList } from './SubmissionList';
import { Paging } from './Paging';

const SubmissionSearchComponent = ({
  form,
  loading,
  simpleSearchActive,
  match,
}) =>
  !loading ? (
    <div className="page-container page-container--datastore">
      <div className="page-panel page-panel--scrollable page-panel--datastore-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
            </h3>
            <h1>{form.name}</h1>
          </div>
          <div className="page-title__actions">
            <Link
              to={`/settings/datastore/${form.slug}/import`}
              className="btn btn-secondary ml-3"
            >
              Import Records
            </Link>
            <Link
              to={`/settings/datastore/${form.slug}/new`}
              className="btn btn-primary ml-3"
            >
              New
            </Link>
          </div>
        </div>
        <Searchbar />
        <Paging />
        <SubmissionList />
      </div>
    </div>
  ) : null;

export const mapStateToProps = state => ({
  loading: state.space.settingsDatastore.currentFormLoading,
  form: state.space.settingsDatastore.currentForm,
  simpleSearchActive: state.space.settingsDatastore.simpleSearchActive,
});

export const mapDispatchToProps = {
  fetchForm: actions.fetchForm,
  resetSearch: actions.resetSearchParams,
};

export const SubmissionSearch = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.match.params.slug);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.slug !== nextProps.match.params.slug) {
        this.props.fetchForm(nextProps.match.params.slug);
        this.props.resetSearch();
      }
    },
  }),
)(SubmissionSearchComponent);
