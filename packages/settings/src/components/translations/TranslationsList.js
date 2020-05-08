import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { LocalesList } from './LocalesList';
import { Table, PaginationControl, FilterControl } from 'common';
import { I18n } from '@kineticdata/react';
import { actions } from '../../redux/modules/settingsTranslations';
import { context } from '../../redux/store';

import { isActiveClass } from '../../utils';

export const UnpublishedChanges = ({ stagedEntries, link }) =>
  stagedEntries.size > 0 ? (
    <div className="alert alert-info text-center">
      <Link to={link}>
        <span className="fa fa-fw fa-info-circle" />
        <span>
          <I18n>There are new translations waiting to be published.</I18n>
        </span>
      </Link>
    </div>
  ) : null;

const ConfirmDeleteModal = ({
  contextToDelete,
  toggleDelete,
  handleDeleteContext,
}) => (
  <Modal isOpen={!!contextToDelete} toggle={toggleDelete('')} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button
          type="button"
          className="btn btn-link"
          onClick={toggleDelete('')}
        >
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>Delete Context</I18n>
        </span>
      </h4>
    </div>
    <ModalBody>
      <div className="p-3">
        <I18n>Are you sure you want to delete the context</I18n>{' '}
        <strong>{contextToDelete}</strong>{' '}
        <I18n>and all of its translations</I18n>?
      </div>
    </ModalBody>
    <ModalFooter>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleDeleteContext}
      >
        <I18n>Delete</I18n>
      </button>
    </ModalFooter>
  </Modal>
);

export const TranslationsListComponent = ({
  pathPrefix,
  mode,
  loading,
  errors,
  formContexts,
  datastoreContexts,
  customContexts,
  toggleDelete,
  contextToDelete,
  handleDeleteContext,
  renderContextNameCell,
  renderActionsCell,
  renderContextNameFooterCell,
  renderActionsFooterCell,
  stagedEntries,
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
            <h1>
              <I18n>Translations</I18n>
            </h1>
          </div>
        </div>
        <UnpublishedChanges
          stagedEntries={stagedEntries}
          link={`/settings/translations/staged`}
        />
        <div className="list-wrapper list-wrapper--locales mb-5">
          <h2 className="section__title">
            <I18n>Enabled Locales</I18n>
          </h2>
          <LocalesList pathPrefix={pathPrefix} />
        </div>
        <div className="list-wrapper list-wrapper--contexts">
          <h2 className="section__title">
            <I18n>Translation Contexts</I18n>
          </h2>

          <ul className="nav nav-tabs">
            <li role="presentation">
              <Link to="/settings/translations/context/shared">
                <I18n>Shared Translations</I18n>
              </Link>
            </li>
          </ul>
          <div className="mb-4">
            <I18n>
              Shared translations are global and inherited by all contexts.
            </I18n>
          </div>

          <ul className="nav nav-tabs">
            <li role="presentation">
              <Link to="/settings/translations" getProps={isActiveClass()}>
                <I18n>Form Contexts</I18n>
              </Link>
            </li>
            <li role="presentation">
              <Link
                to="/settings/translations/datastore"
                getProps={isActiveClass()}
              >
                <I18n>Datastore Contexts</I18n>
              </Link>
            </li>
            <li role="presentation">
              <Link
                to="/settings/translations/custom"
                getProps={isActiveClass()}
              >
                <I18n>Custom Contexts</I18n>
              </Link>
            </li>
          </ul>
          <div className="mb-2">
            {!mode && (
              <I18n>
                Form translations apply to the specific form only. If a key is
                not translated in the form context, the shared translation will
                be used if one exists.
              </I18n>
            )}
            {mode === 'datastore' && (
              <I18n>
                Datastore form translations apply to the specific datastore form
                only. If a key is not translated in the datastore form context,
                the shared translation will be used if one exists.
              </I18n>
            )}
            {mode === 'custom' && (
              <I18n>
                Custom translations are only applied when you specify the custom
                context. If a key is not translated in the custom context, the
                shared translation will be used if one exists.
              </I18n>
            )}
          </div>
          <Table
            identifier={mode || 'form'}
            props={{
              class: 'table--settings',
              name: 'contexts-table',
              id: 'contexts-table',
            }}
            data={
              (mode === 'datastore' && datastoreContexts.toJS()) ||
              (mode === 'custom' && customContexts.toJS()) ||
              formContexts.toJS()
            }
            columns={[
              !mode && { value: 'kappName', title: 'Kapp Name' },
              mode !== 'custom' && { value: 'formName', title: 'Form Name' },
              {
                value: 'name',
                title: 'Context Name',
                renderBodyCell: renderContextNameCell,
                renderFooterCell: renderContextNameFooterCell,
              },
              mode === 'custom' && {
                value: 'name',
                title: '',
                cellProps: { class: 'text-right' },
                width: '1%',
                renderBodyCell: renderActionsCell,
                renderFooterCell: renderActionsFooterCell,
                sortable: false,
                filterable: false,
              },
            ].filter(c => c)}
            renderFooter={mode === 'custom'}
            render={({ table, paginationProps, filterProps }) => (
              <div className="table-wrapper">
                <FilterControl {...filterProps} />
                {table}
                <PaginationControl {...paginationProps} />
              </div>
            )}
          />
        </div>
      </div>
      <ConfirmDeleteModal
        toggleDelete={toggleDelete}
        contextToDelete={contextToDelete}
        handleDeleteContext={handleDeleteContext}
      />
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsTranslations.contexts.loading,
  errors: state.settingsTranslations.contexts.errors,
  formContexts: state.settingsTranslations.contexts.form,
  datastoreContexts: state.settingsTranslations.contexts.datastore,
  customContexts: state.settingsTranslations.contexts.custom,
  unexpectedContexts: state.settingsTranslations.contexts.unexpected,
  stagedEntries: state.settingsTranslations.staged.entries,
});

