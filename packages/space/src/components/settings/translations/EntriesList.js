import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { bundle } from 'react-kinetic-core';
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
import { actions } from '../../../redux/modules/settingsTranslations';

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
          Cancel
        </button>
        <span>Import Translations</span>
      </h4>
    </div>
    <ModalBody>
      <div className="form p-3">
        <div className="form-group">
          <label>File to Upload (CSV or JSON)</label>
          <input
            type="text"
            readOnly
            value={(file && file.name) || ''}
            className="form-control"
          />
          <label htmlFor="import-file-input" className="btn btn-info">
            Select File
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
        Import
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
          Cancel
        </button>
        <span>
          {`Delete Translation${
            entryToDelete && entryToDelete.property === 'key' ? ' Key' : ''
          }`}
        </span>
      </h4>
    </div>
    <ModalBody>
      {entryToDelete && (
        <div className="form p-3">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Context</label>
                <span>{entryToDelete.context}</span>
              </div>
            </div>
            {entryToDelete.property !== 'key' ? (
              <Fragment>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Locale</label>
                    <Badge color="secondary">{entryToDelete.locale}</Badge>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label>Key</label>
                    <span>{entryToDelete.key}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label>Value</label>
                    <span>{entryToDelete.value}</span>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="col-12">
                Are you sure you want to delete the key{' '}
                <strong>{entryToDelete.key}</strong> and all of its
                translations?
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
        Delete
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
          Cancel
        </button>
        <span>
          {`Edit Translation${
            entryToEdit && entryToEdit.property === 'key' ? ' Key' : ''
          }`}
        </span>
      </h4>
    </div>
    <ModalBody>
      {entryToEdit && (
        <div className="form p-3">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Context</label>
                <span>{entryToEdit.context}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Locale</label>
                <Badge color="secondary">{entryToEdit.locale}</Badge>
              </div>
            </div>
            <div className="col-12">
              {entryToEdit.property !== 'key' ? (
                <div className="form-group">
                  <label>Key</label>
                  <span>{entryToEdit.key}</span>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="entry-key-input">Key</label>
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
                  <label htmlFor="entry-value-input">Value</label>
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
        Save
      </button>
    </ModalFooter>
  </Modal>
);

export const EntriesListComponent = ({
  match: {
    path,
    params: { context, locale, keyHash },
  },
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
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to="/settings/translations">translations</Link> /{` `}
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
              <small> Translations</small>
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
                  Export Translations
                </button>
                <button
                  onClick={toggleImport(true)}
                  value="import-csv"
                  className="dropdown-item"
                >
                  Import Translations
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
                  <span className="input-group-text">Locale</span>
                </div>
                <select
                  name="locale-select"
                  id="locale-select"
                  className="form-control"
                  value={locale}
                  onChange={e =>
                    push(
                      `/settings/translations${
                        context ? `/context/${context}` : ''
                      }${e.target.value ? `/locale/${e.target.value}` : ''}`,
                    )
                  }
                >
                  {context && <option value="">All Locales</option>}
                  {enabledLocales.map((locale, index) => (
                    <option key={`${locale.code}-${index}`} value={locale.code}>
                      {`${availableLocalesMap[locale.code]} | ${locale.code}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {keyHash &&
              translations.size > 0 && (
                <table className="table table-sm table-striped settings-table">
                  <thead className="header">
                    <tr>
                      <th>Key</th>
                      <th width="1%" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{currentKey}</td>
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
              data={translations.toJS()}
              columns={[
                {
                  value: 'locale',
                  title: 'Locale',
                  width: '8%',
                  renderCell: renderLocaleCell,
                  renderFooterCell: renderLocaleFooterCell,
                },
                !context && {
                  value: 'context',
                  title: 'Context',
                  renderCell: renderContextCell,
                },
                !keyHash && {
                  value: 'key',
                  title: 'Key',
                  renderCell: renderKeyCell,
                  renderFooterCell: renderKeyFooterCell,
                },
                {
                  value: 'usages',
                  title: '',
                  renderCell: renderUsageCell,
                  filterable: false,
                },
                {
                  value: 'value',
                  title: 'Translation',
                  renderCell: renderTranslationCell,
                  renderFooterCell: renderTranslationFooterCell,
                },
                {
                  title: '',
                  width: '1%',
                  renderCell: renderActionsCell,
                  renderFooterCell: renderActionsFooterCell,
                  filterable: false,
                },
              ].filter(c => c)}
              filtering={!keyHash}
              footer={!!context}
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
  loading: state.space.settingsTranslations.translations.loading,
  errors: state.space.settingsTranslations.translations.errors,
  translations: state.space.settingsTranslations.translations.entries,
  enabledLocales: state.space.settingsTranslations.locales.enabled,
  availableLocalesMap: state.space.settingsTranslations.locales.available.reduce(
    (map, locale) => ({ ...map, [locale.code]: locale.name }),
    {},
  ),
  stagedEntries: state.space.settingsTranslations.staged.entries,
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
  match: {
    path,
    params: { context, locale, keyHash },
  },
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
  match: {
    params: { context, locale, keyHash },
  },
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

const renderContextCell = ({
  match: {
    params: { locale },
  },
}) => ({ value, row, index }) => (
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
  <td>{row.createdAt ? value : <em>{value}</em>}</td>
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
  ),
  withProps(
    ({
      match: {
        params: { keyHash },
      },
      translations,
    }) =>
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
    ({
      match: {
        params: { context, locale },
      },
      currentKey,
    }) => ({
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
        contextName: this.props.match.params.context,
        localeCode: this.props.match.params.locale,
        keyHash: this.props.match.params.keyHash,
      });
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.match.params.context !== prevProps.match.params.context ||
        this.props.match.params.locale !== prevProps.match.params.locale ||
        this.props.match.params.keyHash !== prevProps.match.params.keyHash
      ) {
        this.props.fetchTranslations({
          contextName: this.props.match.params.context,
          localeCode: this.props.match.params.locale,
          keyHash: this.props.match.params.keyHash,
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
