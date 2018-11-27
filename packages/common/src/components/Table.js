import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { List } from 'immutable';
import isarray from 'isarray';

const KeyWrapper = ({ children }) => children;

const validateTag = (content, tag, functionName) => {
  if (!content || content.type !== tag) {
    throw new Error(
      `Table failed, ${functionName} must return a ${tag} dom element.`,
    );
  }
  return content;
};

const TableComponent = ({
  render,
  buildTable,
  filterProps,
  sortProps,
  paginationProps,
}) =>
  render({
    table: buildTable(),
    filterProps,
    sortProps,
    paginationProps,
  });

const buildTable = ({
  props: { class: addClass = '', ...tableProps } = {},
  buildTableHeader,
  buildTableBody,
  buildTableFooter,
}) => () => (
  <table className={`table table-sm table-striped ${addClass}`} {...tableProps}>
    {buildTableHeader()}
    {buildTableBody()}
    {buildTableFooter()}
  </table>
);

const buildTableHeader = ({
  renderHeader,
  headerProps: { class: addClass = '', ...theadProps } = {},
  rows,
  sorting,
  filterProps,
  sortProps,
  paginationProps,
  buildTableHeaderRow,
}) => () =>
  renderHeader ? (
    typeof renderHeader === 'function' ? (
      validateTag(
        renderHeader({
          content: buildTableHeaderRow(),
          rows: rows.toJS(),
          filterProps,
          sortProps,
          paginationProps,
        }),
        'thead',
        'renderHeader',
      )
    ) : (
      <thead
        className={`${addClass} ${sorting ? 'sortable' : ''}`}
        {...theadProps}
      >
        {buildTableHeaderRow()}
      </thead>
    )
  ) : (
    undefined
  );

const buildTableHeaderRow = ({
  renderHeaderRow,
  headerRowProps: { class: addClass = '', ...trProps } = {},
  rows,
  columns,
  filterProps,
  sortProps,
  paginationProps,
  buildTableHeaderCell,
}) => () =>
  typeof renderHeaderRow === 'function' ? (
    validateTag(
      renderHeaderRow({
        content: columns.map(buildTableHeaderCell),
        rows: rows.toJS(),
        filterProps,
        sortProps,
        paginationProps,
      }),
      'tr',
      'renderHeaderRow',
    )
  ) : (
    <tr className={addClass} {...trProps}>
      {columns.map(buildTableHeaderCell)}
    </tr>
  );

const buildTableHeaderCell = ({
  sorting,
  sort,
  rows,
  filterProps,
  sortProps,
  paginationProps,
}) => (
  {
    cellProps: { class: addClass = '', ...cProps } = {},
    headerCellProps: { class: addHeaderClass = '', ...thProps } = {},
    width,
    renderHeaderCell,
    title,
    sortable = true,
  },
  index,
) => {
  let sortClass = '',
    sortClick;
  if (sorting) {
    if (sortable) {
      if (sort.column === index) {
        sortClass = sort.descending ? 'sort-desc' : 'sort-asc';
        sortClick = () => sortProps.reverse();
      } else {
        sortClick = () => sortProps.handleSort(index);
      }
    } else {
      sortClass = 'sort-disabled';
    }
  }
  return (
    <KeyWrapper key={`column-${index}`}>
      {typeof renderHeaderCell === 'function' ? (
        validateTag(
          renderHeaderCell({
            content: title,
            rows: rows.toJS(),
            filterProps,
            sortProps,
            paginationProps,
          }),
          'th',
          'renderHeaderCell',
        )
      ) : (
        <th
          className={`${addClass} ${addHeaderClass} ${sortClass}`}
          {...cProps}
          {...thProps}
          width={width || null}
          {...(title ? { scope: 'col' } : {})}
          onClick={sortClick}
        >
          {title}
        </th>
      )}
    </KeyWrapper>
  );
};

const buildTableBody = ({
  renderBody,
  bodyProps: { class: addClass = '', ...tbodyProps } = {},
  rows,
  filterProps,
  sortProps,
  paginationProps,
  buildTableBodyRow,
}) => () =>
  renderBody ? (
    typeof renderBody === 'function' ? (
      validateTag(
        renderBody({
          content: rows.map(buildTableBodyRow),
          rows: rows.toJS(),
          filterProps,
          sortProps,
          paginationProps,
        }),
        'tbody',
        'renderBody',
      )
    ) : (
      <tbody className={addClass} {...tbodyProps}>
        {rows.map(buildTableBodyRow)}
      </tbody>
    )
  ) : (
    undefined
  );

