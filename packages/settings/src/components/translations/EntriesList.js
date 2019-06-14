import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { push } from 'redux-first-history';
import { connect } from 'react-redux';
import { bundle } from '@kineticdata/react';
import {
  Badge,
  ButtonDropdown,
  ButtonGroup,
  DropdownToggle,
  DropdownMenu,
  Modal,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
} from 'reactstrap';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { Table, PaginationControl, FilterControl } from 'common';
import { UnpublishedChanges } from './TranslationsList';
import md5 from 'md5';
import { actions } from '../../redux/modules/settingsTranslations';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const ImportModal = ({
  importOpen,
  toggleImport,
  file,
  handleFileChange,
  handleImport,
}) => (
  <Modal isOpen={importOpen} toggle={toggleImport()} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={toggleImport()}>
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>Import Translations</I18n>
        </span>
      </h4>
    </div>
    <ModalBody>
      <div className="form p-3">
        <div className="form-group">
          <label>
            <I18n>File to Upload (CSV or JSON)</I18n>
          </label>
          <input
            type="text"
            readOnly
            value={(file && file.name) || ''}
            className="form-control"
          />
          <label htmlFor="import-file-input" className="btn btn-info">
            <I18n>Select File</I18n>
            <input
              className="collapse"
              id="import-file-input"
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <button
        type="button"
        disabled={!file}
        className="btn btn-primary"
        onClick={handleImport}
      >
        <I18n>Import</I18n>
      </button>
    </ModalFooter>
  </Modal>
);

const ConfirmDeleteModal = ({
  entryToDelete,
  toggleDelete,
  handleDeleteTranslation,
}) => (
  <Modal isOpen={!!entryToDelete} toggle={toggleDelete(null)} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button
          type="button"
          className="btn btn-link"
          onClick={toggleDelete(null)}
        >
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>{`Delete Translation${
            entryToDelete && entryToDelete.property === 'key' ? ' Key' : ''
          }`}</I18n>
        </span>
      </h4>
    </div>
    <ModalBody>
      {entryToDelete && (
        <div className="form p-3">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  <I18n>Context</I18n>
                </label>
                <span>{entryToDelete.context}</span>
              </div>
            </div>
            {entryToDelete.property !== 'key' ? (
              <Fragment>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      <I18n>Locale</I18n>
                    </label>
                    <Badge color="secondary">{entryToDelete.locale}</Badge>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label>
                      <I18n>Key</I18n>
                    </label>
                    <span>{entryToDelete.key}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label>
                      <I18n>Value</I18n>
                    </label>
                    <span>{entryToDelete.value}</span>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="col-12">
                <I18n>Are you sure you want to delete the key</I18n>{' '}
                <strong>{entryToDelete.key}</strong>{' '}
                <I18n>and all of its translations?</I18n>
              </div>
            )}
          </div>
        </div>
      )}
    </ModalBody>
    <ModalFooter>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleDeleteTranslation}
      >
        <I18n>Delete</I18n>
      </button>
    </ModalFooter>
  </Modal>
);

