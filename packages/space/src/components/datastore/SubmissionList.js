import React from 'react';
import wallyHappyImage from '../../images/wally-happy.svg';

import { List } from 'immutable';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import classNames from 'classnames';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Autocomplete from 'react-autocomplete';

import chevronLeftIcon from 'font-awesome-svg-png/black/svg/chevron-left.svg';
import { TimeAgo } from 'common';
import {
  actions,
  IndexPart,
  selectSubmissionPage,
  DATASTORE_LIMIT,
} from '../../redux/modules/datastore';

// import { selectIndexByName } from '../../redux/modules/datastore';

const PARAM_CRITERIAS = [
  'All',
  'Between',
  'Is Equal To',
  'Is Greater Than',
  'Is Less Than',
  'Is Greater Than or Equal',
  'Is Less Than or Equal',
];

const WallyEmptyMessage = ({ form }) => {
  return (
    <div className="wally">
      <h5>No {form.name} Submissions Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Add some records by hitting the new button!.</h6>
    </div>
  );
};

const EqualsCriteria = ({
  part,
  handleIndexPartInput,
  handleAddIndexPartInput,
}) => {
  return (
    <div>
      {part.value.values.map((v, index) => (
        <div className="search-lookup-param-group" key={index}>
          <input className="search-lookup-input" value={v} />
          <button className="btn btn-link">
            <span className="fa fa-fw fa-remove" />
          </button>
        </div>
      ))}
      <div className="search-lookup-param-group">
        <input
          className="search-lookup-input"
          value={part.value.input}
          onChange={handleIndexPartInput(part)}
        />
        <button
          className="btn btn-link"
          onClick={handleAddIndexPartInput(part)}
        >
          <span className="fa fa-fw fa-plus" />
        </button>
      </div>
    </div>
  );
};

const SingleCriteria = ({ part, handleIndexPartInput }) => (
  <div className="search-lookup-param-group">
    <input
      className="search-lookup-input"
      value={part.value.input}
      onChange={handleIndexPartInput(part)}
    />
  </div>
);

const BetweenCriteria = ({ part, handleIndexPartBetween }) => (
  <div
    className="search-lookup-param-group"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <input
      className="search-lookup-input"
      value={part.value.values.get(0)}
      onChange={handleIndexPartBetween(part, 0)}
    />
    <span>to</span>
    <input
      className="search-lookup-input"
      value={part.value.values.get(1)}
      onChange={handleIndexPartBetween(part, 1)}
    />
  </div>
);

const getPageText = (pageTokens, nextPageToken, submissions) => {
  let pages = pageTokens.size + 1;
  const initialOffset = submissions.size === 1 ? 0 : 1;

  const bottom = pages > 1 ? pages * DATASTORE_LIMIT + 1 : pages;
  const top = nextPageToken
    ? // Has more pages
      pages > 1 ? (pages + 1) * DATASTORE_LIMIT : pages * DATASTORE_LIMIT
    : // Does not have more pages.
      pages > 1
      ? pages * DATASTORE_LIMIT + initialOffset + submissions.size
      : submissions.size;

  return ` ${bottom} to ${top}`;
};

