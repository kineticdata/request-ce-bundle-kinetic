import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';

import { actions } from '../../../../redux/modules/settingsDatastore';

import { SimpleSearch } from './SimpleSearch';
import { AdvancedSearch } from './AdvancedSearch';
import { SubmissionList } from './SubmissionList';
import { Paging } from './Paging';

const SubmissionSearchComponent = ({
  form,
  loading,
  simpleSearchActive,
  match,
}) =>
  !loading ? (
    <div className="datastore-container">
      <div className="datastore-content pane scrollable">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
            </h3>
            <h1>{form.name} Records</h1>
          </div>
          <Link
            to={`/settings/datastore/${form.slug}/new`}
            className="btn btn-primary"
          >
            New Record
          </Link>
        </div>
        <div className="search-lookup-wrapper">
          {simpleSearchActive ? <SimpleSearch /> : <AdvancedSearch />}
        </div>
        <Paging />
        <SubmissionList />
      </div>
    </div>
  ) : null;

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.currentFormLoading,
  form: state.settingsDatastore.currentForm,
  simpleSearchActive: state.settingsDatastore.simpleSearchActive,
});

export const mapDispatchToProps = {
  fetchForm: actions.fetchForm,
  resetSearch: actions.resetSearchParams,
};

export const SubmissionSearch = compose(
  connect(mapStateToProps, mapDispatchToProps),
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