const EditModal = ({
  entryToEdit,
  toggleEdit,
  handleEditEntryChange,
  handleEditEntry,
}) => (
  <Modal isOpen={!!entryToEdit} toggle={toggleEdit(null)} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button
          type="button"
          className="btn btn-link"
          onClick={toggleEdit(null)}
        >
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>{`Edit Translation${
            entryToEdit && entryToEdit.property === 'key' ? ' Key' : ''
          }`}</I18n>
        </span>
      </h4>
    </div>
    <ModalBody>
      {entryToEdit && (
        <div className="form p-3">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  <I18n>Context</I18n>
                </label>
                <span>{entryToEdit.context}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  <I18n>Locale</I18n>
                </label>
                <Badge color="secondary">{entryToEdit.locale}</Badge>
              </div>
            </div>
            <div className="col-12">
              {entryToEdit.property !== 'key' ? (
                <div className="form-group">
                  <label>
                    <I18n>Key</I18n>
                  </label>
                  <span>{entryToEdit.key}</span>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="entry-key-input">
                    <I18n>Key</I18n>
                  </label>
                  <textarea
                    name="entry-key-input"
                    id="entry-key-input"
                    rows="2"
                    className="form-control"
                    onChange={handleEditEntryChange}
                    value={entryToEdit.key || ''}
                  />
                </div>
              )}
            </div>
            {entryToEdit.property !== 'key' && (
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="entry-value-input">
                    <I18n>Value</I18n>
                  </label>
                  <textarea
                    name="entry-value-input"
                    id="entry-value-input"
                    rows="3"
                    className="form-control"
                    onChange={handleEditEntryChange}
                    value={entryToEdit.value || ''}
                  />
                </div>
              </div>
            )}
            {entryToEdit.property !== 'key' &&
              entryToEdit.inheritanceEntry !== null && (
                <div className="col-12">
                  <div className="alert alert-info">
                    <div className="row">
                      <div className="col-12 mb-2">
                        <strong>
                          <I18n>Inherited from</I18n>:
                        </strong>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-0">
                          <label>
                            <I18n>Context</I18n>
                          </label>
                          <span>{entryToEdit.inheritanceEntry.context}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-0">
                          <label>
                            <I18n>Locale</I18n>
                          </label>
                          <Badge color="secondary">
                            {entryToEdit.inheritanceEntry.locale}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </ModalBody>
    <ModalFooter>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleEditEntry}
      >
        <I18n>Save</I18n>
      </button>
    </ModalFooter>
  </Modal>
);

export const EntriesListComponent = ({
  context,
  locale,
  keyHash,
  push,
  loading,
  errors,
  translations,
  enabledLocales,
  availableLocalesMap,
  currentKey,
  entryToDelete,
  toggleDelete,
  handleDeleteTranslation,
  entryToEdit,
  toggleEdit,
  handleEditEntry,
  handleEditEntryChange,
  optionsOpen,
  setOptionsOpen,
  handleExport,
  importOpen,
  toggleImport,
  file,
  stagedEntries,
  handleFileChange,
  handleImport,
  renderLocaleCell,
  renderLocaleFooterCell,
  renderContextCell,
  renderContextFooterCell,
  renderKeyCell,
  renderKeyFooterCell,
  renderUsageCell,
  renderTranslationCell,
  renderTranslationFooterCell,
  renderActionsCell,
  renderActionsFooterCell,
}) => {
  return (
    <div className="page-container page-container--translations">
      <div className="page-panel page-panel--scrollable page-panel--translations">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/settings">
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
              <Link to="/settings/translations">
                <I18n>translations</I18n>
              </Link>{' '}
              /{` `}
              {keyHash && (
                <Fragment>
                  <Link to={`/settings/translations/context/${context}`}>
                    {context}
                  </Link>{' '}
                  /{` `}
                </Fragment>
              )}
            </h3>
            <h1>
              {keyHash ? currentKey : context || availableLocalesMap[locale]}
              <small>
                {' '}
                <I18n>Translations</I18n>
              </small>
            </h1>
          </div>
          <div className="page-title__actions">
            <ButtonDropdown
              isOpen={optionsOpen}
              toggle={() => setOptionsOpen(!optionsOpen)}
            >
              <DropdownToggle
                className="dropdown-toggle hide-caret"
                color="link"
              >
                <span className="fa fa-ellipsis-v fa-lg" />
              </DropdownToggle>
              <DropdownMenu>
                <button
                  onClick={handleExport}
                  value="export-csv"
                  className="dropdown-item"
                >
                  <I18n>Export Translations</I18n>
                </button>
                <button
                  onClick={toggleImport(true)}
                  value="import-csv"
                  className="dropdown-item"
                >
                  <I18n>Import Translations</I18n>
                </button>
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </div>
        <UnpublishedChanges
          stagedEntries={stagedEntries}
          link="/settings/translations/staged"
        />
        {!loading && (
          <div className="list-wrapper list-wrapper--entries">
            {!keyHash && (
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <I18n>Locale</I18n>
                  </span>
                </div>
                <I18n
                  render={translate => (
                    <select
                      name="locale-select"
                      id="locale-select"
                      className="form-control"
                      value={locale}
                      onChange={e =>
                        push(
                          `/settings/translations${
                            context ? `/context/${context}` : ''
                          }${
                            e.target.value ? `/locale/${e.target.value}` : ''
                          }`,
                        )
                      }
                    >
                      {context && (
                        <option value="">{translate('All Locales')}</option>
                      )}
                      {enabledLocales.map((locale, index) => (
                        <option
                          key={`${locale.code}-${index}`}
                          value={locale.code}
                        >
                          {`${availableLocalesMap[locale.code]} | ${
                            locale.code
                          }`}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}
            {keyHash &&
              translations.size > 0 && (
                <table className="table table-sm table-striped table--settings">
                  <thead className="header">
                    <tr>
                      <th scope="col">
                        <I18n>Key</I18n>
                      </th>
                      <th width="1%" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row">{currentKey}</td>
                      <td className="text-right">
                        <ButtonGroup>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={toggleEdit(translations.get(0), 'key')}
                          >
                            <span className="fa fa-fw fa-pencil" />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={toggleDelete(translations.get(0), 'key')}
                          >
                            <span className="fa fa-fw fa-times" />
                          </button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            <Table
              class="table--settings"
              data={translations.toJS()}
              columns={[
                {
                  value: 'locale',
                  title: 'Locale',
                  width: '8%',
                  renderBodyCell: renderLocaleCell,
                  renderFooterCell: renderLocaleFooterCell,
                },
                !context && {
                  value: 'context',
                  title: 'Context',
                  renderBodyCell: renderContextCell,
                },
                !keyHash && {
                  value: 'key',
                  title: 'Key',
                  renderBodyCell: renderKeyCell,
                  renderFooterCell: renderKeyFooterCell,
                },
                {
                  value: 'usages',
                  title: '',
                  renderBodyCell: renderUsageCell,
                  sortable: false,
                  filterable: false,
                },
                {
                  value: 'value',
                  title: 'Translation',
                  renderBodyCell: renderTranslationCell,
                  renderFooterCell: renderTranslationFooterCell,
                },
                {
                  title: '',
                  width: '1%',
                  renderBodyCell: renderActionsCell,
                  renderFooterCell: renderActionsFooterCell,
                  sortable: false,
                  filterable: false,
                },
              ].filter(c => c)}
              filtering={!keyHash}
              renderFooter={!!context}
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
      <ConfirmDeleteModal
        entryToDelete={entryToDelete}
        toggleDelete={toggleDelete}
        handleDeleteTranslation={handleDeleteTranslation}
      />
      <EditModal
        entryToEdit={entryToEdit}
        toggleEdit={toggleEdit}
        handleEditEntryChange={handleEditEntryChange}
        handleEditEntry={handleEditEntry}
      />
      <ImportModal
        importOpen={importOpen}
        toggleImport={toggleImport}
        file={file}
        handleFileChange={handleFileChange}
        handleImport={handleImport}
      />
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsTranslations.translations.loading,
  errors: state.settingsTranslations.translations.errors,
  translations: state.settingsTranslations.translations.entries,
  enabledLocales: state.settingsTranslations.locales.enabled,
  availableLocalesMap: state.settingsTranslations.locales.available.reduce(
    (map, locale) => ({ ...map, [locale.code]: locale.name }),
    {},
  ),
  stagedEntries: state.settingsTranslations.staged.entries,
});

export const mapDispatchToProps = {
  push,
  fetchTranslations: actions.fetchTranslations,
  upsertTranslations: actions.upsertTranslations,
  deleteTranslation: actions.deleteTranslation,
  updateContextKey: actions.updateContextKey,
};

const toggleEdit = ({ setEntryToEdit, entryToEdit }) => (
  entry,
  property = 'value',
) => () =>
  setEntryToEdit(
    !entry || entry === entryToEdit ? null : { ...entry, property },
  );

const handleEditEntryChange = ({ setEntryToEdit, entryToEdit }) => e =>
  setEntryToEdit({
    ...entryToEdit,
    [entryToEdit.property]: e.target.value,
  });

const handleEditEntry = ({
  entryToEdit,
  setEntryToEdit,
  upsertTranslations,
  updateContextKey,
  push,
  context,
  locale,
  keyHash,
}) => () => {
  entryToEdit.property !== 'key'
    ? upsertTranslations({
        translation: entryToEdit,
        fetchParams: {
          contextName: context,
          localeCode: locale,
          keyHash,
        },
      })
    : updateContextKey({
        ...entryToEdit,
        callback: () =>
          push(
            `/settings/translations/context/${context}/key/${md5(
              entryToEdit.key,
            )}`,
          ),
      });
  setEntryToEdit(null);
};

const handleCreateEntryChange = ({
  setEntryToCreate,
  entryToCreate,
}) => property => e =>
  setEntryToCreate({
    ...entryToCreate,
    [property]: e.target.value,
  });

const handleCreateEntry = ({
  setEntryToCreate,
  entryToCreate,
  upsertTranslations,
  match: {
    params: { context, locale, keyHash },
  },
  currentKey,
}) => () => {
  upsertTranslations({
    translation: entryToCreate,
    fetchParams: {
      contextName: context,
      localeCode: locale,
      keyHash,
    },
  });
  setEntryToCreate({
    locale: locale || '',
    context: context || '',
    key: currentKey || '',
    value: '',
  });
};

const toggleDelete = ({ setEntryToDelete, entryToDelete }) => (
  entry,
  property = 'value',
) => () =>
  setEntryToDelete(
    !entry || entry === entryToDelete ? null : { ...entry, property },
  );

const handleDeleteTranslation = ({
  entryToDelete,
  setEntryToDelete,
  deleteTranslation,
  match: {
    path,
    params: { context, locale, keyHash },
  },
  push,
}) => () => {
  entryToDelete.property !== 'key'
    ? deleteTranslation({
        ...entryToDelete,
        fetchParams: {
          contextName: context,
          localeCode: locale,
          keyHash,
        },
      })
    : deleteTranslation({
        context: entryToDelete.context,
        keyHash: entryToDelete.keyHash,
        callback: () => {
          push(`/settings/translations/context/${context}`);
        },
      });
  setEntryToDelete(null);
};

const handleExport = ({
  setOptionsOpen,
  match: {
    params: { context, locale, keyHash },
  },
}) => () => {
  let params = '';
  if (context) {
    params += `&context=${context}`;
  }
  if (locale) {
    params += `&locale=${locale}`;
  }
  if (keyHash) {
    params += `&keyHash=${keyHash}`;
  }
  window.location.href = `${bundle.apiLocation()}/translations/entries?export=csv&download${params}`;
  setOptionsOpen(false);
};

const toggleImport = ({ setImportOpen, importOpen, setFile }) => open => () => {
  setImportOpen(!!open);
  setFile(null);
};

const handleFileChange = ({ setFile }) => e => {
  setFile(e.target.files[0]);
};

const handleImport = ({
  setImportOpen,
  setFile,
  file,
  context,
  locale,
  keyHash,
  upsertTranslations,
}) => () => {
  upsertTranslations({
    file,
    import: 'csv',
    fetchParams: {
      contextName: context,
      localeCode: locale,
      keyHash,
    },
  });
  setImportOpen(false);
  setFile(null);
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

const renderLocaleFooterCell = ({
  entryToCreate,
  handleCreateEntryChange,
  enabledLocales,
}) => ({ value, row, index }) => (
  <td>
    <select
      name="create-entry-locale-select"
      className="form-control"
      value={entryToCreate.locale}
      onChange={handleCreateEntryChange('locale')}
    >
      <option />
      {enabledLocales.map((locale, i) => (
        <option value={locale.code} key={`locale-${i}`}>
          {locale.code}
        </option>
      ))}
    </select>
  </td>
);

const renderContextCell = ({ locale }) => ({ value, row, index }) => (
  <td>
    <Link
      to={`/settings/translations/context/${value}${
        locale ? `/locale/${locale}` : ''
      }`}
    >
      {value}
    </Link>
  </td>
);

const renderKeyCell = () => ({ value, row, index }) => (
  <td>
    <Link
      to={`/settings/translations/context/${row.context}/key/${row.keyHash}`}
    >
      {value}
    </Link>
  </td>
);

const renderKeyFooterCell = ({ entryToCreate, handleCreateEntryChange }) => ({
  value,
  row,
  index,
}) => (
  <td>
    <input
      type="text"
      name="create-entry-key-input"
      className="form-control"
      placeholder="Key"
      value={entryToCreate.key}
      onChange={handleCreateEntryChange('key')}
    />
  </td>
);

const renderUsageCell = () => ({ value, row, index }) => (
  <td>
    {value &&
      value.length > 0 && (
        <div id={`entry-usages-${index}`}>
          <span className="fa fa-info" />
          <UncontrolledTooltip
            target={`entry-usages-${index}`}
            placement="top"
            style={{ textAlign: 'left' }}
          >
            {value.map((u, i) => <div key={`usage-${i}`}>{u}</div>)}
          </UncontrolledTooltip>
        </div>
      )}
  </td>
);

const renderTranslationCell = () => ({ value, row, index }) => (
  <td>{row.inheritanceEntry === null ? value : <em>{value}</em>}</td>
);

const renderTranslationFooterCell = ({
  entryToCreate,
  handleCreateEntryChange,
}) => ({ value, row, index }) => (
  <td>
    <input
      type="text"
      name="create-entry-value-input"
      className="form-control"
      placeholder="Translation"
      value={entryToCreate.value}
      onChange={handleCreateEntryChange('value')}
    />
  </td>
);

const renderActionsCell = ({ toggleEdit, toggleDelete }) => ({
  value,
  row,
  index,
}) => (
  <td className="text-right">
    <ButtonGroup>
      <button className="btn btn-sm btn-primary" onClick={toggleEdit(row)}>
        <span className="fa fa-fw fa-pencil" />
      </button>
      <button
        disabled={!row.createdAt}
        className="btn btn-sm btn-danger"
        onClick={toggleDelete(row)}
      >
        <span className="fa fa-fw fa-times" />
      </button>
    </ButtonGroup>
  </td>
);

const disableEntryToCreate = entry =>
  !entry.locale || !entry.context || !entry.key || !entry.value;

const renderActionsFooterCell = ({ entryToCreate, handleCreateEntry }) => ({
  value,
  row,
  index,
}) => (
  <td className="text-right">
    <button
      disabled={disableEntryToCreate(entryToCreate)}
      className={`btn btn-success`}
      onClick={handleCreateEntry}
    >
      Create Translation
    </button>
  </td>
);

export const EntriesList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withProps(
    ({ keyHash, translations }) =>
      keyHash && translations.size > 0
        ? {
            currentKey: translations.get(0).key,
          }
        : {},
  ),
  withState('entryToDelete', 'setEntryToDelete', null),
  withState('entryToEdit', 'setEntryToEdit', null),
  withState(
    'entryToCreate',
    'setEntryToCreate',
    ({ context, locale, currentKey }) => ({
      locale: locale || '',
      context: context || '',
      key: currentKey || '',
      value: '',
    }),
  ),
  withState('optionsOpen', 'setOptionsOpen', false),
  withState('importOpen', 'setImportOpen', false),
  withState('file', 'setFile', null),
  withHandlers({
    toggleDelete,
    handleDeleteTranslation,
    toggleEdit,
    handleEditEntryChange,
    handleEditEntry,
    handleCreateEntryChange,
    handleCreateEntry,
    handleExport,
    toggleImport,
    handleFileChange,
    handleImport,
  }),
  withHandlers({
    renderLocaleCell,
    renderLocaleFooterCell,
    renderContextCell,
    renderKeyCell,
    renderKeyFooterCell,
    renderUsageCell,
    renderTranslationCell,
    renderTranslationFooterCell,
    renderActionsCell,
    renderActionsFooterCell,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchTranslations({
        contextName: this.props.context,
        localeCode: this.props.locale,
        keyHash: this.props.keyHash,
      });
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.context !== prevProps.context ||
        this.props.locale !== prevProps.locale ||
        this.props.keyHash !== prevProps.keyHash
      ) {
        this.props.fetchTranslations({
          contextName: this.props.context,
          localeCode: this.props.locale,
          keyHash: this.props.keyHash,
        });
      }
      if (this.props.currentKey !== prevProps.currentKey) {
        this.props.setEntryToCreate({
          ...this.props.entryToCreate,
          key: this.props.currentKey,
        });
      }
    },
  }),
)(EntriesListComponent);