const SubmissionListComponent = ({
  form,
  indexDefinitions,
  searchParams,
  handleResetSearch,
  shouldItemRender,
  setIndexHandler,
  indexLookup,
  setIndexLookup,
  indexParts,
  handleIndexPartCriteria,
  handleIndexPartInput,
  handleIndexPartBetween,
  handleAddIndexPartInput,
  handleSearchSubmissions,
  submissions,
  allSubmissions,
  pageLimit,
  pageOffset,
  pageTokens,
  nextPageToken,
  handleNextThousandPage,
  handlePrevThousandPage,
  handleNextPage,
  handlePrevPage,
  loading,
  match,
}) =>
  !loading ? (
    <div className="submission-wrapper">
      <div className="datastore-container">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to={`/datastore/`}>datastore</Link> /{` `}
              <Link to={`${form.slug}`}>{form.name}</Link> /
            </h3>
            <h1>Records</h1>
          </div>
        </div>
        <div className="search-lookup-wrapper">
          <div className="search-lookup">
            <strong>Look up by</strong>
            <div className="search-lookup-select">
              <Autocomplete
                shouldItemRender={shouldItemRender}
                renderItem={(item, isHighlighted) => (
                  <div
                    className={classNames('item', {
                      'item-highlighted': isHighlighted,
                    })}
                    key={`${item.name}-${item.unique}`}
                  >
                    {item.name}
                  </div>
                )}
                value={indexLookup}
                items={indexDefinitions}
                getItemValue={item => item.name}
                onChange={e => setIndexLookup(e.target.value)}
                onSelect={setIndexHandler}
              />
            </div>
            <div className="search-lookup-reset">
              <button className="btn btn-link" onClick={handleResetSearch}>
                Reset
              </button>
            </div>
          </div>
        </div>
        {searchParams.index &&
          searchParams.indexParts.map(part => (
            <div className="search-lookup-param" key={part.name}>
              <span className="search-lookup-param-name">{part.name}</span>
              <div className="search-lookup-param-select search-lookup-select">
                <Autocomplete
                  getItemValue={val => val}
                  shouldItemRender={() => true}
                  renderItem={(item, isHighlighted) => (
                    <div
                      className={classNames('item', {
                        'item-highlighted': isHighlighted,
                      })}
                    >
                      {item}
                    </div>
                  )}
                  items={PARAM_CRITERIAS}
                  value={part.criteria}
                  onSelect={handleIndexPartCriteria(part)}
                />
              </div>
              <span className="search-lookup-params">
                {part.criteria === 'Is Equal To' ? (
                  <EqualsCriteria
                    part={part}
                    handleIndexPartInput={handleIndexPartInput}
                    handleAddIndexPartInput={handleAddIndexPartInput}
                  />
                ) : part.criteria === 'Between' ? (
                  <BetweenCriteria
                    part={part}
                    handleIndexPartBetween={handleIndexPartBetween}
                  />
                ) : part.criteria !== 'All' ? (
                  <SingleCriteria
                    part={part}
                    handleIndexPartInput={handleIndexPartInput}
                  />
                ) : null}
              </span>
            </div>
          ))}
        <div className="search-lookup-fotter">
          {(pageTokens.size > 0 || nextPageToken !== null) && (
            <span className="search-lookup-error">
              {`The Datastore contains too many records to display at one time.
              Please enter additional search criteria to narrow down the
              results, or use the buttons below the table to navigate between
              chunks of ${DATASTORE_LIMIT} records.`}
            </span>
          )}
          <button
            className="btn btn-primary btn-search-lookup"
            onClick={handleSearchSubmissions}
          >
            Search
          </button>
        </div>

        <div className="datastore-top-pagination">
          <button
            className="btn btn-primary"
            disabled={pageTokens.size === 0}
            onClick={handlePrevThousandPage}
          >
            <span className="fa fa-fw fa-caret-left" />
            Previous 1000
          </button>
          <span>
            <strong>Sorting &amp; Filtering</strong>
            {submissions.size > 0
              ? getPageText(pageTokens, nextPageToken, allSubmissions)
              : ''}
          </span>
          <button
            className="btn btn-primary"
            disabled={nextPageToken === null}
            onClick={handleNextThousandPage}
          >
            Next 1000
            <span className="fa fa-fw fa-caret-right" />
          </button>
        </div>

        <div className="submissions">
          {loading ? (
            <h3>Loading</h3>
          ) : submissions && submissions.size > 0 ? (
            <div>
              <table className="table forms-list">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Handle</th>
                    <th>Created By</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(submission => (
                    <tr key={submission.id}>
                      <td>
                        <Link to={`/datastore/${form.slug}/${submission.id}`}>
                          {submission.label}
                        </Link>
                      </td>
                      <td>{submission.handle}</td>
                      <td>{submission.createdBy}</td>
                      <td>
                        <TimeAgo
                          timestamp={submission.createdAt}
                          id={submission.id}
                        />
                      </td>
                    </tr>
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
          ) : (
            <WallyEmptyMessage form={form} />
          )}
        </div>
      </div>
    </div>
  ) : null;

export const mapStateToProps = state => ({
  loading: state.datastore.currentFormLoading,
  form: state.datastore.currentForm,
  indexDefinitions: state.datastore.currentForm
    ? state.datastore.currentForm.indexDefinitions.filter(
        d => d.status === 'Built',
      )
    : [],
  submissions: selectSubmissionPage(state),
  allSubmissions: state.datastore.submissions,
  searchParams: state.datastore.searchParams,
  indexParts: state.datastore.searchParams.indexParts,
  pageTokens: state.datastore.pageTokens,
  nextPageToken: state.datastore.nextPageToken,
  pageLimit: state.datastore.pageLimit,
  pageOffset: state.datastore.pageOffset,
});

export const mapDispatchToProps = {
  push,
  fetchForm: actions.fetchForm,
  fetchSubmissions: actions.fetchSubmissions,
  setIndex: actions.setIndex,
  setIndexParts: actions.setIndexParts,
  setIndexPartCriteria: actions.setIndexPartCriteria,
  setIndexPartBetween: actions.setIndexPartBetween,
  setIndexPartInput: actions.setIndexPartInput,
  handleIndexPartInput: actions.handleIndexPartInput,
  addIndexPartInput: actions.addIndexPartInput,
  resetSearchParams: actions.resetSearchParams,
  pushPageToken: actions.pushPageToken,
  popPageToken: actions.popPageToken,
  setNextPageToken: actions.setNextPageToken,
  setPageOffset: actions.setPageOffset,
};

const shouldItemRender = () => (item, value) => {
  const val = typeof item === 'string' ? item : item.name;
  return val.toUpperCase().includes(value.toUpperCase());
};

const setIndexHandler = ({
  setIndex,
  setIndexLookup,
  setIndexParts,
  form,
  indexDefinitions,
}) => val => {
  const index = indexDefinitions.find(indexDef => indexDef.name === val);
  const parts = List(
    index.parts.map(part =>
      IndexPart({
        name: part,
        criteria: 'All',
      }),
    ),
  );
  setIndex(val);
  setIndexLookup(val);
  setIndexParts(parts);
};

const handleIndexPartCriteria = ({
  setIndexPartCriteria,
}) => part => criteria => setIndexPartCriteria(part, criteria);

const handleIndexPartInput = ({ setIndexPartInput }) => part => e =>
  setIndexPartInput(part, e.target.value);

const handleIndexPartBetween = ({ setIndexPartBetween }) => (
  part,
  field,
) => e => setIndexPartBetween(part, field, e.target.value);

const handleAddIndexPartInput = ({ addIndexPartInput }) => part => () =>
  addIndexPartInput(part);

const handleSearchSubmissions = ({ fetchSubmissions }) => e => {
  e.preventDefault();
  fetchSubmissions();
};

const handleNextThousandPage = ({
  nextPageToken,
  pushPageToken,
  fetchSubmissions,
}) => () => {
  fetchSubmissions();
};

const handlePrevThousandPage = ({
  setNextPageToken,
  popPageToken,
  pageTokens,
  fetchSubmissions,
}) => () => {
  popPageToken();
  fetchSubmissions();
};

const handleResetSearch = ({ resetSearchParams, setIndexLookup }) => () => {
  resetSearchParams();
  setIndexLookup('');
};

const handleNextPage = ({ setPageOffset, pageOffset, pageLimit }) => () =>
  setPageOffset(pageOffset + pageLimit);

const handlePrevPage = ({ setPageOffset, pageOffset, pageLimit }) => () =>
  setPageOffset(pageOffset - pageLimit);

export const SubmissionList = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('indexLookup', 'setIndexLookup', ''),

  withHandlers({
    shouldItemRender,
    setIndexHandler,
    handleIndexPartCriteria,
    handleIndexPartInput,
    handleIndexPartBetween,
    handleAddIndexPartInput,
    handleSearchSubmissions,
    handlePrevThousandPage,
    handleNextThousandPage,
    handleResetSearch,
    handlePrevPage,
    handleNextPage,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.match.params.slug);
    },
    componentWillUnmount() {
      this.props.resetSearchParams();
    },
  }),
)(SubmissionListComponent);
