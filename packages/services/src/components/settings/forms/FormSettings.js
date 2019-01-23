import React from 'react';
import { Link } from 'react-router-dom';
import { bundle } from 'react-kinetic-core';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PageTitle } from 'common';
import {
  actions,
  buildFormConfigurationObject,
} from '../../../redux/modules/settingsForms';
import { actions as servicesActions } from '../../../redux/modules/settingsServices';
import { I18n } from '../../../../../app/src/I18nProvider';

export const TextInput = ({ value, name, setInputs, inputs, className }) => (
  <input
    className={`form-control ${className}`}
    name={name}
    value={value || ''}
    type="text"
    onChange={event => {
      setInputs({ ...inputs, [name]: event.target.value });
    }}
  />
);
export const NumberInput = ({ value, name, setInputs, inputs, className }) => (
  <input
    className={`form-control ${className}`}
    name={name}
    value={value || ''}
    type="number"
    onChange={event => setInputs({ ...inputs, [name]: event.target.value })}
  />
);
export const Select = ({
  selected,
  name,
  type,
  data,
  setInputs,
  inputs,
  className,
  multiple,
}) => {
  let optionElements = '<option></option>';
  let options;
  if (data) {
    if (type === 'teams') {
      options = data.filter(team => !team.name.includes('Role')).map(team => {
        return { value: team.name, label: team.name };
      });
    } else if (type === 'notifications') {
      options = data.map(notification => {
        return {
          value: notification.values.Name,
          label: notification.values.Name,
        };
      });
    } else {
      options = data.kapps.find(kapp => kapp.slug === type).forms.map(form => {
        return { value: form.slug, label: form.name };
      });
    }
    optionElements = options.map(option => {
      const kappName = type.charAt(0).toUpperCase() + type.slice(1);
      return (
        <option key={option.value} value={option.value}>
          {kappName} > {option.label}
        </option>
      );
    });
  }
  return (
    <select
      className={`form-control ${className}`}
      name={name}
      value={selected}
      onChange={event => {
        let value = event.target.value;
        if (multiple) {
          const options = event.target.options;
          value = [];
          for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
              value.push(options[i].value);
            }
          }
        }
        setInputs({ ...inputs, [name]: value });
      }}
      multiple={multiple}
    >
      <option />
      {optionElements}
    </select>
  );
};

