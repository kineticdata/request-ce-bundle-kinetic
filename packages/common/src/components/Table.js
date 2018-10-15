import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';

const KeyWrapper = ({ children }) => children;

const verifyTHEAD = content => {
  if (!content || content.type !== 'thead') {
    return <thead>{content}</thead>;
  }
  return content;
};

const verifyTBODY = content => {
  if (!content || content.type !== 'tbody') {
    return <tbody>{content}</tbody>;
  }
  return content;
};

const verifyTFOOT = content => {
  if (!content || content.type !== 'tfoot') {
    return <tfoot>{content}</tfoot>;
  }
  return content;
};

const verifyTH = content => {
  if (!content || content.type !== 'th') {
    return <th>{content}</th>;
  }
  return content;
};

const verifyTD = content => {
  if (!content || content.type !== 'td') {
    return <td>{content}</td>;
  }
  return content;
};

const TableComponent = ({ render, buildTable, filterProps, paginationProps }) =>
  render({
    table: buildTable(),
    filterProps,
    paginationProps,
  });

const buildTable = ({
  props: { class: addClass = '', ...tableProps } = {},
  rows = [],
  columns = [],
  buildTableHeader,
  buildTableBody,
  buildTableFooter,
}) => () => (
  <table
    className={`table table-sm table-striped settings-table ${addClass}`}
    {...tableProps}
  >
    {buildTableHeader()}
    {buildTableBody()}
    {buildTableFooter()}
  </table>
);

const buildTableHeader = ({
  header = true,
  rows = [],
  columns = [],
  filterProps,
  paginationProps,
  buildTableHeaderCell,
}) => () =>
  header ? (
    typeof header === 'function' ? (
      verifyTHEAD(
        header({
          rows,
          filterProps,
          paginationProps,
        }),
      )
    ) : (
      <thead>
        <tr>{columns.map(buildTableHeaderCell)}</tr>
      </thead>
    )
  ) : (
    undefined
  );

const buildTableHeaderCell = ({ rows = [], filterProps, paginationProps }) => (
  {
    props: { class: addClass = '', ...cellProps } = {},
    width,
    renderHeaderCell,
    title,
    value,
  },
  index,
) => (
  <KeyWrapper key={`column-${index}`}>
    {typeof renderHeaderCell === 'function' ? (
      verifyTH(
        renderHeaderCell({
          rows,
          filterProps,
          paginationProps,
        }),
      )
    ) : (
      <th className={`${addClass}`} {...cellProps} width={width || null}>
        {title !== undefined ? title : value}
      </th>
    )}
  </KeyWrapper>
);

const buildTableBody = ({
  body = true,
  data = [],
  rows = [],
  columns = [],
  filterProps,
  paginationProps,
  buildTableBodyCell,
}) => () =>
  body ? (
    typeof body === 'function' ? (
      verifyTBODY(
        body({
          data,
          rows,
          filterProps,
          paginationProps,
        }),
      )
    ) : (
      <tbody>
        {rows.map((row, index) => (
          <tr key={`row-${index}`}>
            {columns.map(buildTableBodyCell(row, index))}
          </tr>
        ))}
      </tbody>
    )
  ) : (
    undefined
  );

const buildTableBodyCell = ({ rows = [], filterProps, paginationProps }) => (
  row,
  rowIndex,
) => (
  { props: { class: addClass = '', ...cellProps } = {}, renderCell, value },
  index,
) => (
  <KeyWrapper key={`column-${index}`}>
    {typeof renderCell === 'function' ? (
      verifyTD(
        renderCell({
          value: row[value],
          row,
          index: rowIndex,
        }),
      )
    ) : (
      <td className={`${addClass}`} {...cellProps}>
        {row[value]}
      </td>
    )}
  </KeyWrapper>
);

const buildTableFooter = ({
  footer = false,
  data = [],
  rows = [],
  columns = [],
  filterProps,
  paginationProps,
  buildTableFooterCell,
}) => () =>
  footer ? (
    typeof footer === 'function' ? (
      verifyTFOOT(
        footer({
          data,
          rows,
          filterProps,
          paginationProps,
        }),
      )
    ) : (
      <tfoot>
        <tr>{columns.map(buildTableFooterCell)}</tr>
      </tfoot>
    )
  ) : (
    undefined
  );

const buildTableFooterCell = ({ rows = [], filterProps, paginationProps }) => (
  { props: { class: addClass = '', ...cellProps } = {}, renderFooterCell },
  index,
) => (
  <KeyWrapper key={`column-${index}`}>
    {typeof renderFooterCell === 'function' ? (
      verifyTD(
        renderFooterCell({
          rows,
          filterProps,
          paginationProps,
        }),
      )
    ) : (
      <td className={`${addClass}`} {...cellProps} />
    )}
  </KeyWrapper>
);