const buildTableBodyRow = ({
  renderBodyRow,
  bodyRowProps: { class: addClass = '', ...trProps } = {},
  rows,
  columns,
  filterProps,
  sortProps,
  paginationProps,
  buildTableBodyCell,
}) => (row, index) => (
  <KeyWrapper key={`row-${index}`}>
    {typeof renderBodyRow === 'function' ? (
      validateTag(
        renderBodyRow({
          content: columns.map(buildTableBodyCell(row, index)),
          row,
          index,
          rows: rows.toJS(),
          filterProps,
          sortProps,
          paginationProps,
        }),
        'tr',
        'renderBodyRow',
      )
    ) : (
      <tr className={addClass} {...trProps}>
        {columns.map(buildTableBodyCell(row, index))}
      </tr>
    )}
  </KeyWrapper>
);

const buildTableBodyCell = ({
  rows,
  filterProps,
  sortProps,
  paginationProps,
}) => (row, rowIndex) => (
  {
    cellProps: { class: addClass = '', ...cProps } = {},
    bodyCellProps: { class: addBodyClass = '', ...tdProps } = {},
    renderBodyCell,
    value,
  },
  index,
) => (
  <KeyWrapper key={`column-${index}`}>
    {typeof renderBodyCell === 'function' ? (
      validateTag(
        renderBodyCell({
          content: row[value],
          value: row[value],
          row,
          index,
          rows: rows.toJS(),
          filterProps,
          sortProps,
          paginationProps,
        }),
        'td',
        'renderBodyCell',
      )
    ) : (
      <td
        className={`${addClass} ${addBodyClass}`}
        {...cProps}
        {...tdProps}
        {...(index === 0 ? { scope: 'row' } : {})}
      >
        {row[value]}
      </td>
    )}
  </KeyWrapper>
);

const buildTableFooter = ({
  renderFooter,
  footerProps: { class: addClass = '', ...tfootProps } = {},
  rows,
  filterProps,
  sortProps,
  paginationProps,
  buildTableFooterRow,
}) => () =>
  renderFooter ? (
    typeof renderFooter === 'function' ? (
      validateTag(
        renderFooter({
          content: buildTableFooterRow(),
          rows: rows.toJS(),
          filterProps,
          sortProps,
          paginationProps,
        }),
        'tfoot',
        'renderFooter',
      )
    ) : (
      <tfoot className={addClass} {...tfootProps}>
        {buildTableFooterRow()}
      </tfoot>
    )
  ) : (
    undefined
  );

const buildTableFooterRow = ({
  renderFooterRow,
  footerRowProps: { class: addClass = '', ...trProps } = {},
  rows,
  columns,
  filterProps,
  sortProps,
  paginationProps,
  buildTableFooterCell,
}) => () =>
  typeof renderFooterRow === 'function' ? (
    validateTag(
      renderFooterRow({
        content: columns.map(buildTableFooterCell),
        rows: rows.toJS(),
        filterProps,
        sortProps,
        paginationProps,
      }),
      'tr',
      'renderFooterRow',
    )
  ) : (
    <tr className={addClass} {...trProps}>
      {columns.map(buildTableFooterCell)}
    </tr>
  );

const buildTableFooterCell = ({
  rows,
  filterProps,
  sortProps,
  paginationProps,
}) => (
  {
    cellProps: { class: addClass = '', ...cProps } = {},
    footerCellProps: { class: addFooterClass = '', ...tdProps } = {},
    renderFooterCell,
  },
  index,
) => (
  <KeyWrapper key={`column-${index}`}>
    {typeof renderFooterCell === 'function' ? (
      validateTag(
        renderFooterCell({
          rows: rows.toJS(),
          filterProps,
          sortProps,
          paginationProps,
        }),
        'td',
        'renderFooterCell',
      )
    ) : (
      <td
        className={`${addClass} ${addFooterClass}`}
        {...cProps}
        {...tdProps}
      />
    )}
  </KeyWrapper>
);

