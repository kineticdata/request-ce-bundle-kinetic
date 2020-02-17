import React from 'react';
import { Link } from '@reach/router';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from '../../../redux/store';
import { actions as formActions } from '../../../redux/modules/surveys';
import { I18n, SubmissionTable } from '@kineticdata/react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { TimeAgo, addToastAlert } from 'common';
import { ExportModal } from '../export/ExportModal';
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
    <Link to={`${row.get('id')}`}>{value}</Link>
  </td>
);

const ActionsCell = ({ openDropdown, toggleDropdown }) => ({ row }) => (
  <td>
    <Dropdown
      toggle={toggleDropdown(row.get('id'))}
      isOpen={openDropdown === row.get('id')}
    >
      <DropdownToggle color="link" className="btn-sm">
        <span className="fa fa-ellipsis-h fa-2x" />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to={row.get('id')}>
          <I18n>View</I18n>
        </DropdownItem>
        <DropdownItem
          onClick={() =>
            addToastAlert({
              title: 'Failed to resend invitation.',
              message: `Not implemented for ${row.get('id')}`,
            })
          }
        >
          <I18n>Resend Invitation</I18n>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </td>
);

export const FormDetailsComponent = ({
  tableKey,
  kapp,
  form,
  openModal,
  openDropdown,
  toggleDropdown,
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
    form && (
      <SubmissionTable
        tableKey={tableKey}
        kappSlug={kapp.slug}
        formSlug={form.slug}
        components={{
          EmptyBodyRow,
          FilterLayout,
          TableLayout: SettingsTableLayout,
        }}
        columnSet={[
          'label',
          'submittedBy',
          'coreState',
          'createdAt',
          'updatedAt',
          'actions',
        ]}
        addColumns={[
          {
            value: 'actions',
            title: ' ',
            sortable: false,
            components: {
              BodyCell: ActionsCell({ toggleDropdown, openDropdown }),
            },
            className: 'text-right',
          },
        ]}
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
          updatedAt: {
            title: 'Updated',
            filter: 'between',
            initial: List(['', '']),
            components: {
              BodyCell: TimeAgoCell,
              Filter: BetweenDateFilter,
            },
          },
          coreState: {
            title: 'Status',
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
                    <Link to="../../">
                      <I18n>{kapp.name}</I18n>
                    </Link>{' '}
                    /
                  </h3>
                  <h1>
                    <I18n>{form.name}</I18n>
                  </h1>
                </div>
                <div className="page-title__actions">
                  <button
                    onClick={() => openModal('export')}
                    value="export"
                    className="btn btn-secondary pull-left"
                  >
                    <span className="fa fa-fw fa-download" />
                    <I18n> Export Records</I18n>
                  </button>
                  <Link to="../settings" className="btn btn-primary">
                    <span className="fa fa-fw fa-cog" />
                    <I18n> Survey Settings</I18n>
                  </Link>
                </div>
              </div>
              <div>
                <div className="data-list data-list--fourths">
                  <div>
                    <dl>
                      <dt>Description</dt>
                      <dd>
                        {form.description || (
                          <em className="text-muted">None</em>
                        )}
                      </dd>
                    </dl>
                  </div>
                  <dl>
                    <dt>Status</dt>
                    <dd>
                      {form.status || <em className="text-muted">None</em>}
                    </dd>
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
            <ExportModal
              form={form}
              filter={filter}
              // createSearchQuery={createSearchQuery}
            />
          </div>
        )}
      </SubmissionTable>
    )
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  form: state.surveys.form,
  error: state.surveys.error,
});

const mapDispatchToProps = {
  fetchFormRequest: formActions.fetchFormRequest,
  openModal: formActions.openModal,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const SurveySubmissions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchFormRequest({
        kappSlug: this.props.kapp.slug,
        formSlug: this.props.slug,
      });
    },
  }),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({
    toggleDropdown,
  }),
)(FormDetailsComponent);