export const Table = compose(
  withState('filter', 'setFilter', ''),
  withState('sort', 'setSort', ''),
  withState('sortDirection', 'setSortDirection', ''),
  withState('pageNumber', 'setPageNumber', 1),
  withProps(
    ({
      columns = [],
      data = [],
      filtering = true,
      filter,
      setFilter,
      pagination = true,
      pageSize = 10,
      pageNumber,
      setPageNumber,
    }) => {
      let rows = data;
      let newProps = {};

      if (filtering) {
        if (filter) {
          const filterableColumns = columns
            .map(column => (column.filterable !== false ? column.value : null))
            .filter(c => c);
          console.log('filterableColumns', filterableColumns);
          rows = rows.filter(
            row =>
              filterableColumns
                .map(column => row[column])
                .filter(
                  value =>
                    value &&
                    (typeof value === 'string' ? value : value.toString())
                      .toLowerCase()
                      .includes(filter.toLowerCase()),
                ).length > 0,
          );
        }
        newProps = {
          ...newProps,
          filterProps: {
            filter,
            handleFilterChange: e => {
              setFilter(e.target.value);
              setPageNumber(1);
            },
          },
        };
      }

      if (pagination) {
        const pageCount = Math.ceil(rows.length / pageSize) || 1;
        const endIndex = pageNumber * pageSize;
        const startIndex = endIndex - pageSize;
        const hasPreviousPage = pageNumber > 1;
        const hasNextPage = pageNumber < pageCount;
        rows = rows.slice(startIndex, endIndex);
        newProps = {
          ...newProps,
          paginationProps: {
            pageCount,
            pageNumber,
            hasPreviousPage,
            handlePreviousPageClick: () =>
              setPageNumber(Math.max(pageNumber - 1, 1)),
            hasNextPage,
            handleNextPageClick: () =>
              setPageNumber(Math.min(pageNumber + 1, pageCount)),
            handleGoToPageClick: page => () =>
              setPageNumber(Math.max(Math.min(page, pageCount), 1)),
          },
        };
      }

      return {
        ...newProps,
        rows,
      };
    },
  ),
  withHandlers({
    buildTableHeaderCell,
    buildTableBodyCell,
    buildTableFooterCell,
  }),
  withHandlers({
    buildTableHeader,
    buildTableBody,
    buildTableFooter,
  }),
  withHandlers({
    buildTable,
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (this.props.identifier !== prevProps.identifier) {
        this.props.setPageNumber(1);
        this.props.setFilter('');
      }
    },
  }),
)(TableComponent);

Table.propTypes = {
  identifier: PropTypes.string,
  props: PropTypes.object,
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      value: PropTypes.string,
      title: PropTypes.string,
      width: PropTypes.string,
      renderCell: PropTypes.func,
      renderHeaderCell: PropTypes.func,
      renderFooterCell: PropTypes.func,
      filterable: PropTypes.bool,
      sortable: PropTypes.bool,
    }),
  ).isRequired,
  header: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  body: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  filtering: PropTypes.bool,
  sorting: PropTypes.bool,
  render: PropTypes.func.isRequired,
};

export const PaginationControl = ({
  pageCount,
  pageNumber,
  hasNextPage,
  handleNextPageClick,
  hasPreviousPage,
  handlePreviousPageClick,
  handleGoToPageClick,
}) => (
  <nav aria-label="Page navigation">
    <ul className="pagination">
      <li
        className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}
        onClick={handlePreviousPageClick}
      >
        <a className="page-link" aria-label="Previous">
          <span className="icon">
            <span className="fa fa-fw fa-caret-left" aria-hidden="true" />
          </span>
          <span className="sr-only">Previous</span>
        </a>
      </li>
      {Array(pageCount)
        .fill()
        .map((_, index) => (
          <li
            key={index + 1}
            id={index + 1}
            onClick={handleGoToPageClick(index + 1)}
            className={
              pageNumber === index + 1 ? 'page-item active' : 'page-item'
            }
          >
            <a className="page-link">{index + 1}</a>
          </li>
        ))}
      <li
        className={`page-item ${!hasNextPage ? 'disabled' : ''}`}
        onClick={handleNextPageClick}
      >
        <a className="page-link" aria-label="next">
          <span className="icon">
            <span className="fa fa-fw fa-caret-right" aria-hidden="true" />
          </span>
          <span className="sr-only">Next</span>
        </a>
      </li>
    </ul>
  </nav>
);

export const FilterControl = ({ filter, handleFilterChange }) => (
  <div className="input-group">
    <div className="input-group-prepend">
      <span className="input-group-text">Filter:</span>
    </div>
    <input
      type="text"
      name="filter-input"
      id="filter-input"
      className="form-control"
      value={filter}
      onChange={handleFilterChange}
    />
  </div>
);
