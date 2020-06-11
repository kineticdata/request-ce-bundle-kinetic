import React from 'react';
import { Link } from '@reach/router';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from '../../../redux/store';
import { actions } from '../../../redux/modules/surveys';
import { I18n, SubmissionTable } from '@kineticdata/react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { TimeAgo } from 'common';
import { ExportModal } from '../export/ExportModal';
import { PageTitle } from '../../shared/PageTitle';
import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
import { BetweenDateFilter } from 'common/src/components/tables/BetweenDateFilter';
import { ValuesFilter } from 'common/src/components/tables/ValuesFilter';
import { SelectFilter } from 'common/src/components/tables/SelectFilter';
import { CoreStateBadgeCell } from 'common/src/components/tables/CoreStateBadgeCell';
import { StatusBadge } from 'common/src/components/tables/StatusBadgeCell';
import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';
import { List } from 'immutable';

const LinkCell = ({ row, value }) => (
  <td>
    <Link to={`${row.get('id')}/details`}>{value}</Link>
  </td>
);

const TimeAgoCell = ({ value }) => (
  <td>{value ? <TimeAgo timestamp={value} /> : 'N/A'}</td>
);

const ActionsCell = ({
  openDropdown,
  toggleDropdown,
  formActions,
  callFormAction,
}) => ({ row }) => (
  <td>
    <Dropdown
      toggle={toggleDropdown(row.get('id'))}
      isOpen={openDropdown === row.get('id')}
    >
      <DropdownToggle color="link" className="btn-sm">
        <span className="fa fa-ellipsis-h fa-2x" />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to={`${row.get('id')}/details`}>
          <I18n>View</I18n>
        </DropdownItem>
        {formActions.map(el => (
          <DropdownItem
            key={el.slug}
            onClick={() =>
              callFormAction({
                formSlug: el.slug,
                surveySubmissionId: row.get('id'),
              })
            }
          >
            <I18n>{el.name}</I18n>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  </td>
);

export const FormDetailsComponent = ({
  tableKey,
  kapp,
  form,
  formActions,
  callFormAction,
  openModal,
  openDropdown,
  toggleDropdown,
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
          'createdAt',
          'submittedAt',
          'submittedBy',
          'coreState',
          'actions',
        ]}
        addColumns={[
          form.status === 'Active' && {
            value: 'actions',
            title: ' ',
            sortable: false,
            components: {
              BodyCell: ActionsCell({
                toggleDropdown,
                openDropdown,
                formActions,
                callFormAction,
              }),
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
          submittedAt: {
            title: 'Submitted',
            filter: 'between',
            initial: List(['', '']),
            components: {
              BodyCell: TimeAgoCell,
              Filter: BetweenDateFilter,
            },
          },
          coreState: {
            title: 'Status',
            sortable: true,
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
            <PageTitle parts={[form.name]} />
            <div className="page-panel page-panel--white">
              <div className="page-title">
                <div
                  role="navigation"
                  aria-label="breadcrumbs"
                  className="page-title__breadcrumbs"
                >
                  <span className="breadcrumb-item">
                    <Link to="../../">
                      <I18n>{kapp.name}</I18n>
                    </Link>{' '}
                    /
                  </span>
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
                      <StatusBadge status={form.status} />
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
            <ExportModal form={form} filter={filter} />
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
  formActions: state.surveyApp.formActions,
});

const mapDispatchToProps = {
  fetchFormRequest: actions.fetchFormRequest,
  callFormAction: actions.callFormAction,
  openModal: actions.openModal,
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
    componentDidMount() {
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
