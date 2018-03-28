import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';

import { actions } from '../../../redux/modules/datastore';

import { SimpleSearch } from './SimpleSearch';
import { AdvancedSearch } from './AdvancedSearch';
import { SubmissionList } from './SubmissionList';
import { Paging } from './Paging';

const SubmissionSearchComponent = ({ form, loading, simpleSearchActive }) =>
  !loading ? (
    <div className="datastore-container">
      <div className="datastore-content pane scrollable">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to={`/datastore/`}>datastore</Link> /{` `}
              <Link to={`/datastore/${form.slug}`}>{form.name}</Link> /
            </h3>
            <h1>Records</h1>
          </div>
          <Link to={`/datastore/${form.slug}/new`} className="btn btn-default">
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
  loading: state.datastore.currentFormLoading,
  form: state.datastore.currentForm,
  simpleSearchActive: state.datastore.simpleSearchActive,
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
      this.props.resetSearch();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.slug !== nextProps.match.params.slug) {
        this.props.fetchForm(nextProps.match.params.slug);
        this.props.resetSearch();
      }
    }
  }),
)(SubmissionSearchComponent);
