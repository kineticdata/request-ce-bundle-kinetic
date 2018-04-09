import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { SubmissionListItem } from './SubmissionListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import {
  actions,
  selectSubmissionPage,
} from '../../../../redux/modules/settingsDatastore';

const WallyNoResultsFoundMessage = ({ form }) => {
  return (
    <div className="wally-empty-state">
      <h5>No {form.name} Submissions Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Add some records by hitting the new button!.</h6>
    </div>
  );
};

const WallyEnterSearchTerm = () => {
  return (
    <div className="wally-empty-state">
      <h5>Enter a search term to find some records.</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        You can search by any field on the form, or by choosing an index and
        building a search query.
      </h6>
    </div>
  );
};

const SubmissionListComponent = ({
  form,
  submissions,
  allSubmissions,
  pageLimit,
  pageOffset,
  pageTokens,
  nextPageToken,
  handleNextPage,
  handlePrevPage,
  loading,
  match,
  columns,
  hasStartedSearching,
}) => (
  <div className="submissions">
    {loading ? (
      <h3>Loading</h3>
    ) : (
      <div>
        {submissions.size > 0 && (
          <div>
            <table className="table table-sm table-hover table-datastore">
              <thead className="d-none d-md-table-header-group">
                <tr>
                  {columns.map(c => (
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
                  <SubmissionListItem key={`trow-${s.id}`} submission={s} />
                ))}
              </tbody>
            </table>
            <div className="datastore-bottom-pagination">
              <Pagination size="sm">
                <PaginationItem disabled={pageOffset === 0}>
                  <PaginationLink onClick={handlePrevPage}>
                    <span className="fa fa-fw fa-caret-left" />
                    Previous
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem
                  disabled={pageOffset + pageLimit >= allSubmissions.size}
                >
                  <PaginationLink next onClick={handleNextPage}>
                    Next
                    <span className="fa fa-fw fa-caret-right" />
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </div>
          </div>
        )}
        {submissions.size === 0 &&
          hasStartedSearching && <WallyNoResultsFoundMessage form={form} />}
        {submissions.size === 0 &&
          !hasStartedSearching && <WallyEnterSearchTerm />}
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.currentFormLoading,
  form: state.settingsDatastore.currentForm,
  submissions: selectSubmissionPage(state),
  allSubmissions: state.settingsDatastore.submissions,
  pageTokens: state.settingsDatastore.pageTokens,
  nextPageToken: state.settingsDatastore.nextPageToken,
  pageLimit: state.settingsDatastore.pageLimit,
  pageOffset: state.settingsDatastore.pageOffset,
  columns: state.settingsDatastore.currentForm.columns.filter(c => c.visible),
  hasStartedSearching: state.settingsDatastore.hasStartedSearching,
});

export const mapDispatchToProps = {
  push,
  pushPageToken: actions.pushPageToken,
  popPageToken: actions.popPageToken,
  setNextPageToken: actions.setNextPageToken,
  setPageOffset: actions.setPageOffset,
};

const handleNextPage = ({ setPageOffset, pageOffset, pageLimit }) => () =>
  setPageOffset(pageOffset + pageLimit);

const handlePrevPage = ({ setPageOffset, pageOffset, pageLimit }) => () =>
  setPageOffset(pageOffset - pageLimit);

export const SubmissionList = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handlePrevPage,
    handleNextPage,
  }),
)(SubmissionListComponent);
