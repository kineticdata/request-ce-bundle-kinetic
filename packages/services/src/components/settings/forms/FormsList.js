import React from 'react';
import { Link } from '@reach/router';
import { compose, withHandlers } from 'recompose';
import { connect } from '../../../redux/store';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { I18n, FormTable, refetchTable } from '@kineticdata/react';
import { ModalButton, openConfirm } from 'common';
import { PageTitle } from '../../shared/PageTitle';
import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
import { TimeAgoCell } from 'common/src/components/tables/TimeAgoCell';
import { StatusBadgeCell } from 'common/src/components/tables/StatusBadgeCell';
import { SelectFilter } from 'common/src/components/tables/SelectFilter';
// import { FormCloneButton } from '../../common/FormCloneButton';
import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';
import { actions } from '../../../redux/modules/settingsForms';

const ActionsCell = ({ deleteForm, processing }) => ({
  tableOptions: { kappSlug },
  row,
  tableKey,
}) => (
  <td className="text-right" style={{ width: '1%' }}>
    {processing.has(row.get('slug')) ? (
      <button type="button" className="btn btn-sm btn-link" disabled="disabled">
        <span className="fa fa-spinner fa-spin fa-fw" />
      </button>
    ) : (
      <UncontrolledDropdown className="more-actions">
        <DropdownToggle tag="button" className="btn btn-sm btn-link">
          <span className="fa fa-chevron-down fa-fw" />
        </DropdownToggle>
        <DropdownMenu right>
          <Link to={`${row.get('slug')}/settings`} className="dropdown-item">
            Settings
          </Link>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem
            onClick={() =>
              deleteForm(row.get('slug'), () => refetchTable(tableKey))
            }
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )}
  </td>
);

const FormNameCell = ({ row, value }) => (
  <td>
    <Link to={row.get('slug')}>{value}</Link>
    <br />
    <small>{row.get('slug')}</small>
  </td>
);

const FilterLayout = generateFilterModalLayout(
  ['name', 'type', 'status'],
  'Filter Forms',
);

const NewFormToggleButton = props => (
  <I18n
    render={translate => (
      <button
        className="btn btn-secondary"
        title={translate('New Form')}
        {...props}
      >
        <span className="fa fa-plus fa-fw" /> {translate('New Form')}
      </button>
    )}
  />
);

export const FormsListComponent = ({
  tableKey,
  kapp,
  processing,
  deleteForm,
}) => {
  const EmptyBodyRow = generateEmptyBodyRow({
    loadingMessage: 'Loading Forms...',
    noSearchResultsMessage:
      'No forms were found - please modify your search criteria',
    noItemsMessage: 'There are no forms to display.',
    noItemsLinkTo: `/kapps/${kapp.slug}/settings/forms/new`,
    noItemsLinkToMessage: 'Add New Form',
  });

  return (
    <FormTable
      tableKey={tableKey}
      kappSlug={kapp.slug}
      components={{
        EmptyBodyRow,
        FilterLayout,
        TableLayout: SettingsTableLayout,
      }}
      columnSet={[
        'name',
        'status',
        'type',
        'updatedAt',
        'createdAt',
        'actions',
      ]}
      addColumns={[
        {
          value: 'actions',
          title: ' ',
          sortable: false,
          components: {
            BodyCell: ActionsCell({ deleteForm, processing }),
          },
          className: 'text-right',
        },
      ]}
      alterColumns={{
        updatedAt: {
          components: {
            BodyCell: TimeAgoCell,
          },
        },
        createdAt: {
          components: {
            BodyCell: TimeAgoCell,
          },
        },
        name: {
          components: {
            BodyCell: FormNameCell,
          },
        },
        status: {
          components: {
            BodyCell: StatusBadgeCell,
            Filter: SelectFilter,
          },
        },
      }}
      tableOptions={{}}
    >
      {({ pagination, table, filter }) => (
        <div className="page-container">
          <PageTitle parts={[`Forms`]} />
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="../../">
                    <I18n>services</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>Forms</I18n>
                </h1>
              </div>
              <div className="page-title__actions">
                <ModalButton components={{ ToggleButton: NewFormToggleButton }}>
                  {({ isOpen, toggle }) => (
                    <Modal isOpen={isOpen} toggle={toggle} size="md">
                      Not implemented
                    </Modal>
                  )}
                </ModalButton>
              </div>
            </div>
            <div>
              <div className="mb-2 text-right">{filter}</div>
              {table}
              {pagination}
            </div>
          </div>
        </div>
      )}
    </FormTable>
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  reloadApp: state.app.actions.refreshApp,
  processing: state.settingsForms.processing,
});

const mapDispatchToProps = {
  deleteFormRequest: actions.deleteFormRequest,
};

// Settings Container
export const FormsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    deleteForm: props => (formSlug, onSuccess) =>
      openConfirm({
        title: 'Delete Form',
        body: 'Are you sure you want to delete this form?',
        confirmationText: formSlug,
        confirmationTextLabel: 'form slug',
        actionName: 'Delete',
        ok: () =>
          props.deleteFormRequest({
            kappSlug: props.kapp.slug,
            formSlug,
            onSuccess,
          }),
      }),
  }),
)(FormsListComponent);
