import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Badge, UncontrolledTooltip } from 'reactstrap';
import { compose, lifecycle, withHandlers } from 'recompose';
import { Table, PaginationControl, FilterControl } from 'common';
import md5 from 'md5';
import { actions } from '../../../redux/modules/settingsTranslations';

export const StagedListComponent = ({
  match: {
    params: { context },
  },
  push,
  loading,
  errors,
  stagedEntries,
  handlePublish,
  renderLocaleCell,
  renderContextCell,
  renderKeyCell,
  renderStatusCell,
}) => {
  return (
    <div className="page-container page-container--translations">
      <div className="page-panel page-panel--scrollable page-panel--translations">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to="/settings/translations">translations</Link> /{` `}
            </h3>
            <h1>Publish Translations</h1>
          </div>
          <div className="page-title__actions">
            <button className="btn btn-primary" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </div>
        {!loading && (
          <div className="list-wrapper list-wrapper--entries">
            <Table
              data={stagedEntries.toJS()}
              columns={[
                {
                  value: 'locale',
                  title: 'Locale',
                  width: '8%',
                  renderCell: renderLocaleCell,
                },
                {
                  value: 'context',
                  title: 'Context',
                  renderCell: renderContextCell,
                },
                {
                  value: 'key',
                  title: 'Key',
                  renderCell: renderKeyCell,
                },
                {
                  value: 'value',
                  title: 'Current Translation',
                },
                {
                  value: 'valueStaged',
                  title: 'New Translation',
                },
                {
                  value: 'status',
                  title: 'Status',
                  renderCell: renderStatusCell,
                  width: '1%',
                  props: {
                    class: 'text-right',
                  },
                },
              ].filter(c => c)}
              pageSize={20}
              render={({ table, paginationProps, filterProps }) => (
                <div className="table-wrapper">
                  {filterProps && <FilterControl {...filterProps} />}
                  {table}
                  <PaginationControl {...paginationProps} />
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.space.settingsTranslations.staged.loading,
  errors: state.space.settingsTranslations.staged.errors,
  stagedEntries: state.space.settingsTranslations.staged.entries,
  availableLocalesMap: state.space.settingsTranslations.locales.available.reduce(
    (map, locale) => ({ ...map, [locale.code]: locale.name }),
    {},
  ),
});

export const mapDispatchToProps = {
  push,
  fetchStagedTranslations: actions.fetchStagedTranslations,
  clearTranslationsCache: actions.clearTranslationsCache,
};

const handlePublish = ({ clearTranslationsCache, push }) => () => {
  clearTranslationsCache({
    callback: () => push(`/settings/translations`),
  });
};

const renderLocaleCell = ({ availableLocalesMap }) => ({
  value,
  row,
  index,
}) => (
  <td>
    <Badge color="secondary" id={`entry-locale-${index}`}>
      {value}
    </Badge>
    <UncontrolledTooltip target={`entry-locale-${index}`} placement="right">
      {availableLocalesMap[value]}
    </UncontrolledTooltip>
  </td>
);

const renderContextCell = () => ({ value, row, index }) => (
  <td>
    <Link to={`/settings/translations/context/${value}`}>{value}</Link>
  </td>
);

const renderKeyCell = () => ({ value, row, index }) => (
  <td>
    <Link
      to={`/settings/translations/context/${row.context}/key/${md5(row.key)}`}
    >
      {value}
    </Link>
  </td>
);

const renderStatusCell = () => ({ value, row, index }) => (
  <td>
    <Badge color="info" id={`entry-status-${index}`}>
      {value}
    </Badge>
  </td>
);

export const StagedList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handlePublish,
    renderLocaleCell,
    renderContextCell,
    renderKeyCell,
    renderStatusCell,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchStagedTranslations({
        contextName: this.props.match.params.context,
      });
    },
    componentDidUpdate(prevProps) {
      if (this.props.match.params.context !== prevProps.match.params.context) {
        this.props.fetchStagedTranslations({
          contextName: this.props.match.params.context,
        });
      }
    },
  }),
)(StagedListComponent);
