import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import { Utils, PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsSpace';

const getAttributeFromMap = (attributesMap, key, backupValue) =>
  attributesMap[key] && attributesMap[key][0]
    ? attributesMap[key][0]
    : backupValue;

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
  const option = <option key="blank" value="" />;
  let options;
  if (data) {
    if (type === 'teams') {
      options = data.filter(team => !team.name.includes('Role')).map(team => {
        return (
          <option key={team.name} value={team.name}>
            {team.name}
          </option>
        );
      });
      options.unshift(option);
    } else if (type === 'kapps') {
      options = data.map(kapp => {
        return (
          <option key={kapp.slug} value={kapp.slug}>
            {kapp.name}
          </option>
        );
      });
      options.unshift(option);
    } else if (type === 'kappForms') {
      options = data.map(form => {
        return (
          <option key={form.slug} value={form.slug}>
            {form.name}
          </option>
        );
      });
      options.unshift(option);
    } else if (type === 'allForms') {
      options = data.reduce((acc, kapp) => {
        const forms = kapp.forms.map(form => {
          return (
            <option
              key={`${kapp.name} > ${form.name}`}
              value={`${kapp.name} > ${form.name}`}
            >
              ${kapp.name} > ${form.name}
            </option>
          );
        });
        return acc.concat(forms);
      }, []);
      options.unshift(option);
    } else {
      return <option value={''}>None Found</option>;
    }
  }
  return (
    <select
      className={`form-control ${className}`}
      name={name}
      value={selected}
      onChange={event => setInputs({ ...inputs, [name]: event.target.value })}
    >
      {options}
    </select>
  );
};

const mapStateToProps = state => ({
  space: state.app.space,
  spaceSettings: state.space.settingsSpace,
  teams: state.space.settingsSpace.teams,
  kapps: state.space.settingsSpace.kapps,
  spaceAttributesMap: state.space.settingsSpace.spaceAttributesMap,
  spaceAttributeDefinitions:
    state.space.settingsSpace.spaceAttributeDefinitions,
});

const mapDispatchToProps = {
  updateSpace: actions.updateSpace,
  fetchSpaceSettings: actions.fetchSpaceSettings,
  fetchSpaceSettingsTeams: actions.fetchSpaceSettingsTeams,
};

export const SettingsContainer = ({
  updateSpace,
  spaceAttributesMap,
  teams,
  inputs,
  setInputs,
  kapps,
  spaceAttributeDefinitions,
}) => {
  const queueKapp = kapps.find(
    kapp =>
      kapp.slug ===
      getAttributeFromMap(spaceAttributesMap, 'Queue Kapp Slug', 'queue'),
  );
  const adminKapp = kapps.find(
    kapp =>
      kapp.slug ===
      getAttributeFromMap(spaceAttributesMap, 'Admin Kapp Slug', 'admin'),
  );
  const servicesKapp = kapps.find(
    kapp =>
      kapp.slug ===
      getAttributeFromMap(spaceAttributesMap, 'Services Kapp Slug', 'services'),
  );
  return (
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
              {spaceAttributeDefinitions.find(
                sA => sA.name === 'Approval Days Due',
              ) && (
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
              {spaceAttributeDefinitions.find(
                sA => sA.name === 'Service Days Due',
              ) && (
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
              {spaceAttributeDefinitions.find(
                sA => sA.name === 'Task Days Due',
              ) && (
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
              {spaceAttributeDefinitions.find(
                sA => sA.name === 'Task Assignee Team',
              ) && (
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
              <h2 className="section__title">Display Options</h2>
              {spaceAttributeDefinitions.find(
                sA => sA.name === 'Default Kapp Display',
              ) && (
                <div className="form-group">
                  <label>Default Kapp Display</label>
                  <Select
                    selected={inputs['Default Kapp Display']}
                    name="Default Kapp Display"
                    type="kapps"
                    data={kapps}
                    setInputs={setInputs}
                    inputs={inputs}
                    className="col-8"
                  />
                </div>
              )}
              <h2 className="section__title">Form Mapping</h2>
              {queueKapp &&
                spaceAttributeDefinitions.find(
                  sA => sA.name === 'Approval Form Slug',
                ) && (
                  <div className="form-group">
                    <label>Approval Form</label>
                    <Select
                      selected={inputs['Approval Form Slug']}
                      name="Approval Form Slug"
                      type="kappForms"
                      data={queueKapp.forms}
                      setInputs={setInputs}
                      inputs={inputs}
                      className="col-8"
                    />
                  </div>
                )}
              {adminKapp &&
                spaceAttributeDefinitions.find(
                  sA => sA.name === 'Feedback Form Slug',
                ) && (
                  <div className="form-group">
                    <label>Feedback Form</label>
                    <Select
                      selected={inputs['Feedback Form Slug']}
                      name="Feedback Form Slug"
                      type="kappForms"
                      data={adminKapp.forms}
                      setInputs={setInputs}
                      inputs={inputs}
                      className="col-8"
                    />
                  </div>
                )}
              {adminKapp &&
                spaceAttributeDefinitions.find(
                  sA => sA.name === 'Help Form Slug',
                ) && (
                  <div className="form-group">
                    <label>Help Form</label>
                    <Select
                      selected={inputs['Help Form Slug']}
                      name="Help Form Slug"
                      type="kappForms"
                      data={adminKapp.forms}
                      setInputs={setInputs}
                      inputs={inputs}
                      className="col-8"
                    />
                  </div>
                )}
              {adminKapp &&
                spaceAttributeDefinitions.find(
                  sA => sA.name === 'Request Alert Form Slug',
                ) && (
                  <div className="form-group">
                    <label>Request Alert Form</label>
                    <Select
                      selected={inputs['Request Alert Form Slug']}
                      name="Request Alert Form Slug"
                      type="kappForms"
                      data={adminKapp.forms}
                      setInputs={setInputs}
                      inputs={inputs}
                      className="col-8"
                    />
                  </div>
                )}
              {servicesKapp &&
                spaceAttributeDefinitions.find(
                  sA => sA.name === 'Suggest a Service Form Slug',
                ) && (
                  <div className="form-group">
                    <label>Suggest a Service Form</label>
                    <Select
                      selected={inputs['Suggest a Service Form Slug']}
                      name="Suggest a Service Form Slug"
                      type="kappForms"
                      data={servicesKapp.forms}
                      setInputs={setInputs}
                      inputs={inputs}
                      className="col-8"
                    />
                  </div>
                )}
              {queueKapp &&
                spaceAttributeDefinitions.find(
                  sA => sA.name === 'Task Form Slug',
                ) && (
                  <div className="form-group">
                    <label>Task Form</label>
                    <Select
                      selected={inputs['Task Form Slug']}
                      name="Task Form Slug"
                      type="kappForms"
                      data={queueKapp.forms}
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
};

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
    'Approval Form Slug': Utils.getAttributeValue(
      props.space,
      'Approval Form Slug',
    ),
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
    'Default Kapp Display': Utils.getAttributeValue(
      props.space,
      'Default Kapp Display',
    ),
  })),
  lifecycle({
    componentWillMount() {
      this.props.fetchSpaceSettings();
      this.props.fetchSpaceSettingsTeams();
    },
  }),
)(SettingsContainer);
