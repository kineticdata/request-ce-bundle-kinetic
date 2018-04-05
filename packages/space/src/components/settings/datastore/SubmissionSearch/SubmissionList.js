import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState } from 'recompose';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { SubmissionListItem } from './SubmissionListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import {
  actions,
  selectSubmissionPage,
} from '../../../../redux/modules/settingsDatastore';

const WallyEmptyMessage = ({ form }) => {
  return (
    <div className="wally-empty-state">
      <h5>No {form.name} Submissions Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Add some records by hitting the new button!.</h6>
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
  ...other
}) => (
  <div className="submissions">
    {loading ? (
      <h3>Loading</h3>
    ) : submissions && submissions.size > 0 ? (
      <div>
        <table className="table table-sm">
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

        {allSubmissions.size > 0 && (
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
        )}
      </div>
    ) : (
      <WallyEmptyMessage form={form} />
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
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({
    handlePrevPage,
    handleNextPage,
  }),
)(SubmissionListComponent);
