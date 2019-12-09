import React from 'react';
import { Link } from '@reach/router';
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from 'recompose';
import { connect } from '../../../redux/store';
import { I18n } from '@kineticdata/react';
import { TimeAgo } from 'common';
import { Modal } from 'reactstrap';
import { PageTitle } from '../../shared/PageTitle';
import { SubmissionListItem } from './SubmissionListItem';
import { ExportModal } from './ExportModal';
import { actions } from '../../../redux/modules/settingsForms';
import isobject from 'isobject';
import { List, Record } from 'immutable';

// Used to define form configurations
export const FormConfig = Record({
  // columns config
  columns: List(),
});

// Used to define a single table column
export const ColumnConfig = Record({
  // name of the column
  name: '',
  // label of the column displayed in table
  label: '',
  // Valid types are: system, value.
  type: '',
  // if the column is displayable in the table
  visible: false,
});

export const SUBMISSION_SYSTEM_PROPS = [
  ColumnConfig({
    label: 'Handle',
    name: 'handle',
    type: 'system',
    visible: true,
    filterable: true,
  }),
  ColumnConfig({
    label: 'Label',
    name: 'label',
    type: 'system',
    visible: true,
    filterable: true,
  }),
  ColumnConfig({ label: 'Created At', name: 'createdAt', type: 'system' }),
  ColumnConfig({ label: 'Created By', name: 'createdBy', type: 'system' }),
  ColumnConfig({ label: 'Updated At', name: 'updatedAt', type: 'system' }),
  ColumnConfig({ label: 'Updated By', name: 'updatedBy', type: 'system' }),
  ColumnConfig({ label: 'Id', name: 'id', type: 'system' }),
];

export const parseFormConfigurationJson = json => {
  try {
    const parsed = JSON.parse(json);
    if (isobject(parsed)) {
      return FormConfig(parsed).update('columns', c => List(c));
    } else {
      return FormConfig();
    }
  } catch (e) {
    return FormConfig();
  }
};

export const buildFormConfigurationObject = form => {
  // Parse Form Attribute for Configuration Values
  const parsedConfig = parseFormConfigurationJson(
    form.attributesMap['Form Configuration'] &&
      form.attributesMap['Form Configuration'][0],
  );
  // Build a list of all current column properties
  let defaultColumnConfig = List(
    form.fields
      .map(f => ColumnConfig({ name: f.name, label: f.name, type: 'value' }))
      .concat(SUBMISSION_SYSTEM_PROPS),
  ).sort((a, b) => {
    var indexA = parsedConfig.columns.findIndex(
      sc => sc.name === a.name && sc.type === a.type,
    );
    var indexB = parsedConfig.columns.findIndex(
      sc => sc.name === b.name && sc.type === b.type,
    );
    if (indexA === indexB) {
      return 0;
    } else if (indexA >= 0 && (indexA < indexB || indexB === -1)) {
      return -1;
    } else {
      return 1;
    }
  });
  // If there are saved column configs, apply them
  if (parsedConfig.columns.size > 0) {
    return parsedConfig.merge({
      columns: List(
        defaultColumnConfig.map(dc => {
          const saved = parsedConfig.columns.find(
            sc => sc.name === dc.name && sc.type === dc.type,
          );
          if (saved) {
            return ColumnConfig({
              ...saved,
              name: dc.name,
              type: dc.type,
              label: dc.label,
            });
          } else {
            return dc;
          }
        }),
      ),
    });
  } else {
    return parsedConfig.merge({
      columns: List(defaultColumnConfig),
    });
  }
};

// Create q for search from filter object
export const createSearchQuery = filter => {
  const q = {};
  for (const property in filter.properties) {
    q[property] = filter.properties[property].value;
  }

  for (const value in filter.values) {
    q[`values[${value}]`] = filter.values[value].value;
  }

  return q;
};

// Next page search
const nextPage = ({
  nextPageToken,
  currentPage,
  previousPageTokens,
  setPreviousPageToken,
  fetchFormSubmissions,
  kapp,
  setCurrentPage,
  filter,
}) => formSlug => {
  !previousPageTokens.includes(nextPageToken) &&
    setPreviousPageToken([...previousPageTokens, nextPageToken]);

  const q = createSearchQuery(filter);

  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kapp.slug,
    pageToken: nextPageToken,
    q: q,
  });

  setCurrentPage(currentPage + 1);
};

