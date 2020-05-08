import React, { Fragment } from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { TeamTable, TeamForm, I18n } from '@kineticdata/react';
import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';
import { PageTitle } from '../shared/PageTitle';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { FormComponents, addToast } from 'common';

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    <ModalBody className="form">
      {fields.get('localName')}
      {fields.get('description')}
      {error}
    </ModalBody>
    <ModalFooter className="modal-footer--full-width">{buttons}</ModalFooter>
  </Fragment>
);

const FormButtons = props => (
  <button
    className="btn btn-success"
    type="submit"
    disabled={!props.dirty || props.submitting}
    onClick={props.submit}
  >
    {props.submitting && (
      <span className="fa fa-circle-o-notch fa-spin fa-fw" />
    )}{' '}
    <I18n>Create Team</I18n>
  </button>
);

const NameCell = ({ value, row }) => (
  <td>
    <Link to={`/settings/teams/${row.get('slug')}`} title="Edit Team">
      {value}
    </Link>
  </td>
);

const EmptyBodyRow = generateEmptyBodyRow({
  loadingMessage: 'Loading Teams...',
  noSearchResultsMessage:
    'No Teams were found - please modify your search criteria',
  noItemsMessage: 'There are no Teams to display.',
  noItemsLinkTo: '/settings/teams/new',
  noItemsLinkToMessage: 'Add new Team',
});

const FilterLayout = generateFilterModalLayout(['name']);

export const TeamsListComponent = ({
  tableType,
  modalOpen,
  toggleModal,
  navigate,
}) => (
  <TeamTable
    components={{
      FilterLayout,
      EmptyBodyRow,
      TableLayout: SettingsTableLayout,
    }}
    alterColumns={{
      name: {
        components: {
          BodyCell: NameCell,
        },
      },
      description: {
        sortable: false,
      },
    }}
    columnSet={['name', 'description']}
  >
    {({ pagination, table, filter }) => (
      <div className="page-container page-container--panels">
        <PageTitle parts={['Teams']} />
        <div className="page-panel page-panel--two-thirds page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../settings">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                <I18n>Teams</I18n>
              </h1>
            </div>
            <div className="page-title__actions">
              <I18n
                render={translate => (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    title={translate('New Team')}
                    onClick={() => toggleModal(true)}
                  >
                    <span className="fa fa-plus fa-fw" />{' '}
                    {translate('New Team')}
                  </button>
                )}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-right">{filter}</div>
            {table}
            {pagination}
          </div>
        </div>
        <div className="page-panel page-panel--one-thirds page-panel--sidebar">
          <h3>
            <I18n>Teams</I18n>
          </h3>
          <p>
            <I18n>
              Teams represent groupings of users within the system. Teams are
              commonly used to for security to define groups of users that have
              permissions to a specific resource.
            </I18n>
          </p>
        </div>

        {/* Modal for creating a new team */}
        <Modal isOpen={!!modalOpen} toggle={() => toggleModal()} size="lg">
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link btn-delete"
                onClick={() => toggleModal()}
              >
                <I18n>Close</I18n>
              </button>
              <span>
                <I18n>New Team</I18n>
              </span>
            </h4>
          </div>
          <TeamForm
            formkey="team-new"
            onSave={() => team => {
              addToast(`${team.name} created successfully.`);
              team && navigate(`${team.slug}`);
            }}
            components={{
              FormLayout,
              FormButtons,
              FormError: FormComponents.FormError,
            }}
            alterFields={{
              description: {
                component: FormComponents.TextAreaField,
              },
            }}
          >
            {({ form, initialized }) => {
              return initialized && form;
            }}
          </TeamForm>
        </Modal>
      </div>
    )}
  </TeamTable>
);

// Teams Container
export const TeamsList = compose(
  withState('modalOpen', 'setModalOpen', false),
  withHandlers({
    toggleModal: props => slug =>
      !slug || slug === props.modalOpen
        ? props.setModalOpen(false)
        : props.setModalOpen(slug),
  }),
)(TeamsListComponent);
