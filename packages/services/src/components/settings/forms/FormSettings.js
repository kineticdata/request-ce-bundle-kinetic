import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsForms';
import { actions as servicesActions } from '../../../redux/modules/settingsServices';

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
}) =>
  !loading &&
  !kappLoading &&
  !loadingTeams &&
  !loadingServices &&
  !notificationsLoading && (
    <div>
      <PageTitle parts={['Services Settings']} />
      <div className="page-container page-container--space-settings">
        <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> /{` `}
                <Link to="/settings">settings</Link> /{` `}
              </h3>
              <h1>{form.name} Settings</h1>
            </div>
          </div>
          <section>
            <form>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control col-8"
                  name="description"
                  value={inputs.description}
                  type="text"
                  onChange={event =>
                    setInputs({ ...inputs, description: event.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Form Type</label>
                <select
                  className="form-control col-8"
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
                <label>Form Status</label>
                <select
                  className="form-control col-8"
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
              <div className="form-group">
                <label>Icon</label>
                <TextInput
                  value={inputs.icon}
                  name="icon"
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>
              <div className="form-group">
                <label>Owning Team</label>
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
                <label className="field-label">Approver</label>
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
                    className="form-control"
                    value="None"
                    onChange={event =>
                      setInputs({ ...inputs, Approver: event.target.value })
                    }
                  />
                  None
                </label>
                <label htmlFor="approver-manager">
                  <input
                    type="radio"
                    checked={inputs['Approver'] === 'Manager'}
                    name="Approver"
                    id="approver-manager"
                    className="form-control"
                    value="Manager"
                    onChange={event =>
                      setInputs({ ...inputs, Approver: event.target.value })
                    }
                  />
                  Manager
                </label>
                <label htmlFor="approver-team">
                  <input
                    type="radio"
                    checked={inputs['Approver'] === 'Team'}
                    name="Approver"
                    id="approver-team"
                    className="form-control"
                    value="Team"
                    onChange={event =>
                      setInputs({ ...inputs, Approver: event.target.value })
                    }
                  />
                  Team
                </label>
                <label htmlFor="approver-individual">
                  <input
                    type="radio"
                    checked={inputs['Approver'] === 'Individual'}
                    name="Approver"
                    id="approver-individual"
                    className="form-control"
                    value="Individual"
                    onChange={event =>
                      setInputs({ ...inputs, Approver: event.target.value })
                    }
                  />
                  Individual
                </label>
              </div>

              <div className="form-group">
                <label>Approval Form</label>
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
                <label>Notification Template Name - Complete</label>
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
                <label>Notification Template Name - Create</label>
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
                <label>Service Days Due</label>
                <NumberInput
                  value={inputs['Service Days Due']}
                  name="Service Days Due"
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>

              <div className="form-group">
                <label>Task Assignee Team</label>
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
                <label>Task Form</label>
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
              <div className="form-group checkbox">
                <label className="field-label">Categories</label>
                {settingsForms.servicesKapp.categories.map(val => (
                  <label
                    key={`categories-${val.slug}`}
                    htmlFor={`categories-${val.slug}`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        inputs.categories &&
                        inputs.categories.filter(
                          category => category.category.slug === val.slug,
                        ).length > 0
                      }
                      key={`categories-${val.slug}`}
                      name="categories"
                      id={`categories-${val.slug}`}
                      className="form-control"
                      value={val.slug}
                      onChange={event => {
                        let categories = inputs.categories;
                        event.target.checked
                          ? categories.push({
                              category: { slug: event.target.value },
                            })
                          : (categories = categories.filter(
                              category =>
                                category.category.slug !== event.target.value,
                            ));
                        setInputs({
                          ...inputs,
                          categories: categories,
                        });
                      }}
                    />
                    {val.name}
                  </label>
                ))}
              </div>
            </form>
            <div className="form__footer">
              <span className="form__footer__right">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const newObj = { form, inputs, kappSlug };
                    updateFormSettings(newObj);
                  }}
                >
                  Save
                </button>
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

export const setInitialInputs = ({ setInputs, form }) => () => {
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
  });
};

const mapStateToProps = (state, { match: { params } }) => ({
  form: state.services.settingsForms.currentForm,
  formChanges: state.services.settingsForms.currentFormChanges,
  loading: state.services.settingsForms.loading,
  kappLoading: state.services.settingsForms.kappLoading,
  notificationsLoading: state.services.settingsForms.notificationsLoading,
  notifications: state.services.settingsForms.notifications,
  settingsForms: state.services.settingsForms,
  servicesSettings: state.services.servicesSettings,
  kappSlug: state.app.config.kappSlug,
});

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
  withHandlers({ setInitialInputs }),
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