const buildSortFromProps = ({ sortOrder, columns = [] }) => {
  if (typeof sortOrder === 'number') {
    return {
      column: Math.max(0, Math.min(columns.length, sortOrder)),
      descending: false,
    };
  } else if (isarray(sortOrder) && typeof sortOrder[0] === 'number') {
    return {
      column: Math.max(0, Math.min(columns.length, sortOrder[0])),
      descending:
        typeof sortOrder[1] === 'string' &&
        sortOrder[1].toUpperCase() === 'DESC',
    };
  } else {
    return {
      column: 0,
      descending: false,
    };
  }
};

export const Table = compose(
  withState('filter', 'setFilter', ''),
  withState('sort', 'setSort', buildSortFromProps),
  withState('pageNumber', 'setPageNumber', 1),
  // Set prop defaults
  withProps(
    ({
      data = [],
      columns = [],
      renderHeader = true,
      renderBody = true,
      renderFooter = false,
      filtering = true,
      sorting = true,
      pagination = true,
      pageSize = 10,
    }) => ({
      rows: List(data),
      columns,
      renderHeader,
      renderBody,
      renderFooter,
      filtering,
      sorting,
      pagination,
      pageSize,
    }),
  ),
  // Define filtering props
  withProps(
    ({ filtering, columns, rows, filter, setFilter, setPageNumber }) => {
      if (filtering) {
        const filterableColumns =
          filter &&
          columns
            .map(column => (column.filterable !== false ? column.value : null))
            .filter(c => c);
        return {
          rows: filter
            ? rows.filter(
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
              )
            : rows,
          filterProps: {
            filter,
            handleFilterChange: e => {
              setFilter(e.target.value);
              setPageNumber(1);
            },
          },
        };
      }
    },
  ),
  // Define sorting props
  withProps(({ sorting, columns, rows, filter, sort, setSort }) => {
    if (sorting && columns[sort.column]) {
      const applyDirection = rows => (sort.descending ? rows.reverse() : rows);
      return {
        rows: applyDirection(
          rows.sortBy(row => row[columns[sort.column].value]),
        ),
        sortProps: {
          column: sort.column,
          direction: sort.descending ? 'DESC' : 'ASC',
          handleSort: sortOrder => {
            setSort(buildSortFromProps({ sortOrder, columns }));
          },
          reverse: () => {
            setSort({ ...sort, descending: !sort.descending });
          },
        },
      };
    }
  }),
  // Define pagination props
  withProps(
    ({
      pagination,
      columns,
      rows,
      pageSize = 10,
      pageNumber,
      setPageNumber,
    }) => {
      if (pagination) {
        const pageCount = Math.ceil(rows.size / pageSize) || 1;
        const endIndex = pageNumber * pageSize;
        const startIndex = endIndex - pageSize;
        const hasPreviousPage = pageNumber > 1;
        const hasNextPage = pageNumber < pageCount;
        return {
          rows: rows.slice(startIndex, endIndex),
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
    },
  ),
  withHandlers({
    buildTableHeaderCell,
    buildTableBodyCell,
    buildTableFooterCell,
  }),
  withHandlers({
    buildTableHeaderRow,
    buildTableBodyRow,
    buildTableFooterRow,
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
        this.props.setSort(buildSortFromProps(this.props));
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
      title: PropTypes.string,
      value: PropTypes.string,
      width: PropTypes.string,
      cellProps: PropTypes.object,
      renderBodyCell: PropTypes.func,
      headerCellProps: PropTypes.object,
      renderHeaderCell: PropTypes.func,
      bodyCellProps: PropTypes.object,
      renderFooterCell: PropTypes.func,
      footerCellProps: PropTypes.object,
      filterable: PropTypes.bool,
      sortable: PropTypes.bool,
    }),
  ).isRequired,
  renderHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  headerProps: PropTypes.object,
  renderHeaderRow: PropTypes.func,
  headerRowProps: PropTypes.object,
  renderBody: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  bodyProps: PropTypes.object,
  renderBodyRow: PropTypes.func,
  bodyRowProps: PropTypes.object,
  renderFooter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  footerProps: PropTypes.object,
  renderFooterRow: PropTypes.func,
  footerRowProps: PropTypes.object,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  filtering: PropTypes.bool,
  sorting: PropTypes.bool,
  sortOrder: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.number,
      PropTypes.PropTypes.oneOf(['ASC', 'DESC']),
    ),
    PropTypes.number,
  ]),
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
