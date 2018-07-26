import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { PageTitle } from 'common';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
} from 'reactstrap';
import { actions } from '../../../redux/modules/settingsForms';

// Create q for search from filter object
const createSearchQuery = filter => {
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
}) => formSlug => {
  const q = createSearchQuery(filter);

  fetchFormSubmissions({
    formSlug: formSlug,
    kappSlug: kappSlug,
    q,
  });
  setCurrentPage(1);
  setFilter({ ...filter, visible: false });
};

// Removes a single filter from the object
const removeFilter = ({ filter, setFilter }) => (type, remove) => {
  const newFilters = {};
  for (const key in filter[type]) {
    if (key !== remove) {
      newFilters[key] = filter[type][key];
    }
  }
  setFilter({ ...filter, [type]: { ...newFilters } });
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

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
}) =>
  !loading && (
    <div>
      <PageTitle parts={['Services Settings']} />
      <div className="page-container  page-container--space-settings">
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/kapps/services">services</Link> /{` `}
                <Link to="/kapps/services/settings">settings</Link> /{` `}
                <Link to="/kapps/services/settings/forms">forms</Link> /{` `}
              </h3>
              <h1>{form.name}</h1>
            </div>
          </div>
          <section>
            <div className="settings-flex">
              <div className="col-sm-12">
                <label>Description</label>
                <p>{form.description}</p>
              </div>
              <div className="col-sm-6">
                <label>Form Type</label>
                <p>{form.type}</p>
              </div>
              <div className="col-sm-6">
                <label>Form Status</label>
                <p>{form.status}</p>
              </div>
              <div className="col-sm-6">
                <label>Created</label>
                <p>
                  {moment(form.createdAt).fromNow()} by {form.createdBy}
                </p>
              </div>
              <div className="col-sm-6">
                <label>Updated</label>
                <p>
                  {moment(form.updatedAt).fromNow()} by {form.updatedBy}
                </p>
              </div>
              <Dropdown
                toggle={toggleDropdown(form.slug)}
                isOpen={openDropdown === form.slug}
                className="col-sm-6"
              >
                <DropdownToggle color="primary">
                  Toggle Value Columns <span className="fa fa-caret-down" />
                </DropdownToggle>
                <DropdownMenu>
                  {form.fields.map((field, idx) => (
                    <DropdownItem>
                      <input
                        type="checkbox"
                        name="view-fields"
                        id={`view-fields-${idx}`}
                        value={field.name}
                        checked={visibleFields[field.name]}
                        onChange={event =>
                          setVisibleFields({
                            ...visibleFields,
                            [field.name]: !visibleFields[field.name]
                              ? true
                              : false,
                          })
                        }
                      />{' '}
                      <label htmlFor={`view-fields-${idx}`}>{field.name}</label>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <div className="col-sm-6">
                <button
                  className="btn btn-primary pull-right"
                  onClick={() => setFilter({ ...filter, visible: true })}
                >
                  <i className="fa fa-filter fa-lg" />
                </button>
              </div>
            </div>
            <div>
              <table className="table table-sm table-striped table-datastore table-submissions">
                <thead className="header">
                  <tr>
                    <th width="15%">Confirmation #</th>
                    <th width="35%">Submission Label</th>
                    <th width="10%">Status</th>
                    <th width="40%">Submitted</th>
                    {form.fields.map(field => (
                      <th
                        className={!visibleFields[field.name] ? 'hidden' : ''}
                      >
                        {field.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                {!submissionsLoading && (
                  <tbody>
                    {submissions.map(submission => {
                      return (
                        <tr key={submission.id}>
                          <td>{submission.handle}</td>
                          <td>{submission.label}</td>
                          <td>{submission.values.Status}</td>
                          <td>
                            {moment(submission.submittedAt).fromNow()} by{' '}
                            {submission.submittedBy}
                          </td>
                          {form.fields.map(field => (
                            <td
                              className={
                                !visibleFields[field.name] ? 'hidden' : ''
                              }
                            >
                              {submission.values[field.name]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
              <ul className="pull-right">
                {currentPage >= 2 && (
                  <li
                    className="btn btn-primary"
                    onClick={() => previousPage(form.slug)}
                  >
                    Previous
                  </li>
                )}
                <li className="btn btn-default">
                  {nextPageToken || currentPage >= 2 ? currentPage : ''}
                </li>
                {nextPageToken && (
                  <li
                    className="btn btn-primary"
                    onClick={() => nextPage(form.slug)}
                  >
                    Next
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
                      onClick={() => setFilter({ ...filter, visible: false })}
                      type="button"
                      className="btn btn-link"
                    >
                      Cancel
                    </button>
                  </h4>
                </div>
                <div className="modal-body">
                  <div className="modal-form">
                    <div className="form-group required">
                      <label htmlFor="name">Filter By Properties</label>
                      {filter.properties &&
                        Object.keys(filter.properties).map(key => (
                          <div className="form-group">
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
                        <select
                          name="properties"
                          value={property.name}
                          className="form-control"
                          onChange={event => {
                            setProperty({
                              name: event.target.value,
                              label:
                                event.target[event.target.selectedIndex].text,
                            });
                          }}
                        >
                          <option />
                          <option
                            value="handle"
                            disabled={filter.properties.handle !== undefined}
                          >
                            Handle
                          </option>
                          <option
                            value="submittedBy"
                            disabled={
                              filter.properties.submittedBy !== undefined
                            }
                          >
                            Submitted By
                          </option>
                        </select>
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
                      <label htmlFor="name">Filter by Values</label>
                      {filter.values &&
                        Object.keys(filter.values).map(key => (
                          <div className="form-group">
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
                              value={field.name}
                              disabled={filter.values[field.name] !== undefined}
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
                      <div className="alert alert-danger">{filter.error}</div>
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
                      Apply
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </section>
        </div>
      </div>
    </div>
  );

const mapStateToProps = (state, { match: { params } }) => ({
  form: state.services.settingsForms.currentForm,
  kappSlug: state.app.config.kappSlug,
  loading: state.services.settingsForms.loading,
  nextPageToken: state.services.settingsForms.nextPageToken,
  submissionsLoading: state.services.settingsForms.submissionsLoading,
  submissions: state.services.settingsForms.currentFormSubmissions,
});

const mapDispatchToProps = {
  fetchFormSettings: actions.fetchForm,
  fetchFormSubmissions: actions.fetchFormSubmissions,
  fetchKapp: actions.fetchKapp,
};

export const FormSubmissions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inputs', 'setInputs', {}),
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
  withHandlers({
    toggleDropdown,
    filterColumns,
    removeFilter,
    nextPage,
    previousPage,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchFormSettings({
        formSlug: this.props.match.params.id,
        kappSlug: this.props.kappSlug,
      });
      this.props.fetchFormSubmissions({
        formSlug: this.props.match.params.id,
        kappSlug: this.props.kappSlug,
        pageToken: this.props.nextPageToken,
      });
    },
  }),
)(FormSubmissionsContainer);
