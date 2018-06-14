import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { Utils, PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsServices';

export const TextInput = ({ value, name, setInputs, inputs, className }) => (
  <input
    className={`form-control ${className}`}
    name={name}
    value={value}
    type="text"
    onChange={event => setInputs({ ...inputs, [name]: event.target.value })}
  />
);
export const NumberInput = ({ value, name, setInputs, inputs, className }) => (
  <input
    className={`form-control ${className}`}
    name={name}
    value={value}
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
}) => {
  let optionElements = '<option></option>';
  let options;
  if (data) {
    if (type === 'teams') {
      options = data.filter(team => !team.name.includes('Role')).map(team => {
        return { value: team.name, label: team.name };
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
      onChange={event => setInputs({ ...inputs, [name]: event.target.value })}
    >
      {optionElements}
    </select>
  );
};

export const SettingsContainer = ({
  updateServicesSettings,
  inputs,
  setInputs,
  servicesSettings: {
    servicesSettingsKapp: kapp,
    loading,
    loadingTeams,
    teams,
    spaceKapps,
  },
  forms,
}) =>
  !loading &&
  !loadingTeams && (
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
              <h1>Services Settings</h1>
            </div>
          </div>
          <section>
            <form>
              {kapp.attributesMap['Approval Form Slug'] && (
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
              )}
              {kapp.attributesMap['Icon'] && (
                <div className="form-group">
                  <label>Icon</label>
                  <TextInput
                    value={inputs['Icon']}
                    name="Icon"
                    setInputs={setInputs}
                    inputs={inputs}
                    className="col-8"
                  />
                </div>
              )}
              {kapp.attributesMap['Kapp Description'] && (
                <div className="form-group">
                  <label>Kapp Description</label>
                  <TextInput
                    value={inputs['Kapp Description']}
                    name="Kapp Description"
                    setInputs={setInputs}
                    inputs={inputs}
                    className="col-8"
                  />
                </div>
              )}
              {kapp.attributesMap['Record Search History'] && (
                <div className="form-group">
                  <label>Record Search History</label>
                  <TextInput
                    value={inputs['Record Search History']}
                    name="Record Search History"
                    setInputs={setInputs}
                    inputs={inputs}
                    className="col-8"
                  />
                </div>
              )}
              {kapp.attributesMap['Service Days Due'] && (
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
              )}
              {kapp.attributesMap['Shared Bridged Resource Form Slug'] && (
                <div className="form-group">
                  <label>Shared Bridged Resource Form Slug</label>
                  <TextInput
                    value={inputs['Shared Bridged Resource Form Slug']}
                    name="Shared Bridged Resource Form Slug"
                    setInputs={setInputs}
                    inputs={inputs}
                    className="col-8"
                  />
                </div>
              )}
              {kapp.attributesMap['Task Assignee Team'] && (
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
              )}
              {kapp.attributesMap['Task Form Slug'] && (
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
              )}
            </form>
            <div className="form__footer">
              <span className="form__footer__right">
                <button
                  className="btn btn-primary"
                  onClick={() => updateServicesSettings(inputs)}
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

export const setInitialInputs = ({
  setInputs,
  servicesSettings: { servicesSettingsKapp: kapp },
}) => () =>
  setInputs({
    'Approval Form Slug': kapp.attributesMap['Approval Form Slug'][0],
    Icon: kapp.attributesMap['Icon'][0],
    'Kapp Description': kapp.attributesMap['Kapp Description'][0],
    'Record Search History': kapp.attributesMap['Record Search History'][0],
    'Service Days Due': kapp.attributesMap['Service Days Due'][0],
    'Shared Bridged Resource Form Slug':
      kapp.attributesMap['Shared Bridged Resource Form Slug'][0],
    'Task Form Slug': kapp.attributesMap['Task Form Slug'][0],
    'Task Assignee Team': kapp.attributesMap['Task Assignee Team'][0],
  });

const mapStateToProps = state => ({
  servicesSettings: state.services.servicesSettings,
  forms: state.services.forms.data,
});

const mapDispatchToProps = {
  updateServicesSettings: actions.updateServicesSettings,
  fetchServicesSettings: actions.fetchServicesSettings,
  fetchServicesSettingsTeams: actions.fetchServicesSettingsTeams,
  fetchServicesSettingsSpace: actions.fetchServicesSettingsSpace,
};

export const ServicesSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inputs', 'setInputs', {}),
  withHandlers({ setInitialInputs }),
  lifecycle({
    componentWillMount() {
      this.props.fetchServicesSettings();
      this.props.fetchServicesSettingsTeams();
      this.props.fetchServicesSettingsSpace();
    },
    componentWillReceiveProps(nextProps) {
      nextProps.servicesSettings.loading === false &&
        nextProps.servicesSettings.servicesSettingsKapp !==
          this.props.servicesSettings.servicesSettingsKapp &&
        nextProps.setInitialInputs();
    },
  }),
)(SettingsContainer);