export const FormContainer = ({
  updateFormSettings,
  inputs,
  setInputs,
  categoryInput,
  handleCategoryInput,
  handleAddCategory,
  handleRemoveCategory,
  categoryDefinitions,
  availableCategories,
  loading,
  form,
  kappLoading,
  settingsForms,
  servicesSettings: {
    servicesSettingsKapp: kapp,
    loading: loadingServices,
    loadingTeams,
    teams,
    spaceKapps,
  },
  kappSlug,
  notificationsLoading,
  notifications,
  handleColumnOrderChange,
  handleColumnChange,
}) =>
  !loading &&
  !kappLoading &&
  !loadingTeams &&
  !loadingServices &&
  !notificationsLoading &&
  form && (
    <div className="page-container page-container--panels page-container--datastore">
      <PageTitle parts={['Settings', form.name]} />
      <div className="page-panel page-panel--two-thirds page-panel--scrollable">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to={`/kapps/${kappSlug}`}>
                <I18n>services</I18n>
              </Link>{' '}
              /{` `}
              <Link to={`/kapps/${kappSlug}/settings`}>
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
              <Link to={`/kapps/${kappSlug}/settings/forms`}>
                <I18n>forms</I18n>
              </Link>{' '}
              /{` `}
              <Link to={`/kapps/${kappSlug}/settings/forms/${form.slug}`}>
                <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                  {form.name}
                </I18n>
              </Link>{' '}
            </h3>
            <h1>
              <I18n>Form Settings</I18n>
            </h1>
          </div>
          <a
            href={`${bundle.spaceLocation()}/app/#/${kappSlug}/author/form/${
              form.slug
            }/builder`}
            className="btn btn-primary"
            target="blank"
          >
            <I18n>Form Builder</I18n>{' '}
            <i className="fa fa-fw fa-external-link" />
          </a>
        </div>
        <div className="general-settings">
          <h3 className="section__title">
            <I18n>General Settings</I18n>
          </h3>
          <div className="form settings">
            <div className="form-group">
              <label>
                <I18n>Description</I18n>
              </label>
              <textarea
                className="form-control col-12"
                name="description"
                value={inputs.description}
                type="text"
                onChange={event =>
                  setInputs({
                    ...inputs,
                    description: event.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>
                <I18n>Form Type</I18n>
              </label>
              <select
                className="form-control col-6"
                name="type"
                value={inputs.type}
                onChange={event =>
                  setInputs({ ...inputs, type: event.target.value })
                }
              >
                {settingsForms.servicesKapp.formTypes.map(type => (
                  <option key={type.name} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>
                <I18n>Form Status</I18n>
              </label>
              <select
                className="form-control col-6"
                name="status"
                value={inputs.status}
                onChange={event =>
                  setInputs({ ...inputs, status: event.target.value })
                }
              >
                <option key="New">New</option>
                <option key="Active">Active</option>
                <option key="Inactive">Inactive</option>
                <option key="Delete">Delete</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-display-settings">
          <h3 className="section__title">
            <I18n>Table Display Settings</I18n>
          </h3>
          <div className="form settings">
            <table className="table table--settings table-draggable">
              <thead>
                <tr className="header">
                  <th scope="col">
                    <I18n>Field</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Visible in Table</I18n>
                  </th>
                </tr>
              </thead>
              {inputs.columns && (
                <DragDropContext onDragEnd={handleColumnOrderChange}>
                  <Droppable droppableId="columns">
                    {provided => (
                      <tbody ref={provided.innerRef}>
                        {inputs.columns.map((col, index) => (
                          <Draggable
                            key={col.name}
                            draggableId={col.name}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${
                                  snapshot.isDragging ? 'dragging' : ''
                                }`}
                              >
                                <td scope="row">
                                  {col.type === 'value' ? (
                                    <I18n>{col.label}</I18n>
                                  ) : (
                                    <i>
                                      <I18n>{col.label}</I18n>{' '}
                                      <small>
                                        <I18n>(system field)</I18n>
                                      </small>
                                    </i>
                                  )}
                                </td>
                                <td>
                                  <input
                                    onChange={e =>
                                      handleColumnChange(
                                        index,
                                        'visible',
                                        e.target.checked,
                                      )
                                    }
                                    type="checkbox"
                                    checked={col.visible}
                                  />
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                      </tbody>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </table>
          </div>
        </div>
        <div className="attribute-settings">
          <h3 className="section__title">
            <I18n>Attributes</I18n>
          </h3>
          <div className="form settings">
            <div className="form-group">
              <label>
                <I18n>Icon</I18n>
              </label>
              <TextInput
                value={inputs.icon}
                name="icon"
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
              />
            </div>
            <div className="form-group">
              <label>
                <I18n>Owning Team</I18n>
              </label>
              <Select
                selected={inputs['Owning Team']}
                name="Owning Team"
                type="teams"
                data={teams}
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
                multiple="true"
              />
            </div>
            <div className="form-group radio">
              <label className="field-label">
                <I18n>Approver</I18n>
              </label>
              <label htmlFor="approver-none">
                <input
                  type="radio"
                  checked={
                    !inputs['Approver'] ||
                    inputs['Approver'] === '' ||
                    inputs['Approver'] === 'None'
                  }
                  name="Approver"
                  id="approver-none"
                  value="None"
                  onChange={event =>
                    setInputs({ ...inputs, Approver: event.target.value })
                  }
                />
                <I18n>None</I18n>
              </label>
              <label htmlFor="approver-manager">
                <input
                  type="radio"
                  checked={inputs['Approver'] === 'Manager'}
                  name="Approver"
                  id="approver-manager"
                  value="Manager"
                  onChange={event =>
                    setInputs({ ...inputs, Approver: event.target.value })
                  }
                />
                <I18n>Manager</I18n>
              </label>
              <label htmlFor="approver-team">
                <input
                  type="radio"
                  checked={inputs['Approver'] === 'Team'}
                  name="Approver"
                  id="approver-team"
                  value="Team"
                  onChange={event =>
                    setInputs({ ...inputs, Approver: event.target.value })
                  }
                />
                <I18n>Team</I18n>
              </label>
              <label htmlFor="approver-individual">
                <input
                  type="radio"
                  checked={inputs['Approver'] === 'Individual'}
                  name="Approver"
                  id="approver-individual"
                  value="Individual"
                  onChange={event =>
                    setInputs({ ...inputs, Approver: event.target.value })
                  }
                />
                <I18n>Individual</I18n>
              </label>
            </div>

            <div className="form-group">
              <label>
                <I18n>Approval Form</I18n>
              </label>
              <Select
                selected={inputs['Approval Form Slug']}
                name="Approval Form Slug"
                type="queue"
                data={spaceKapps}
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
              />
            </div>

            <div className="form-group">
              <label>
                <I18n>Notification Template Name - Complete</I18n>
              </label>
              <Select
                selected={inputs['Notification Template Name - Complete']}
                name="Notification Template Name - Complete"
                type="notifications"
                data={notifications}
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
              />
            </div>

            <div className="form-group">
              <label>
                <I18n>Notification Template Name - Create</I18n>
              </label>
              <Select
                selected={inputs['Notification Template Name - Create']}
                name="Notification Template Name - Create"
                type="notifications"
                data={notifications}
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
              />
            </div>

            <div className="form-group">
              <label>
                <I18n>Service Days Due</I18n>
              </label>
              <NumberInput
                value={inputs['Service Days Due']}
                name="Service Days Due"
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
              />
            </div>

            <div className="form-group">
              <label>
                <I18n>Task Assignee Team</I18n>
              </label>
              <Select
                selected={inputs['Task Assignee Team']}
                name="Task Assignee Team"
                type="teams"
                data={teams}
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
              />
            </div>

            <div className="form-group">
              <label>
                <I18n>Task Form</I18n>
              </label>
              <Select
                selected={inputs['Task Form Slug']}
                name="Task Form Slug"
                type="queue"
                data={spaceKapps}
                setInputs={setInputs}
                inputs={inputs}
                className="col-8"
              />
            </div>
          </div>
        </div>
        <div className="category-settings">
          <h3 className="section__title">
            <I18n>Categories</I18n>
          </h3>
          <div className="form settings">
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th scope="col">
                    <I18n>Category</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Slug</I18n>
                  </th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {categoryDefinitions
                  .filter(c =>
                    inputs.categories.find(fc => fc.category.slug === c.slug),
                  )
                  .map(val => (
                    <tr key={val.slug}>
                      <td scope="row">{val.name}</td>
                      <td>{val.slug}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger pull-right"
                          type="button"
                          onClick={handleRemoveCategory(val)}
                        >
                          <span className="fa fa-times fa-fw" />
                        </button>
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td scope="row" colSpan="2">
                    <select
                      className="form-control form-control-sm"
                      onChange={handleCategoryInput}
                      value={categoryInput}
                    >
                      <option label="" value="" />
                      {categoryDefinitions
                        .filter(
                          c =>
                            !inputs.categories.find(
                              fc => fc.category.slug === c.slug,
                            ),
                        )
                        .map(val => (
                          <option
                            key={val.slug}
                            label={val.name}
                            value={val.slug}
                          >
                            {val.name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-success pull-right"
                      disabled={categoryInput === null || categoryInput === ''}
                      onClick={handleAddCategory}
                    >
                      <span className="fa fa-plus fa-fw fa-inverse" />
                      <I18n>Add Category</I18n>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="form__footer">
          <span className="form__footer__right">
            <Link
              to="/kapps/services/settings/forms"
              className="btn btn-link mb-0"
            >
              <I18n>Cancel</I18n>
            </Link>
            <button
              className="btn btn-primary"
              onClick={() => {
                const newObj = { form, inputs, kappSlug };
                updateFormSettings(newObj);
              }}
            >
              <I18n>Save Changes</I18n>
            </button>
          </span>
        </div>
      </div>
      <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--datastore-sidebar">
        <h3>
          <I18n>Form Settings</I18n>
        </h3>
        <h4>
          <I18n>General Settings</I18n>
        </h4>
        <p>
          <I18n>
            To update the form fields, click the Form Builder button, which will
            open the form builder in a new window. You will need to reload this
            page after making changes in the form builder.
          </I18n>
        </p>
        <h4>
          <I18n>Table Display Settings</I18n>
        </h4>
        <p>
          <I18n>
            The Display Table Settings section lists all of the fields that
            exist on this form. You may select which fields you'd like to be
            visible in the table when viewing records.
          </I18n>
        </p>
        <h4>
          <I18n>Categories</I18n>
        </h4>
        <p>
          <I18n>
            You can update the categories associated with this form by checking
            them off in the Category Settings area.
          </I18n>
        </p>
      </div>
    </div>
  );

export const setInitialInputs = ({ setInputs, form }) => () => {
  const config = buildFormConfigurationObject(form);
  setInputs({
    description: form.description,
    type: form.type,
    status: form.status,
    icon: form.attributesMap.Icon[0] ? form.attributesMap.Icon[0] : '',
    categories: form.categorizations ? form.categorizations : [],
    'Owning Team': form.attributesMap['Owning Team']
      ? form.attributesMap['Owning Team']
      : '',
    Approver: form.attributesMap['Approver']
      ? form.attributesMap['Approver'][0]
      : '',
    'Approval Form Slug': form.attributesMap['Approval Form Slug']
      ? form.attributesMap['Approval Form Slug'][0]
      : '',
    'Service Days Due': form.attributesMap['Service Days Due']
      ? form.attributesMap['Service Days Due'][0]
      : '',
    'Task Form Slug': form.attributesMap['Task Form Slug']
      ? form.attributesMap['Task Form Slug'][0]
      : '',
    'Task Assignee Team': form.attributesMap['Task Assignee Team']
      ? form.attributesMap['Task Assignee Team'][0]
      : '',
    'Notification Template Name - Complete': form.attributesMap[
      'Notification Template Name - Complete'
    ]
      ? form.attributesMap['Notification Template Name - Complete'][0]
      : '',
    'Notification Template Name - Create': form.attributesMap[
      'Notification Template Name - Create'
    ]
      ? form.attributesMap['Notification Template Name - Create'][0]
      : '',
    columns: config.columns,
  });
};

const handleCategoryInput = ({ setCategoryInput }) => e =>
  setCategoryInput(e.target.value);

const handleAddCategory = ({
  setCategoryInput,
  categoryInput,
  inputs,
  setInputs,
}) => () => {
  const categorization = { category: { slug: categoryInput } };
  const categorizations = [categorization, ...inputs.categories];
  setInputs({
    ...inputs,
    categories: categorizations,
  });
  setCategoryInput('');
};

const handleRemoveCategory = ({ inputs, setInputs }) => category => () => {
  setInputs({
    ...inputs,
    categories: inputs.categories.filter(
      c => c.category.slug !== category.slug,
    ),
  });
};

const handleColumnOrderChange = ({ setInputs, inputs }) => ({
  source,
  destination,
}) => {
  if (destination && source.index !== destination.index) {
    const updated = inputs.columns.update(cols => {
      const col = cols.get(source.index);
      return cols.delete(source.index).insert(destination.index, col);
    });
    setInputs({ ...inputs, columns: updated });
  }
};

const handleColumnChange = ({ setInputs, inputs }) => (index, prop, value) => {
  const updated = inputs.columns.setIn([index, prop], value);
  setInputs({ ...inputs, columns: updated });
};

const mapStateToProps = (state, { match: { params } }) => {
  const formCategorizations = state.services.settingsForms.currentForm
    ? state.services.settingsForms.currentForm.categorizations
    : [];

  const categoryDefinitions = state.services.settingsForms.servicesKapp
    ? state.services.settingsForms.servicesKapp.categories
    : [];

  return {
    form: state.services.settingsForms.currentForm,
    formChanges: state.services.settingsForms.currentFormChanges,
    loading: state.services.settingsForms.loading,
    kappLoading: state.services.settingsForms.kappLoading,
    notificationsLoading: state.services.settingsForms.notificationsLoading,
    notifications: state.services.settingsForms.notifications,
    settingsForms: state.services.settingsForms,
    servicesSettings: state.services.servicesSettings,
    kappSlug: state.app.config.kappSlug,

    categoryDefinitions,
  };
};
const mapDispatchToProps = {
  updateFormSettings: actions.updateForm,
  fetchFormSettings: actions.fetchForm,
  fetchKapp: actions.fetchKapp,
  fetchNotifications: actions.fetchNotifications,
  fetchServicesSettings: servicesActions.fetchServicesSettings,
  fetchServicesSettingsTeams: servicesActions.fetchServicesSettingsTeams,
  fetchServicesSettingsSpace: servicesActions.fetchServicesSettingsSpace,
};

export const FormSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inputs', 'setInputs', {}),
  withState('categoryInput', 'setCategoryInput', ''),
  withHandlers({
    setInitialInputs,
    handleCategoryInput,
    handleAddCategory,
    handleRemoveCategory,
    handleColumnOrderChange,
    handleColumnChange,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchFormSettings({
        formSlug: this.props.match.params.id,
        kappSlug: this.props.kappSlug,
      });
      this.props.fetchKapp(this.props.kappSlug);
      this.props.fetchNotifications();
      this.props.fetchServicesSettings();
      this.props.fetchServicesSettingsTeams();
      this.props.fetchServicesSettingsSpace();
    },
    componentWillReceiveProps(nextProps) {
      nextProps.loading === false &&
        nextProps.form !== this.props.form &&
        nextProps.setInitialInputs();
    },
  }),
)(FormContainer);
