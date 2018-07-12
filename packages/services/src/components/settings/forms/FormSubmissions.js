import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsForms';

const nextPage = (
  nextPageToken,
  currentPage,
  previousPageTokens,
  setPreviousPageToken,
  fetchFormSubmissions,
  formSlug,
  kappSlug,
  setCurrentPage,
) => {
  !previousPageTokens.includes(nextPageToken) &&
    setPreviousPageToken([...previousPageTokens, nextPageToken]);

  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kappSlug,
    pageToken: nextPageToken,
  });

  setCurrentPage(currentPage + 1);
};

const previousPage = (
  nextPageToken,
  currentPage,
  previousPageTokens,
  fetchFormSubmissions,
  formSlug,
  kappSlug,
  setCurrentPage,
) => {
  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kappSlug,
    pageToken: previousPageTokens[currentPage],
  });
  setCurrentPage(currentPage - 1);
};
export const FormSubmissionsContainer = ({
  loading,
  form,
  submissionsLoading,
  submissions,
  nextPageToken,
  currentPage,
  previousPageTokens,
  setPreviousPageToken,
  fetchFormSubmissions,
  kappSlug,
  formSlug,
  setCurrentPage,
}) =>
  !loading && (
    <div>
      <PageTitle parts={['Services Settings']} />
      <div className="page-container page-container--space-settings">
        <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/kapps/services">services</Link> /{` `}
                <Link to="/kapps/services/settings">settings</Link> /{` `}
                <Link to="/kapps/services/settings/forms">forms</Link> /{` `}
              </h3>
              <h1>{form.name}</h1>
            </div>
          </div>
          <section>
            <div className="col-sm-6">
              <label>Description</label>
              <p>{form.description}</p>
            </div>
            <div className="col-sm-6">
              <label>Form Type</label>
              <p>{form.type}</p>
            </div>
            <div className="col-sm-6">
              <label>Form Status</label>
              <p>{form.status}</p>
            </div>
            <div className="col-sm-6">
              <label>Created</label>
              <p>
                {moment(form.createdAt).fromNow()} by {form.createdBy}
              </p>
            </div>
            <div className="col-sm-6">
              <label>Updated</label>
              <p>
                {moment(form.updatedAt).fromNow()} by {form.updatedBy}
              </p>
            </div>

            <div>
              <table className="table table-sm table-striped table-datastore">
                <thead className="header">
                  <tr>
                    <th width="15%">Confirmation #</th>
                    <th width="35%">Submission Label</th>
                    <th width="10%">Status</th>
                    <th width="40%">Submitted</th>
                  </tr>
                </thead>
                {!submissionsLoading && (
                  <tbody>
                    {submissions.map(submission => {
                      return (
                        <tr key={submission.id}>
                          <td>{submission.handle}</td>
                          <td>{submission.label}</td>
                          <td>{submission.values.Status}</td>
                          <td>
                            {moment(submission.submittedAt).fromNow()} by{' '}
                            {submission.submittedBy}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
              <ul className="pull-right">
                {currentPage >= 2 && (
                  <li
                    className="btn btn-primary"
                    onClick={() =>
                      previousPage(
                        nextPageToken,
                        currentPage,
                        previousPageTokens,
                        fetchFormSubmissions,
                        formSlug,
                        kappSlug,
                        setCurrentPage,
                      )
                    }
                  >
                    Previous
                  </li>
                )}
                <li className="btn btn-default">
                  {nextPageToken || currentPage >= 2 ? currentPage : ''}
                </li>
                {nextPageToken && (
                  <li
                    className="btn btn-primary"
                    onClick={() =>
                      nextPage(
                        nextPageToken,
                        currentPage,
                        previousPageTokens,
                        setPreviousPageToken,
                        fetchFormSubmissions,
                        formSlug,
                        kappSlug,
                        setCurrentPage,
                      )
                    }
                  >
                    Next
                  </li>
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

const mapStateToProps = (state, { match: { params } }) => ({
  form: state.services.settingsForms.currentForm,
  kappSlug: state.app.config.kappSlug,
  loading: state.services.settingsForms.loading,
  nextPageToken: state.services.settingsForms.nextPageToken,
  submissionsLoading: state.services.settingsForms.submissionsLoading,
  submissions: state.services.settingsForms.currentFormSubmissions,
});

const mapDispatchToProps = {
  fetchFormSettings: actions.fetchForm,
  fetchFormSubmissions: actions.fetchFormSubmissions,
  fetchKapp: actions.fetchKapp,
};

export const FormSubmissions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inputs', 'setInputs', {}),
  withState('previousPageTokens', 'setPreviousPageToken', []),
  withState('currentPage', 'setCurrentPage', 1),
  withHandlers('setPagination'),
  lifecycle({
    componentWillMount() {
      this.props.fetchFormSettings({
        formSlug: this.props.match.params.id,
        kappSlug: this.props.kappSlug,
      });
      this.props.fetchFormSubmissions({
        formSlug: this.props.match.params.id,
        kappSlug: this.props.kappSlug,
        pageToken: this.props.nextPageToken,
      });
    },
  }),
)(FormSubmissionsContainer);
