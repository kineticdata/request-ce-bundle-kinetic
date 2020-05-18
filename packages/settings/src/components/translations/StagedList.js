import React from 'react';
import { Link } from '@reach/router';
import { push } from 'redux-first-history';
import { connect } from 'react-redux';
import { Badge, UncontrolledTooltip } from 'reactstrap';
import { compose, lifecycle, withHandlers } from 'recompose';
import { Table, PaginationControl, FilterControl } from 'common';
import md5 from 'md5';

import { actions } from '../../redux/modules/settingsTranslations';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

export const StagedListComponent = ({
  context,
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
    <div className="page-container">
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div
            role="navigation"
            aria-label="breadcrumbs"
            className="page-title__breadcrumbs"
          >
            <span className="breadcrumb-item">
              <Link to="/settings">
                <I18n>settings</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <span className="breadcrumb-item">
              <Link to="/settings/translations">
                <I18n>translations</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <h1>
              <I18n>Publish Translations</I18n>
            </h1>
          </div>
          <div className="page-title__actions">
            <button className="btn btn-primary" onClick={handlePublish}>
              <I18n>Publish</I18n>
            </button>
          </div>
        </div>
        {!loading && (
          <div className="list-wrapper list-wrapper--entries">
            <Table
              class="table--settings"
              data={stagedEntries.toJS()}
              columns={[
                {
                  value: 'locale',
                  title: 'Locale',
                  width: '8%',
                  renderBodyCell: renderLocaleCell,
                },
                {
                  value: 'context',
                  title: 'Context',
                  renderBodyCell: renderContextCell,
                },
                {
                  value: 'key',
                  title: 'Key',
                  renderBodyCell: renderKeyCell,
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
                  renderBodyCell: renderStatusCell,
                  cellProps: { class: 'text-right' },
                  width: '1%',
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
  loading: state.settingsTranslations.staged.loading,
  errors: state.settingsTranslations.staged.errors,
  stagedEntries: state.settingsTranslations.staged.entries,
  availableLocalesMap: state.settingsTranslations.locales.available.reduce(
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
    null,
    { context },
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
        contextName: this.props.context,
      });
    },
    componentDidUpdate(prevProps) {
      if (this.props.context !== prevProps.context) {
        this.props.fetchStagedTranslations({
          contextName: this.props.context,
        });
      }
    },
  }),
)(StagedListComponent);
