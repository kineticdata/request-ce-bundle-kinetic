import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../../../../redux/modules/settingsDatastore';
import { SubmissionListItem } from './SubmissionListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';

const DiscussionIcon = () => (
  <span className="icon">
    <span
      className="fa fa-fw fa-comments"
      style={{
        color: 'rgb(9, 84, 130)',
        fontSize: '16px',
      }}
    />
  </span>
);

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

const sortTable = ({ clientSortInfo, setClientSortInfo }) => column => {
  if (
    clientSortInfo &&
    clientSortInfo.type === column.type &&
    clientSortInfo.name === column.name
  ) {
    setClientSortInfo({
      ...clientSortInfo,
      direction: clientSortInfo.direction === 'DESC' ? 'ASC' : 'DESC',
    });
  } else {
    setClientSortInfo({
      type: column.type,
      name: column.name,
      direction: 'ASC',
    });
  }
};

const fetchSubmissions = ({
  fetchSubmissionsSimple,
  fetchSubmissionsAdvanced,
  simpleSearchActive,
  clearPageTokens,
}) => () => {
  clearPageTokens();
  if (simpleSearchActive) {
    fetchSubmissionsSimple();
  } else {
    fetchSubmissionsAdvanced();
  }
};

const SubmissionListComponent = ({
  form,
  submissions,
  loading,
  columns,
  hasStartedSearching,
  nextPageToken,
  pageTokens,
  searching,
  path,
  isMobile,
  cloneSubmission,
  deleteSubmission,
  fetchSubmissions,
  clientSortInfo,
  sortTable,
}) => {
  const visibleColumns = columns.filter(c => c.visible);
  return (
    <div className="datastore-submissions">
      {loading ? (
        <h3>Loading</h3>
      ) : (
        <div>
          {submissions.size > 0 && (
            <div>
              {nextPageToken === null &&
                pageTokens.size === 0 &&
                !searching && (
                  <div className="alert alert-success mt-3">
                    <strong>{submissions.size}</strong> results found
                  </div>
                )}
              {clientSortInfo &&
                (nextPageToken !== null || pageTokens.size > 0) && (
                  <div className="text-info mb-2">
                    <small>
                      <em>
                        Sorting the table columns will only sort the visible
                        records on the current page.
                      </em>
                    </small>
                  </div>
                )}
              <table className="table table-sm table-striped table-datastore">
                <thead className="d-none d-md-table-header-group sortable">
                  <tr>
                    {visibleColumns.map(c => {
                      const isDiscussionIdField =
                        c.name === 'Discussion Id' ? true : false;
                      const sortClass =
                        (clientSortInfo &&
                          clientSortInfo.type === c.type &&
                          clientSortInfo.name === c.name &&
                          (clientSortInfo.direction === 'DESC'
                            ? 'sort-desc'
                            : 'sort-asc')) ||
                        '';
                      return (
                        <th
                          key={`thead-${c.type}-${c.name}`}
                          className={`d-sm-none d-md-table-cell ${sortClass}`}
                          onClick={e => sortTable(c)}
                        >
                          {isDiscussionIdField ? <DiscussionIcon /> : c.label}
                        </th>
                      );
                    })}
                    <th className="sort-disabled" />
                  </tr>
                </thead>
                <thead className="d-md-none">
                  <tr>
                    <th>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Sort By</span>
                        </div>
                        <select
                          className="form-control"
                          value={
                            (clientSortInfo &&
                              `${clientSortInfo.name}::${
                                clientSortInfo.type
                              }`) ||
                            ''
                          }
                          onChange={e => {
                            const sortInfo = e.target.value.split('::');
                            sortTable(
                              sortInfo.length === 2
                                ? visibleColumns.find(
                                    c =>
                                      c.name === sortInfo[0] &&
                                      c.type === sortInfo[1],
                                  )
                                : null,
                            );
                          }}
                        >
                          {!clientSortInfo && <option />}
                          {visibleColumns.map(c => (
                            <option
                              key={`${c.name}::${c.type}`}
                              value={`${c.name}::${c.type}`}
                            >
                              {c.label}
                            </option>
                          ))}
                        </select>
                        {clientSortInfo && (
                          <select
                            className="form-control"
                            value={
                              (clientSortInfo && clientSortInfo.direction) || ''
                            }
                            onChange={e => {
                              sortTable({
                                ...clientSortInfo,
                                direction: e.target.value,
                              });
                            }}
                          >
                            <option value="ASC">Asc</option>
                            <option value="DESC">Desc</option>
                          </select>
                        )}
                      </div>
                    </th>
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
  clientSortInfo: state.space.settingsDatastore.clientSortInfo,
  searching: state.space.settingsDatastore.searching,
  nextPageToken: state.space.settingsDatastore.nextPageToken,
  pageTokens: state.space.settingsDatastore.pageTokens,
  columns: state.space.settingsDatastore.currentForm.columns,
  hasStartedSearching: state.space.settingsDatastore.hasStartedSearching,
  path: state.router.location.pathname.replace(/\/$/, ''),
  isMobile: state.app.layout.size === 'small',
  simpleSearchActive: state.space.settingsDatastore.simpleSearchActive,
});

export const mapDispatchToProps = {
  cloneSubmission: actions.cloneSubmission,
  deleteSubmission: actions.deleteSubmission,
  setClientSortInfo: actions.setClientSortInfo,
  fetchSubmissionsSimple: actions.fetchSubmissionsSimple,
  fetchSubmissionsAdvanced: actions.fetchSubmissionsAdvanced,
  clearPageTokens: actions.clearPageTokens,
};

export const SubmissionList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    sortTable,
    fetchSubmissions,
  }),
)(SubmissionListComponent);