// Previous page search
const previousPage = ({
  currentPage,
  previousPageTokens,
  fetchFormSubmissions,
  kapp,
  setCurrentPage,
  filter,
}) => formSlug => {
  const q = createSearchQuery(filter);
  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kapp.slug,
    pageToken: previousPageTokens[currentPage],
    q: q,
  });
  setCurrentPage(currentPage - 1);
};

// Used to apply filter to submission results
const filterColumns = ({
  fetchFormSubmissions,
  kapp,
  setCurrentPage,
  filter,
  setFilter,
  setDownloaded,
}) => formSlug => {
  const q = createSearchQuery(filter);

  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kapp.slug,
    q,
  });
  setCurrentPage(1);
  setFilter({ ...filter, visible: false });
  setDownloaded(false);
};

// Removes a single filter from the object
const removeFilter = ({ filter, setFilter, setDownloaded }) => (
  type,
  remove,
) => {
  const newFilters = {};
  for (const key in filter[type]) {
    if (key !== remove) {
      newFilters[key] = filter[type][key];
    }
  }
  setFilter({ ...filter, [type]: { ...newFilters } });
  setDownloaded(false);
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

const sortTable = ({ clientSortInfo, setClientSortInfo }) => column => {
  if (
    clientSortInfo &&
    clientSortInfo.type === column.type &&
    clientSortInfo.name === column.name
  ) {
    setClientSortInfo({
      ...clientSortInfo,
      direction: clientSortInfo.direction === 'DESC' ? 'ASC' : 'DESC',
    });
  } else {
    setClientSortInfo({
      type: column.type,
      name: column.name,
      direction: 'ASC',
    });
  }
};

export const FormDetailsComponent = ({
  tableKey,
  kapp,
  form,
  processing,
  deleteForm,
  toggleDropdown,
  filterColumns,
  removeFilter,
  nextPage,
  previousPage,
  sortTable,
  filter,
  setFilter,
  openModal,
  clientSortInfo,
  nextPageToken,
  currentPage,
  fieldValue,
  setFieldValue,
  property,
  setProperty,
  submissionsLoading,
  submissions,
  appLocation,
  isMobile,
  submissionColumns,
}) => {
  const visibleColumns = submissionColumns.filter(c => c.visible);

  return (
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
          <section>
            <div className="settings-flex row">
              <div className="col-md-12">
                <button
                  className="btn btn-primary pull-right"
                  onClick={() => setFilter({ ...filter, visible: true })}
                >
                  <i className="fa fa-filter fa-lg" />
                </button>

                <button
                  onClick={() => openModal('export')}
                  value="export"
                  className="btn btn-primary pull-left"
                >
                  <I18n>Export Records</I18n>
                </button>
              </div>
            </div>

            <div className="mt-3">
              {clientSortInfo &&
                (nextPageToken || currentPage >= 2) && (
                  <div className="text-info mb-2">
                    <small>
                      <em>
                        <I18n>
                          Sorting the table columns will only sort the visible
                          records on the current page.
                        </I18n>
                      </em>
                    </small>
                  </div>
                )}
              <table className="table table-sm table-striped table--settings">
                <thead className="d-none d-md-table-header-group sortable">
                  <tr>
                    {visibleColumns.map(c => {
                      const isDiscussionIdField =
                        c.name === 'Discussion Id' ? true : false;
                      const sortClass =
                        (clientSortInfo &&
                          clientSortInfo.type === c.type &&
                          clientSortInfo.name === c.name &&
                          (clientSortInfo.direction === 'DESC'
                            ? 'sort-desc'
                            : 'sort-asc')) ||
                        '';
                      return (
                        <th
                          scope="col"
                          key={`thead-${c.type}-${c.name}`}
                          className={`d-sm-none d-md-table-cell
                              ${sortClass}
                              ${isDiscussionIdField ? 'sort-disabled' : ''}`}
                          onClick={e => sortTable(c)}
                        >
                          <I18n>{c.label}</I18n>
                        </th>
                      );
                    })}
                    <th width="10%" className="sort-disabled" />
                  </tr>
                </thead>
                <thead className="d-md-none">
                  <tr>
                    <th scope="col">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <I18n>Sort By</I18n>
                          </span>
                        </div>
                        <select
                          className="form-control"
                          value={
                            (clientSortInfo &&
                              `${clientSortInfo.name}::${
                                clientSortInfo.type
                              }`) ||
                            ''
                          }
                          onChange={e => {
                            const sortInfo = e.target.value.split('::');
                            sortTable(
                              sortInfo.length === 2
                                ? visibleColumns.find(
                                    c =>
                                      c.name === sortInfo[0] &&
                                      c.type === sortInfo[1],
                                  )
                                : null,
                            );
                          }}
                        >
                          {!clientSortInfo && <option />}
                          {visibleColumns.map(c => {
                            if (c.name !== 'Discussion Id') {
                              return (
                                <I18n
                                  key={`${c.name}::${c.type}`}
                                  render={translate => (
                                    <option value={`${c.name}::${c.type}`}>
                                      {translate(c.label)}
                                    </option>
                                  )}
                                />
                              );
                            } else {
                              return null;
                            }
                          })}
                        </select>
                        {clientSortInfo && (
                          <I18n
                            render={translate => (
                              <select
                                className="form-control"
                                value={
                                  (clientSortInfo &&
                                    clientSortInfo.direction) ||
                                  ''
                                }
                                onChange={e => {
                                  sortTable({
                                    ...clientSortInfo,
                                    direction: e.target.value,
                                  });
                                }}
                              >
                                <option value="ASC">{translate('Asc')}</option>
                                <option value="DESC">
                                  {translate('Desc')}
                                </option>
                              </select>
                            )}
                          />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                {!submissionsLoading &&
                  submissions.size > 0 && (
                    <tbody>
                      {submissions.map(s => (
                        <SubmissionListItem
                          key={`trow-${s.id}`}
                          submission={s}
                          form={form}
                          columns={visibleColumns}
                          to={`${appLocation}/settings/forms/${s.id}/activity`}
                          isMobile={isMobile}
                        />
                      ))}
                    </tbody>
                  )}
              </table>
              <ul className="pagination">
                {currentPage >= 2 && (
                  <li
                    className="page-item disabled"
                    onClick={() => previousPage(form.slug)}
                  >
                    <I18n>Previous</I18n>
                  </li>
                )}
                <li className="page-item disabled">
                  {nextPageToken || currentPage >= 2 ? currentPage : ''}
                </li>
                {nextPageToken && (
                  <li
                    className="page-item disabled"
                    onClick={() => nextPage(form.slug)}
                  >
                    <I18n>Next</I18n>
                  </li>
                )}
              </ul>
            </div>
            {!!filter.visible && (
              <Modal
                size="lg"
                isOpen={!!filter.visible}
                toggle={() => setFilter({ ...filter, visible: false })}
              >
                <div className="modal-header">
                  <h4 className="modal-title">
                    <button
                      onClick={() =>
                        setFilter({
                          ...filter,
                          visible: false,
                        })
                      }
                      type="button"
                      className="btn btn-link"
                    >
                      <I18n>Cancel</I18n>
                    </button>
                    <span>
                      <I18n>Filter Records</I18n>
                    </span>
                  </h4>
                </div>
                <div className="modal-body">
                  <div className="modal-form">
                    <div className="form-group required">
                      <label htmlFor="name">
                        <I18n>Filter By Properties</I18n>
                      </label>
                      {filter.properties &&
                        Object.keys(filter.properties).map(key => (
                          <div className="form-group" key={key}>
                            <label htmlFor={filter.properties[key].name}>
                              <I18n>{filter.properties[key].label}</I18n>
                            </label>
                            <div className="input-group">
                              <input
                                name={key}
                                value={filter.properties[key].value}
                                type="text"
                                className="form-control"
                                onChange={event =>
                                  setFilter({
                                    ...filter,
                                    properties: {
                                      ...filter.properties,
                                      [key]: {
                                        ...filter.properties[key],
                                        value: event.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                              <div className="input-group-append">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    removeFilter('properties', key);
                                    setProperty({ name: '' });
                                  }}
                                >
                                  <i className="fa fa-times fa-lg" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      <div className="input-group">
                        <I18n
                          render={translate => (
                            <select
                              name="properties"
                              value={property.name}
                              className="form-control"
                              onChange={event => {
                                setProperty({
                                  name: event.target.value,
                                  label:
                                    event.target[event.target.selectedIndex]
                                      .text,
                                });
                              }}
                            >
                              <option />
                              <option
                                value="handle"
                                disabled={
                                  filter.properties.handle !== undefined
                                }
                              >
                                {translate('Handle')}
                              </option>
                              <option
                                value="submittedBy"
                                disabled={
                                  filter.properties.submittedBy !== undefined
                                }
                              >
                                {translate('Submitted By')}
                              </option>
                            </select>
                          )}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setFilter({
                                ...filter,
                                properties: {
                                  ...filter.properties,
                                  [property.name]: {
                                    name: property.name,
                                    label: property.label,
                                    value: '',
                                  },
                                },
                              });
                              setProperty({ name: '' });
                            }}
                          >
                            <i className="fa fa-plus fa-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">
                        <I18n>Filter by Values</I18n>
                      </label>
                      {filter.values &&
                        Object.keys(filter.values).map(key => (
                          <div className="form-group" key={key}>
                            <label htmlFor={filter.values[key].name}>
                              <I18n>{filter.values[key].label}</I18n>
                            </label>
                            <div className="input-group">
                              <input
                                name={key}
                                value={filter.values[key].value}
                                type="text"
                                className="form-control"
                                onChange={event =>
                                  setFilter({
                                    ...filter,
                                    values: {
                                      ...filter.values,
                                      [key]: {
                                        ...filter.values[key],
                                        value: event.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                              <div className="input-group-append">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    removeFilter('values', key);
                                    setFieldValue({ name: '' });
                                  }}
                                >
                                  <i className="fa fa-times fa-lg" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      <div className="input-group">
                        <I18n
                          context={`kapps.${kapp.slug}.forms.${form.slug}`}
                          render={translate => (
                            <select
                              name="values"
                              value={fieldValue.name}
                              className="form-control"
                              onChange={event => {
                                setFieldValue({
                                  name: event.target.value,
                                  label:
                                    event.target[event.target.selectedIndex]
                                      .text,
                                });
                              }}
                            >
                              <option />
                              {form.fields.map(field => (
                                <option
                                  key={field.name}
                                  value={field.name}
                                  disabled={
                                    filter.values[field.name] !== undefined
                                  }
                                >
                                  {translate(field.name)}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setFilter({
                                ...filter,
                                values: {
                                  ...filter.values,
                                  [fieldValue.name]: {
                                    name: fieldValue.name,
                                    label: fieldValue.label,
                                    value: '',
                                  },
                                },
                              });
                              setFieldValue({ name: '' });
                            }}
                          >
                            <i className="fa fa-plus fa-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {filter.error && (
                      <div className="alert alert-danger">
                        <I18n>{filter.error}</I18n>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      onClick={event => filterColumns(form.slug)}
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        Object.keys(filter.properties).filter(
                          property => !filter.properties[property].value,
                        ).length > 0 ||
                        Object.keys(filter.values).filter(
                          value => !filter.values[value].value,
                        ).length > 0
                      }
                    >
                      <I18n>Apply</I18n>
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </section>
        </div>
      </div>
      <ExportModal
        form={form}
        filter={filter}
        createSearchQuery={createSearchQuery}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  nextPageToken: state.settingsForms.nextPageToken,
  submissionsLoading: state.settingsForms.submissionsLoading,
  submissions: state.settingsForms.currentFormSubmissions,
  clientSortInfo: state.settingsForms.clientSortInfo,
  path: state.router.location.pathname.replace(/\/$/, ''),
  isMobile: state.app.layoutSize === 'small',
  downloaded: state.settingsForms.downloaded,
  appLocation: state.app.location,
});

const mapDispatchToProps = {
  fetchFormSubmissions: actions.fetchFormSubmissions,
  setClientSortInfo: actions.setClientSortInfo,
  openModal: actions.openModal,
  setDownloaded: actions.setDownloaded,
};

export const FormDetails = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    submissionColumns: buildFormConfigurationObject(props.form).columns,
  })),
  withState('previousPageTokens', 'setPreviousPageToken', []),
  withState('currentPage', 'setCurrentPage', 1),
  withState('openDropdown', 'setOpenDropdown', ''),
  withState('visibleFields', 'setVisibleFields', {}),
  withState('filter', 'setFilter', {
    visible: false,
    properties: {},
    values: {},
  }),
  withState('property', 'setProperty', {}),
  withState('fieldValue', 'setFieldValue', {}),
  withState('optionsOpen', 'setOptionsOpen', false),
  withHandlers({
    toggleDropdown,
    filterColumns,
    removeFilter,
    nextPage,
    previousPage,
    sortTable,
  }),
  lifecycle({
    componentWillMount() {
      this.props.setClientSortInfo(null);
      this.props.fetchFormSubmissions({
        formSlug: this.props.form.slug,
        kappSlug: this.props.kapp.slug,
        pageToken: this.props.nextPageToken,
      });
    },
  }),
)(FormDetailsComponent);
