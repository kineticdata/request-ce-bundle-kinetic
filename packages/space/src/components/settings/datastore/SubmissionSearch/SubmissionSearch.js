import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { lifecycle, compose, withState } from 'recompose';
import papaparse from 'papaparse';
import { PageTitle } from 'common';

import { actions } from '../../../../redux/modules/settingsDatastore';
import { Searchbar } from './Searchbar';
import { SubmissionList } from './SubmissionList';
import { Paging } from './Paging';

const SubmissionSearchComponent = ({
  form,
  loading,
  simpleSearchActive,
  match,
  data,
  submissions,
}) =>
  !loading ? (
    <div className="page-container page-container--datastore">
      <PageTitle parts={['Search', form.name, 'Datastore']} />
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
            {submissions.size > 0 && (
              <a
                className="btn btn-info"
                href={data}
                download={`${form.name}.csv`}
              >
                Export Records
              </a>
            )}
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
  submissions: state.space.settingsDatastore.submissions,
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
  withState('data', 'setData', null),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.match.params.slug);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.slug !== nextProps.match.params.slug) {
        this.props.fetchForm(nextProps.match.params.slug);
        this.props.resetSearch();
      }
      if (this.props.submissions !== nextProps.submissions) {
        // Create csv string that will be used for download
        let csv = papaparse.unparse(
          nextProps.submissions.reduce((acc, submission) => {
            let submissionValues = submission.values;
            /** Because of the parser use the fields currently on the form to build the csv string.
             * This will exclude fields (from the csv) that existed on the form but have been removed.
             */
            nextProps.form.get('fields').forEach(field => {
              // If older submissions don't have a new field then add it with a value of null.
              if (submissionValues.hasOwnProperty(field.name)) {
                // Checkbox Array values must be stringifyed to retain their array brackets.
                if (Array.isArray(submissionValues[field.name])) {
                  submissionValues[field.name] = JSON.stringify(
                    submissionValues[field.name],
                  );
                }
              } else {
                submissionValues[field.name] = null;
              }
              return null;
            });
            acc.push({
              'DataStore Record ID': submission.id,
              ...submissionValues,
            });
            return acc;
          }, []),
        );
        csv = 'data:text/csv;charset=utf-8,' + csv;
        nextProps.setData(encodeURI(csv));
      }
    },
  }),
)(SubmissionSearchComponent);