export const mapDispatchToProps = {
  createContext: actions.createContext,
  updateContext: actions.updateContext,
  deleteContext: actions.deleteContext,
  fetchStagedTranslations: actions.fetchStagedTranslations,
};

const toggleDropdown = ({ setOpenDropdown, openDropdown }) => context => () =>
  setOpenDropdown(context === openDropdown ? '' : context);

const toggleUpdate = ({
  setOpenUpdate,
  openUpdate,
  setContextToUpdate,
  customContexts,
}) => context => () => {
  setOpenUpdate(context === openUpdate ? '' : context);
  context &&
    setContextToUpdate(
      customContexts.find(({ name }) => name === context).displayName,
    );
};

const handleContextToUpdateChange = ({ setContextToUpdate }) => e => {
  setContextToUpdate(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''));
};

const handleUpdateContext = ({
  updateContext,
  openUpdate,
  setOpenUpdate,
  contextToUpdate,
  setContextToUpdate,
}) => () => {
  updateContext({
    contextName: openUpdate,
    context: { name: `custom.${contextToUpdate}` },
  });
  setOpenUpdate('');
};

const handleContextToCreateChange = ({ setContextToCreate }) => e => {
  setContextToCreate(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''));
};

const handleCreateContext = ({
  createContext,
  contextToCreate,
  setContextToCreate,
}) => () => {
  createContext({ context: { name: `custom.${contextToCreate}` } });
  setContextToCreate('');
};

const toggleDelete = ({
  setContextToDelete,
  contextToDelete,
}) => context => () =>
  setContextToDelete(context === contextToDelete ? '' : context);

const handleDeleteContext = ({
  contextToDelete,
  setContextToDelete,
  deleteContext,
}) => () => {
  deleteContext({ contextName: contextToDelete });
  setContextToDelete('');
};

const renderContextNameCell = ({
  pathPrefix,
  openUpdate,
  contextToUpdate,
  handleContextToUpdateChange,
}) => ({ value, row, index }) => (
  <td>
    {openUpdate === value ? (
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">custom.</span>
        </div>
        <input
          type="text"
          name="context-to-update-input"
          id="context-to-update-input"
          className="form-control"
          value={contextToUpdate}
          onChange={handleContextToUpdateChange}
        />
      </div>
    ) : (
      <Link to={`/settings/translations/context/${value}`}>{value}</Link>
    )}
  </td>
);

const renderActionsCell = ({
  openDropdown,
  toggleDropdown,
  openUpdate,
  toggleUpdate,
  handleUpdateContext,
  toggleDelete,
}) => ({ value, row, index }) => (
  <td className="text-right">
    {openUpdate !== value ? (
      <Dropdown toggle={toggleDropdown(value)} isOpen={openDropdown === value}>
        <DropdownToggle color="link" className="btn-sm">
          <span className="fa fa-ellipsis-h fa-2x" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={toggleUpdate(value)}>
            Update Context
          </DropdownItem>
          <DropdownItem onClick={toggleDelete(value)}>
            Delete Context
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    ) : (
      <div className="btn-group">
        <button className="btn btn-success" onClick={handleUpdateContext}>
          <span className="sr-only">Check</span>
          <span className="fa fa-check" />
        </button>
        <button className="btn btn-danger" onClick={toggleUpdate('')}>
          <span className="sr-only">Delete</span>
          <span className="fa fa-times" />
        </button>
      </div>
    )}
  </td>
);

const renderContextNameFooterCell = ({
  contextToCreate,
  handleContextToCreateChange,
}) => () => (
  <td>
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">custom.</span>
      </div>
      <input
        type="text"
        name="context-to-create-input"
        id="context-to-create-input"
        className="form-control"
        placeholder="Custom Context Name"
        value={contextToCreate}
        onChange={handleContextToCreateChange}
      />
    </div>
  </td>
);

const renderActionsFooterCell = ({
  customContexts,
  contextToCreate,
  handleCreateContext,
}) => () => (
  <td className="text-right">
    <button
      disabled={
        !contextToCreate ||
        customContexts.find(
          ({ displayName }) => displayName === contextToCreate,
        )
      }
      className={`btn btn-success`}
      onClick={handleCreateContext}
    >
      Create Context
    </button>
  </td>
);

export const TranslationsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withProps(({ uri }) => ({
    pathPrefix: uri.replace(/\/:mode\?/, ``),
  })),
  withState('openDropdown', 'setOpenDropdown', ''),
  withState('openUpdate', 'setOpenUpdate', ''),
  withState('contextToUpdate', 'setContextToUpdate', ''),
  withState('contextToCreate', 'setContextToCreate', ''),
  withState('contextToDelete', 'setContextToDelete', ''),
  withHandlers({
    toggleDropdown,
    toggleUpdate,
    handleContextToUpdateChange,
    handleUpdateContext,
    handleContextToCreateChange,
    handleCreateContext,
    toggleDelete,
    handleDeleteContext,
  }),
  withHandlers({
    renderContextNameCell,
    renderActionsCell,
    renderContextNameFooterCell,
    renderActionsFooterCell,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchStagedTranslations();
    },
  }),
)(TranslationsListComponent);
