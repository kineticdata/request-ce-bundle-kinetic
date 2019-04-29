import React from 'react';
import moment from 'moment';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { Modal } from 'reactstrap';
import { SubmissionListItem } from './SubmissionListItem';
import { ExportModal } from './ExportModal';
import { actions } from '../../../redux/modules/settingsForms';
import { I18n } from '@kineticdata/react';
import { context } from '../../../redux/store';
import { PageTitle } from '../../shared/PageTitle';

const DiscussionIcon = () => (
  <span className="icon">
    <span
      className="fa fa-fw fa-comments"
      style={{
        color: 'rgb(9, 84, 130)',
        fontSize: '16px',
      }}
    />
  </span>
);

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
  kappSlug,
  setCurrentPage,
  filter,
}) => formSlug => {
  !previousPageTokens.includes(nextPageToken) &&
    setPreviousPageToken([...previousPageTokens, nextPageToken]);

  const q = createSearchQuery(filter);

  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kappSlug,
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
  kappSlug,
  setCurrentPage,
  filter,
}) => formSlug => {
  const q = createSearchQuery(filter);
  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kappSlug,
    pageToken: previousPageTokens[currentPage],
    q: q,
  });
  setCurrentPage(currentPage - 1);
};

// Used to apply filter to submission results
const filterColumns = ({
  fetchFormSubmissions,
  kappSlug,
  setCurrentPage,
  filter,
  setFilter,
  setDownloaded,
}) => formSlug => {
  const q = createSearchQuery(filter);

  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kappSlug,
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

export const FormSubmissionsContainer = ({
  loading,
  form,
  submissionsLoading,
  submissions,
  nextPageToken,
  currentPage,
  previousPageTokens,
  setPreviousPageToken,
  fetchFormSubmissions,
  submissionColumns,
  clientSortInfo,
  kappSlug,
  formSlug,
  setCurrentPage,
  openDropdown,
  toggleDropdown,
  visibleFields,
  setVisibleFields,
  setFilter,
  filter,
  filterColumns,
  property,
  setProperty,
  fieldValue,
  setFieldValue,
  removeFilter,
  nextPage,
  previousPage,
  path,
  isMobile,
  sortTable,
  openModal,
  optionsOpen,
  setOptionsOpen,
}) => {
  const visibleColumns = submissionColumns.filter(c => c.visible);
  return (
    !loading &&
    form && (
      <div>
        <PageTitle parts={['Queue Settings']} />
        <div className="page-container  page-container--space-settings">
          <div className="page-panel">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="../../..">
                    <I18n>queue</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../..">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="..">
                    <I18n>forms</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                    {form.name}
                  </I18n>
                </h1>
              </div>
            </div>
            <div className="submission-meta">
              <div className="page-container">
                <div className="data-list-row">
                  <div className="data-list-row__col">
                    <dl>
                      <dt>
                        <I18n>Form Type</I18n>
                      </dt>
                      <dd className="text-truncate">{form.type}</dd>
                    </dl>
                  </div>
                  <div className="data-list-row__col">
                    <dl>
                      <dt>
                        <I18n>Form Status</I18n>
                      </dt>
                      <dd className="text-truncate">{form.status}</dd>
                    </dl>
                  </div>
                  <div className="data-list-row__col">
                    <dl>
                      <dt>
                        <I18n>Created</I18n>
                      </dt>
                      <dd className="text-truncate">
                        <span className="time-ago">
                          {moment(form.createdAt).fromNow()}
                        </span>
                        <br />
                        <small>
                          <I18n>by</I18n> {form.createdBy}
                        </small>
                      </dd>
                    </dl>
                  </div>
                  <div className="data-list-row__col">
                    <dl>
                      <dt>
                        <I18n>Updated</I18n>
                      </dt>
                      <dd className="text-truncate">
                        <span className="time-ago">
                          {moment(form.updatedAt).fromNow()}
                        </span>
                        <br />
                        <small>
                          <I18n>by</I18n> {form.updatedBy}
                        </small>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <section>
              <div className="settings-flex row">
                <div className="col-md-12">
                  {form.description && (
                    <p className="text-truncate">
                      <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                        {form.description}
                      </I18n>
                    </p>
                  )}
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
                <table className="table table-sm table-striped settings-table">
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
                            key={`thead-${c.type}-${c.name}`}
                            className={`d-sm-none d-md-table-cell
                              ${sortClass}
                              ${isDiscussionIdField ? 'sort-disabled' : ''}`}
                            onClick={e => sortTable(c)}
                          >
                            {isDiscussionIdField ? (
                              <DiscussionIcon />
                            ) : (
                              <I18n>{c.label}</I18n>
                            )}
                          </th>
                        );
                      })}
                      <th className="sort-disabled" />
                    </tr>
                  </thead>
                  <thead className="d-md-none">
                    <tr>
                      <th>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <I18n>Sort By</I18n>
                            </span>
                          </div>
                          <I18n
                            render={translate => (
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
                                      <option
                                        key={`${c.name}::${c.type}`}
                                        value={`${c.name}::${c.type}`}
                                      >
                                        {translate(c.label)}
                                      </option>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </select>
                            )}
                          />
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
                                  <option value="ASC">
                                    {translate('Asc')}
                                  </option>
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
                            to={`../${s.id}/activity`}
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
                                {filter.properties[key].label}
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
                                {filter.values[key].label}
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
                          <select
                            name="values"
                            value={fieldValue.name}
                            className="form-control"
                            onChange={event => {
                              setFieldValue({
                                name: event.target.value,
                                label:
                                  event.target[event.target.selectedIndex].text,
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
                                {field.name}
                              </option>
                            ))}
                          </select>
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
        <ExportModal filter={filter} createSearchQuery={createSearchQuery} />
      </div>
    )
  );
};

const mapStateToProps = state => ({
  form: state.settingsForms.currentForm,
  kappSlug: state.app.kappSlug,
  loading: state.settingsForms.loading,
  nextPageToken: state.settingsForms.nextPageToken,
  submissionsLoading: state.settingsForms.submissionsLoading,
  submissions: state.settingsForms.currentFormSubmissions,
  submissionColumns: state.settingsForms.submissionColumns,
  clientSortInfo: state.settingsForms.clientSortInfo,
  path: state.router.location.pathname.replace(/\/$/, ''),
  isMobile: state.app.layoutSize === 'small',
  downloaded: state.settingsForms.downloaded,
});

const mapDispatchToProps = {
  fetchFormSettings: actions.fetchForm,
  fetchFormSubmissions: actions.fetchFormSubmissions,
  fetchKapp: actions.fetchKapp,
  setClientSortInfo: actions.setClientSortInfo,
  openModal: actions.openModal,
  setDownloaded: actions.setDownloaded,
};

export const FormSubmissions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
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
      this.props.fetchFormSettings({
        formSlug: this.props.id,
        kappSlug: this.props.kappSlug,
      });
      this.props.fetchFormSubmissions({
        formSlug: this.props.id,
        kappSlug: this.props.kappSlug,
        pageToken: this.props.nextPageToken,
      });
    },
  }),
)(FormSubmissionsContainer);
