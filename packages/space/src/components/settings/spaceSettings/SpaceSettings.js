import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import { Utils, PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsSpace';

export const TextInput = ({ value, name, setInputs, inputs }) => (
  <input
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
      let selectedKapp = data.kapps.find(kapp => kapp.slug === type);
      options = !selectedKapp
        ? []
        : selectedKapp.forms.map(form => {
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

const mapStateToProps = state => ({
  space: state.app.space,
  spaceSettings: state.space.settingsSpace,
  teams: state.space.settingsSpace.teams,
  spaceKappsForms: state.space.settingsSpace.spaceKappsForms,
});

const mapDispatchToProps = {
  updateSpace: actions.updateSpace,
  fetchSpaceSettings: actions.fetchSpaceSettings,
  fetchSpaceSettingsTeams: actions.fetchSpaceSettingsTeams,
};

export const SettingsContainer = ({
  updateSpace,
  space,
  teams,
  spaceKappsForms,
  inputs,
  setInputs,
}) => (
  <div>
    <PageTitle parts={['Space Settings']} />
    <div className="page-container page-container--space-settings">
      <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>System Settings</h1>
          </div>
        </div>
        <section>
          <form>
            <h2 className="section__title">Workflow Options</h2>
            {Utils.getAttributeValue(space, 'Approval Days Due') && (
              <div className="form-group">
                <label>Approval Days Due</label>
                <NumberInput
                  value={inputs['Approval Days Due']}
                  name="Approval Days Due"
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-2"
                />
              </div>
            )}
            {Utils.getAttributeValue(space, 'Service Days Due') && (
              <div className="form-group">
                <label>Service Days Due</label>
                <NumberInput
                  value={inputs['Service Days Due']}
                  name="Service Days Due"
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-2"
                />
              </div>
            )}
            {Utils.getAttributeValue(space, 'Task Days Due') && (
              <div className="form-group">
                <label>Task Days Due</label>
                <NumberInput
                  value={inputs['Task Days Due']}
                  name="Task Days Due"
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-2"
                />
              </div>
            )}
            <h2 className="section__title">Default Task Team</h2>
            {Utils.getAttributeValue(space, 'Task Assignee Team') && (
              <div className="form-group">
                <label>Task Assignee Team</label>
                <Select
                  selected={inputs['Task Assignee Team']}
                  name="Task Days Due"
                  type="teams"
                  data={teams}
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>
            )}
            <h2 className="section__title">Form Mapping</h2>
            {Utils.getAttributeValue(space, 'Approval Form Slug') && (
              <div className="form-group">
                <label>Approval Form</label>
                <Select
                  selected={inputs['Approval Form Slug']}
                  name="Approval Form Slug"
                  type="queue"
                  data={spaceKappsForms}
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>
            )}
            {Utils.getAttributeValue(space, 'Feedback Form Slug') && (
              <div className="form-group">
                <label>Feedback Form</label>
                <Select
                  selected={inputs['Feedback Form Slug']}
                  name="Feedback Form Slug"
                  type="admin"
                  data={spaceKappsForms}
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>
            )}
            {Utils.getAttributeValue(space, 'Help Form Slug') && (
              <div className="form-group">
                <label>Help Form</label>
                <Select
                  selected={inputs['Help Form Slug']}
                  name="Help Form Slug"
                  type="admin"
                  data={spaceKappsForms}
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>
            )}
            {Utils.getAttributeValue(space, 'Request Alert Form Slug') && (
              <div className="form-group">
                <label>Request Alert Form</label>
                <Select
                  selected={inputs['Request Alert Form Slug']}
                  name="Request Alert Form Slug"
                  type="admin"
                  data={spaceKappsForms}
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>
            )}
            {Utils.getAttributeValue(space, 'Suggest a Service Form Slug') && (
              <div className="form-group">
                <label>Suggest a Service Form</label>
                <Select
                  selected={inputs['Suggest a Service Form Slug']}
                  name="Suggest a Service Form Slug"
                  type="services"
                  data={spaceKappsForms}
                  setInputs={setInputs}
                  inputs={inputs}
                  className="col-8"
                />
              </div>
            )}
            {Utils.getAttributeValue(space, 'Task Form Slug') && (
              <div className="form-group">
                <label>Task Form</label>
                <Select
                  selected={inputs['Task Form Slug']}
                  name="Task Form Slug"
                  type="queue"
                  data={spaceKappsForms}
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
                onClick={() => updateSpace(inputs)}
                // TODO: Disable until a change is made.
              >
                Save Changes
              </button>
            </span>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export const SpaceSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inputs', 'setInputs', props => ({
    'Approval Days Due': Utils.getAttributeValue(
      props.space,
      'Approval Days Due',
    ),
    'Service Days Due': Utils.getAttributeValue(
      props.space,
      'Service Days Due',
    ),
    'Task Days Due': Utils.getAttributeValue(props.space, 'Task Days Due'),
    'Task Assignee Team': Utils.getAttributeValue(
      props.space,
      'Task Assignee Team',
    ),
    'Approval Form Slug': Utils.getAttributeValue(props, 'Approval Form Slug'),
    'Feedback Form Slug': Utils.getAttributeValue(
      props.space,
      'Feedback Form Slug',
    ),
    'Help Form Slug': Utils.getAttributeValue(props.space, 'Help Form Slug'),
    'Request Alert Form Slug': Utils.getAttributeValue(
      props.space,
      'Request Alert Form Slug',
    ),
    'Suggest a Service Form Slug': Utils.getAttributeValue(
      props.space,
      'Suggest a Service Form Slug',
    ),
    'Task Form Slug': Utils.getAttributeValue(props.space, 'Task Form Slug'),
  })),
  lifecycle({
    componentWillMount() {
      this.props.fetchSpaceSettings();
      this.props.fetchSpaceSettingsTeams();
    },
  }),
)(SettingsContainer);
