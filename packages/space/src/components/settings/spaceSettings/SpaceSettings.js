import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import { Utils, commonActions, PageTitle, KappNavLink as NavLink } from 'common';
import { actions } from '../../../redux/modules/spaceSettings';

export const TextInput = ({value, name, setInputs, inputs}) => 
  <input
    name={name}
    value={value}
    type="text"
    onChange={ event => setInputs({ ...inputs, [name]: event.target.value })}
  />;
export const NumberInput = ({value, name, setInputs, inputs}) => 
  <input
    name={name}
    value={value}
    type="number"
    onChange={ event => setInputs({ ...inputs, [name]: event.target.value })} 
  />;
export const Select = ({
  selected,
  name,
  type,
  data,
  setInputs,
  inputs
}) => {
  let optionElements = '<option></option>';
  let options;
  if(data) {
    if(type === 'teams') { 
      options = data.filter(team => !team.name.includes('Role')).map(team => { return {value:team.name, label:team.name} });
    }
    else {
      options = data.kapps.find(kapp => kapp.slug === type).forms.map(form => { return {value:form.slug, label:form.name} });
    }
    optionElements = options.map(option => {
      const kappName = type.charAt(0).toUpperCase() + type.slice(1)
      return (
        <option 
          value={option.value} 
          selected={option.value === selected} 
        >{kappName} > {option.label}</option>
      );
    });
  }
  return <select name={name} onChange={ event => setInputs({ ...inputs, [name]: event.target.value })}>{optionElements}</select>;
};


const mapStateToProps = state => ({
  space: state.kinops.space,
  spaceSettings: state.spaceSettings,
  teams: state.spaceSettings.teams,
  spaceKappsForms: state.spaceSettings.spaceKappsForms,
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
    <div className="datastore-container">
      <div className="datastore-content pane">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>System Settings</h1>
          </div>
        </div>
        <form>
        <h2 className="section-title">Workflow Options</h2>
        {Utils.getAttributeValue(space,"Approval Days Due") && 
          <div className="form-group">
            <label>Approval Days Due</label>
            <NumberInput
              value={inputs["Approval Days Due"]}
              name="Approval Days Due"
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Service Days Due") && 
          <div className="form-group">
            <label>Service Days Due</label>
            <NumberInput 
              value={inputs['Service Days Due']}
              name="Service Days Due"
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Task Days Due") && 
          <div className="form-group">
            <label>Task Days Due</label>
            <NumberInput
              value={inputs['Task Days Due']}
              name="Task Days Due"
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Task Assignee Team") && 
          <div className="form-group">
            <label>Task Assignee Team</label>
            <Select
              selected={inputs['Task Assignee Team']} 
              name="Task Days Due" 
              type="teams" 
              data={teams}  
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Approval Form Slug") && 
          <div className="form-group">
            <label>Approval Form</label>
            <Select
              selected={inputs['Approval Form Slug']}
              name="Approval Form Slug"
              type="queue"
              data={spaceKappsForms}
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Feedback Form Slug") && 
          <div className="form-group">
            <label>Feedback Form</label>
            <Select
              selected={inputs['Feedback Form Slug']}
              name="Feedback Form Slug"
              type="admin"
              data={spaceKappsForms}
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Help Form Slug") && 
          <div className="form-group">
            <label>Help Form</label>
            <Select
              selected={inputs['Help Form Slug']}
              name="Help Form Slug"
              type="admin"
              data={spaceKappsForms}
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Request Alert Form Slug") && 
          <div className="form-group">
            <label>Request Alert Form</label>
            <Select
              selected={inputs['Request Alert Form Slug']}
              name="Request Alert Form Slug"
              type="admin" data={spaceKappsForms}
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Suggest a Service Form Slug") && 
          <div className="form-group">
            <label>Suggest a Service Form</label>
            <Select
              selected={inputs['Suggest a Service Form Slug']}
              name="Suggest a Service Form Slug"
              type="services"
              data={spaceKappsForms}
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        {Utils.getAttributeValue(space,"Task Form Slug") && 
          <div className="form-group">
            <label>Task Form</label>
            <Select
              selected={inputs['Task Form Slug']}
              name="Task Form Slug"
              type="queue"
              data={spaceKappsForms}
              setInputs={setInputs}
              inputs={inputs}
            />
          </div>
        }
        </form>
        <div class="footer-save">
          <button 
            className="btn btn-primary"
            onClick={() => updateSpace(inputs)}
          >Save</button>
        </div>
      </div>
    </div>
  </div>
);

export const SpaceSettings = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('inputs', 'setInputs', props => ({
    "Approval Days Due": Utils.getAttributeValue(props.space,"Approval Days Due"),
    "Service Days Due": Utils.getAttributeValue(props.space,'Service Days Due'),
    "Task Days Due": Utils.getAttributeValue(props.space,'Task Days Due'),
    "Task Assignee Team": Utils.getAttributeValue(props.space,'Task Assignee Team'),
    "Approval Form Slug": Utils.getAttributeValue(props,'Approval Form Slug'),
    "Feedback Form Slug": Utils.getAttributeValue(props.space,'Feedback Form Slug'),
    "Help Form Slug": Utils.getAttributeValue(props.space,'Help Form Slug'),
    "Request Alert Form Slug": Utils.getAttributeValue(props.space,'Request Alert Form Slug'),
    "Suggest a Service Form Slug": Utils.getAttributeValue(props.space,'Suggest a Service Form Slug'),
    "Task Form Slug": Utils.getAttributeValue(props.space,'Task Form Slug'),
  })),
  lifecycle({
    componentWillMount() {
      this.props.fetchSpaceSettings();
      this.props.fetchSpaceSettingsTeams();
    },
  }),
)(SettingsContainer);
