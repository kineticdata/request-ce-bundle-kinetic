import React from 'react';
import { Link } from '@reach/router';
import { compose } from 'recompose';
import { connect } from '../../../redux/store';
import { I18n, SubmissionTable } from '@kineticdata/react';
import { TimeAgo, SubmissionExportModalButton } from 'common';
import { PageTitle } from '../../shared/PageTitle';
import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
import { TimeAgoCell } from 'common/src/components/tables/TimeAgoCell';
import { BetweenDateFilter } from 'common/src/components/tables/BetweenDateFilter';
import { ValuesFilter } from 'common/src/components/tables/ValuesFilter';
import { SelectFilter } from 'common/src/components/tables/SelectFilter';
import { CoreStateBadgeCell } from 'common/src/components/tables/CoreStateBadgeCell';
import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';
import { List } from 'immutable';

// TODO Replace old details page with this one when SubmissionsTable from RKL is ready to be used

const LinkCell = ({ row, value }) => (
  <td>
    <Link to={`submissions/${row.get('id')}`}>{value}</Link>
  </td>
);

export const FormDetailsComponent = ({
  tableKey,
  kapp,
  form,
  processing,
  deleteForm,
}) => {
  const EmptyBodyRow = generateEmptyBodyRow({
    loadingMessage: 'Loading Submissions...',
    noSearchResultsMessage:
      'No submissions were found - please modify your search criteria',
    noItemsMessage: 'There are no submissions to display.',
  });

  const FilterLayout = generateFilterModalLayout(
    ['createdAt', 'submittedBy', 'coreState', 'values'],
    'Filter Submissions',
  );

  return (
    <SubmissionTable
      tableKey={tableKey}
      kappSlug={kapp.slug}
      formSlug={form.slug}
      components={{
        EmptyBodyRow,
        FilterLayout,
        TableLayout: SettingsTableLayout,
      }}
      columnSet={['label', 'submittedBy', 'type', 'coreState', 'createdAt']}
      addColumns={[]}
      alterColumns={{
        label: {
          components: { BodyCell: LinkCell },
        },
        submittedBy: {
          title: 'Submitter',
        },
        createdAt: {
          title: 'Created',
          filter: 'between',
          initial: List(['', '']),
          components: {
            BodyCell: TimeAgoCell,
            Filter: BetweenDateFilter,
          },
        },
        coreState: {
          title: 'State',
          components: {
            BodyCell: CoreStateBadgeCell,
            Filter: SelectFilter,
          },
        },
        values: {
          filter: 'custom',
          type: 'text',
          initial: List([]),
          options: () =>
            form && form.fields
              ? form.fields.map(({ name }) => ({ value: name, label: name }))
              : [],
          components: {
            Filter: ValuesFilter,
          },
        },
      }}
      tableOptions={{}}
    >
      {({ pagination, table, filter, ...more }) => (
        <div className="page-container">
          <PageTitle parts={[form.name, `Forms`]} />
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="../../../">
                    <I18n>services</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../../">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../">
                    <I18n>forms</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>{form.name}</I18n>
                </h1>
              </div>
              <div className="page-title__actions">
                <SubmissionExportModalButton
                  kappSlug={kapp.slug}
                  formSlug={form.slug}
                  title="Export Submissions"
                />
                <Link to="settings" className="btn btn-primary">
                  <span className="fa fa-fw fa-cog" />
                  <I18n>Form Settings</I18n>
                </Link>
              </div>
            </div>
            <div>
              <div className="data-list data-list--fourths">
                <dl>
                  <dt>Type</dt>
                  <dd>{form.type || <em className="text-muted">None</em>}</dd>
                </dl>
                <dl>
                  <dt>Status</dt>
                  <dd>{form.status || <em className="text-muted">None</em>}</dd>
                </dl>
                <dl>
                  <dt>Created</dt>
                  <dd>
                    <TimeAgo timestamp={form.createdAt} />
                    <br />
                    <small>
                      <I18n>by</I18n> {form.createdBy}
                    </small>
                  </dd>
                </dl>
                <dl>
                  <dt>Updated</dt>
                  <dd>
                    <TimeAgo timestamp={form.updatedAt} />
                    <br />
                    <small>
                      <I18n>by</I18n> {form.updatedBy}
                    </small>
                  </dd>
                </dl>
                {form.description && (
                  <div>
                    <dl>
                      <dt>Description</dt>
                      <dd>{form.description}</dd>
                    </dl>
                  </div>
                )}
              </div>
              <h3 className="section__title">
                <I18n>Submissions</I18n>
                {filter}
              </h3>
              <div className="section__content">
                <div className="scroll-wrapper-h">{table}</div>
                {pagination}
              </div>
            </div>
          </div>
        </div>
      )}
    </SubmissionTable>
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
});

const mapDispatchToProps = {};

export const FormDetails = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(FormDetailsComponent);
