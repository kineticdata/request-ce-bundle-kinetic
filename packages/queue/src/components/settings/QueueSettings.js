import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { Utils, PageTitle } from 'common';
import { actions } from '../../redux/modules/settingsQueue';

export const TextInput = ({
  value,
  name,
  setInputs,
  inputs,
  className,
  multiple,
}) => (
  <input
    className={`form-control ${className}`}
    name={name}
    value={value || ''}
    type="text"
    onChange={event => {
      let value = event.target.value;
      if (multiple) {
        value = event.target.value.split(',');
      }
      setInputs({ ...inputs, [name]: value });
    }}
    multiple={multiple}
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
      onChange={event => setInputs({ ...inputs, [name]: event.target.value })}
    >
      <option />
      {optionElements}
    </select>
  );
};

export const SettingsContainer = ({
  updateQueueSettings,
  inputs,
  setInputs,
  queueSettings: {
    queueSettingsKapp: kapp,
    loading,
    loadingTeams,
    loadingUsers,
    teams,
    users,
    spaceKapps,
    notificationsLoading,
    notifications,
  },
  forms,
  approver,
  setApprover,
}) =>
  !loading &&
  !loadingTeams &&
  !loadingUsers &&
  !notificationsLoading && (
    <div>
      <PageTitle parts={['Queue Settings']} />
      <div className="page-container page-container--space-settings">
        <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/kapps/queue">queue</Link> /{` `}
                <Link to="/kapps/queue/settings">settings</Link> /{` `}
              </h3>
              <h1>General</h1>
            </div>
          </div>
          <section>
            <form>
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
                    value="None"
                    onChange={event => {
                      setInputs({ ...inputs, Approver: event.target.value });
                      setApprover('none');
                    }}
                  />
                  None
                </label>
                <label htmlFor="approver-manager">
                  <input
                    type="radio"
                    checked={inputs['Approver'] === 'Manager'}
                    name="Approver"
                    id="approver-manager"
                    value="Manager"
                    onChange={event => {
                      setInputs({ ...inputs, Approver: event.target.value });
                      setApprover('manager');
                    }}
                  />
                  Manager
                </label>
                <label htmlFor="approver-team">
                  <input
                    type="radio"
                    checked={
                      approver === 'team' ||
                      teams.filter(team => team.name === inputs['Approver'])
                        .length > 0
                    }
                    name="Approver"
                    id="approver-team"
                    value="Team"
                    onChange={event => {
                      setApprover('team');
                      setInputs({ ...inputs, Approver: event.target.value });
                    }}
                  />
                  Team
                </label>
                <label htmlFor="approver-individual">
                  <input
                    type="radio"
                    checked={
                      approver === 'individual' ||
                      users.filter(user => user.username === inputs['Approver'])
                        .length > 0
                    }
                    name="Approver"
                    id="approver-individual"
                    value="Individual"
                    onChange={event => {
                      setApprover('individual');
                      setInputs({ ...inputs, Approver: event.target.value });
                    }}
                  />
                  Individual
                </label>
              </div>
              {(approver === 'team' ||
                teams.filter(team => team.name === inputs['Approver']).length >
                  0) && (
                <div className="form-group">
                  <select
                    className="form-control col-8"
                    name="team-approver"
                    id="team-approver"
                    value={inputs['Approver']}
                    onChange={event =>
                      setInputs({ ...inputs, Approver: event.target.value })
                    }
                  >
                    <option />
                    {teams
                      .filter(team => !team.name.includes('Role'))
                      .map(team => (
                        <option key={team.name} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {(approver === 'individual' ||
                users.filter(user => user.username === inputs['Approver'])
                  .length > 0) && (
                <div className="form-group">
                  <select
                    className="form-control col-8"
                    name="user-approver"
                    id="user-approver"
                    value={inputs['Approver']}
                    onChange={event =>
                      setInputs({ ...inputs, Approver: event.target.value })
                    }
                  >
                    <option />
                    {users.map(user => (
                      <option key={user.username} value={user.username}>
                        {user.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
              {kapp.attributesMap['Notification Template Name - Complete'] && (
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
              )}
              {kapp.attributesMap['Notification Template Name - Create'] && (
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
                  onClick={() => updateQueueSettings(inputs)}
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

export const setInitialInputs = ({
  inputs,
  setInputs,
  queueSettings: { queueSettingsKapp: kapp },
}) => () => {
  setInputs({
    ...inputs,
    Approver: kapp.attributesMap['Approver']
      ? kapp.attributesMap['Approver'][0]
      : '',
    'Approval Form Slug': kapp.attributesMap['Approval Form Slug']
      ? kapp.attributesMap['Approval Form Slug'][0]
      : '',
    Icon: kapp.attributesMap['Icon'] ? kapp.attributesMap['Icon'][0] : '',
    'Service Days Due': kapp.attributesMap['Service Days Due']
      ? kapp.attributesMap['Service Days Due'][0]
      : '',
    'Shared Bridged Resource Form Slug': kapp.attributesMap[
      'Shared Bridged Resource Form Slug'
    ]
      ? kapp.attributesMap['Shared Bridged Resource Form Slug'][0]
      : '',
    'Task Form Slug': kapp.attributesMap['Task Form Slug']
      ? kapp.attributesMap['Task Form Slug'][0]
      : '',
    'Task Assignee Team': kapp.attributesMap['Task Assignee Team']
      ? kapp.attributesMap['Task Assignee Team'][0]
      : '',
    'Notification Template Name - Complete': kapp.attributesMap[
      'Notification Template Name - Complete'
    ]
      ? kapp.attributesMap['Notification Template Name - Complete'][0]
      : '',
    'Notification Template Name - Create': kapp.attributesMap[
      'Notification Template Name - Create'
    ]
      ? kapp.attributesMap['Notification Template Name - Create'][0]
      : '',
  });
};

const mapStateToProps = state => ({
  queueSettings: state.queue.queueSettings,
  forms: state.queue.forms.data,
});

const mapDispatchToProps = {
  updateQueueSettings: actions.updateQueueSettings,
  fetchQueueSettings: actions.fetchQueueSettings,
  fetchQueueSettingsTeams: actions.fetchQueueSettingsTeams,
  fetchQueueSettingsUsers: actions.fetchQueueSettingsUsers,
  fetchQueueSettingsSpace: actions.fetchQueueSettingsSpace,
  fetchNotifications: actions.fetchNotifications,
};

export const QueueSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inputs', 'setInputs', {}),
  withState('approver', 'setApprover', null),
  withHandlers({ setInitialInputs }),
  lifecycle({
    componentWillMount() {
      this.props.fetchQueueSettings();
      this.props.fetchQueueSettingsTeams();
      this.props.fetchQueueSettingsUsers();
      this.props.fetchQueueSettingsSpace();
      this.props.fetchNotifications();
    },
    componentWillReceiveProps(nextProps) {
      nextProps.queueSettings.loading === false &&
        nextProps.queueSettings.queueSettingsKapp !==
          this.props.queueSettings.queueSettingsKapp &&
        nextProps.setInitialInputs();
    },
  }),
)(SettingsContainer);
