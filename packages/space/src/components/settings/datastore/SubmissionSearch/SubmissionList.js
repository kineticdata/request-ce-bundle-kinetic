import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { actions } from '../../../../redux/modules/settingsDatastore';
import { SubmissionListItem } from './SubmissionListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';

const WallyNoResultsFoundMessage = ({ form }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No {form.name} Submissions Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Add a new one by hitting the new button!.</h6>
    </div>
  );
};

const WallyEnterSearchTerm = ({ form }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>Enter a term to search</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        You can search by any field on the form, or by choosing an index and
        building a search query.
      </h6>
    </div>
  );
};

const WallySearching = () => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>Searching</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Just a sec while we find those submissions.</h6>
    </div>
  );
};

const SubmissionListComponent = ({
  form,
  submissions,
  loading,
  columns,
  hasStartedSearching,
  nextPageToken,
  searching,
  path,
  isMobile,
  cloneSubmission,
  deleteSubmission,
  fetchSubmissions,
}) => {
  const visibleColumns = columns.filter(c => c.visible);
  return (
    <div className="submissions">
      {loading ? (
        <h3>Loading</h3>
      ) : (
        <div>
          {submissions.size > 0 && (
            <div>
              {nextPageToken === null && (
                <div className="alert alert-success mt-3">
                  <strong>{submissions.size}</strong> results found
                </div>
              )}
              <table className="table table-sm table-striped table-datastore">
                <thead className="d-none d-md-table-header-group">
                  <tr>
                    {visibleColumns.map(c => (
                      <th
                        key={`thead-${c.type}-${c.name}`}
                        className="d-sm-none d-md-table-cell"
                      >
                        {c.label}
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => (
                    <SubmissionListItem
                      key={`trow-${s.id}`}
                      submission={s}
                      loading={loading}
                      form={form}
                      columns={visibleColumns}
                      path={path}
                      isMobile={isMobile}
                      cloneSubmission={cloneSubmission}
                      fetchSubmissions={fetchSubmissions}
                      deleteSubmission={deleteSubmission}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {searching && <WallySearching />}
          {!searching &&
            hasStartedSearching &&
            submissions.size === 0 && (
              <WallyNoResultsFoundMessage form={form} />
            )}
          {!searching &&
            !hasStartedSearching &&
            submissions.size === 0 && <WallyEnterSearchTerm form={form} />}
        </div>
      )}
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.space.settingsDatastore.currentFormLoading,
  form: state.space.settingsDatastore.currentForm,
  submissions: state.space.settingsDatastore.submissions,
  searching: state.space.settingsDatastore.searching,
  nextPageToken: state.space.settingsDatastore.nextPageToken,
  columns: state.space.settingsDatastore.currentForm.columns,
  hasStartedSearching: state.space.settingsDatastore.hasStartedSearching,
  path: state.router.location.pathname.replace(/\/$/, ''),
  isMobile: state.app.layout.size === 'small',
});

export const mapDispatchToProps = {
  cloneSubmission: actions.cloneSubmission,
  deleteSubmission: actions.deleteSubmission,
  fetchSubmissions: actions.fetchSubmissions,
};

export const SubmissionList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SubmissionListComponent);
