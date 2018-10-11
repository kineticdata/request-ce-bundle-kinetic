import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import {
  commonActions,
  toastActions,
  PageTitle,
  AttributeSelectors,
  selectCurrentKapp,
} from 'common';
import { CoreAPI } from 'react-kinetic-core';

export const SettingsComponent = ({
  attributesMap,
  handleAttributeChange,
  requiredKapps,
  currentKapp,
  updateSettings,
  attributesMapDifferences,
  kappName,
  handleNameChange,
  previousKappName,
}) => (
  <div className="page-container page-container--space-settings">
    <PageTitle parts={[`${currentKapp.name} Kapp Settings`]} />
    <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to={`/kapps/${currentKapp.slug}`}>services</Link> /{` `}
            <Link to={`/kapps/${currentKapp.slug}/settings`}>
              settings
            </Link> /{` `}
          </h3>
          <h1>{currentKapp.name} Settings</h1>
        </div>
      </div>
      <section>
        <form>
          <h2 className="section__title">Display Options</h2>
          <div className="form-group">
            <label>Kapp Name</label>
            <small>The Name of the Kapp Referenced Throughout the Kapp</small>
            <input
              type="text"
              className="form-control"
              value={kappName}
              onChange={handleNameChange}
            />
          </div>
          {attributesMap.has('Icon') && (
            <AttributeSelectors.IconSelect
              id="Icon"
              value={attributesMap.getIn(['Icon', 'value'])}
              onChange={handleAttributeChange}
              label="Display Icon"
              description={attributesMap.getIn(['Icon', 'description'])}
            />
          )}
          <h2 className="section__title">Workflow Options</h2>
          {attributesMap.has('Approver') && (
            <AttributeSelectors.ApproverSelect
              id="Approver"
              value={attributesMap.getIn(['Approver', 'value'])}
              onChange={handleAttributeChange}
              placeholder="--None--"
              label="Default Kapp Approver"
              description={attributesMap.getIn(['Approver', 'description'])}
            />
          )}
          {attributesMap.has('Task Assignee Team') && (
            <AttributeSelectors.TeamSelect
              id="Task Assignee Team"
              value={attributesMap.getIn(['Task Assignee Team', 'value'])}
              onChange={handleAttributeChange}
              valueMapper={value => value.team.name}
              label="Default Kapp Task Assignee Team"
              description={attributesMap.getIn([
                'Task Assignee Team',
                'description',
              ])}
            />
          )}
          {attributesMap.has('Service Days Due') && (
            <AttributeSelectors.IntegerSelect
              id="Service Days Due"
              value={attributesMap.getIn(['Service Days Due', 'value'])}
              onChange={handleAttributeChange}
              label="Default Kapp Service Days Due"
              description={attributesMap.getIn([
                'Service Days Due',
                'description',
              ])}
            />
          )}
          <h2 className="section__title">Form Mapping</h2>
          {requiredKapps.queue &&
            attributesMap.has('Approval Form Slug') && (
              <AttributeSelectors.FormSelect
                id="Approval Form Slug"
                value={attributesMap.getIn(['Approval Form Slug', 'value'])}
                onChange={handleAttributeChange}
                valueMapper={value => value.slug}
                kappSlug={requiredKapps.queue.slug}
                label="Default Kapp Approval Form"
                description={attributesMap.getIn([
                  'Approval Form Slug',
                  'description',
                ])}
              />
            )}
          {requiredKapps.queue &&
            attributesMap.has('Task Form Slug') && (
              <AttributeSelectors.FormSelect
                id="Task Form Slug"
                value={attributesMap.getIn(['Task Form Slug', 'value'])}
                onChange={handleAttributeChange}
                valueMapper={value => value.slug}
                kappSlug={requiredKapps.queue.slug}
                label="Default Task Form Slug"
                description={attributesMap.getIn([
                  'Task Form Slug',
                  'description',
                ])}
              />
            )}

          {attributesMap.has('Notification Template Name - Complete') && (
            <AttributeSelectors.NotificationTemplateSelect
              id="Notification Template Name - Complete"
              value={attributesMap.getIn([
                'Notification Template Name - Complete',
                'value',
              ])}
              placeholder="None Found"
              onChange={handleAttributeChange}
              valueMapper={value => value.submission.values['Name']}
              label="Default Request Submitted Notification Template"
              description={attributesMap.getIn([
                'Notification Template Name - Complete',
                'description',
              ])}
            />
          )}
          {attributesMap.has('Notification Template Name - Create') && (
            <AttributeSelectors.NotificationTemplateSelect
              id="Notification Template Name - Create"
              value={attributesMap.getIn([
                'Notification Template Name - Create',
                'value',
              ])}
              placeholder="None Found"
              onChange={handleAttributeChange}
              valueMapper={value => value.submission.values['Name']}
              label="Default Request Created Notification Template"
              description={attributesMap.getIn([
                'Notification Template Name - Create',
                'description',
              ])}
            />
          )}
          {requiredKapps.admin &&
            attributesMap.has('Shared Bridged Resource Form Slug') && (
              <AttributeSelectors.FormSelect
                id="Shared Bridged Resource Form Slug"
                value={attributesMap.getIn([
                  'Shared Bridged Resource Form Slug',
                  'value',
                ])}
                onChange={handleAttributeChange}
                valueMapper={value => value.slug}
                kappSlug={currentKapp.slug}
                label="Shared Bridged Resource Form Slug"
                description={attributesMap.getIn([
                  'Shared Bridged Resource Form Slug',
                  'description',
                ])}
              />
            )}
        </form>
        <div className="form__footer">
          <span className="form__footer__right">
            <button
              className="btn btn-primary"
              onClick={updateSettings}
              disabled={
                !(
                  attributesMapDifferences.size !== 0 ||
                  kappName !== previousKappName
                )
              }
            >
              Save Changes
            </button>
          </span>
        </div>
      </section>
    </div>
  </div>
);

const KAPP_INCLUDES = 'attributesMap,kappAttributeDefinitions,space.kapps';
const settingsAttribute = (definition, attributesMap) => ({
  name: definition.name,
  description: definition.description,
  value: attributesMap[definition.name],
});
const settingsAttributes = (attributeDefinitions, attributesMap) =>
  fromJS(
    attributeDefinitions.reduce(
      (acc, def) => ({
        ...acc,
        [def.name]: settingsAttribute(def, attributesMap),
      }),
      {},
    ),
  );
const kappMapping = kapp => {
  const attributes = settingsAttributes(
    kapp.kappAttributeDefinitions,
    kapp.attributesMap,
  );
  const kapps = List(kapp.space.kapps);
  const requiredKapps = {
    queue: kapps.find(
      kapp =>
        kapp.slug ===
        attributes.getIn(['Queue Kapp Slug', 'value', 0], 'queue'),
    ),
    admin: kapps.find(
      kapp =>
        kapp.slug ===
        attributes.getIn(['Admin Kapp Slug', 'value', 0], 'admin'),
    ),
    services: kapps.find(
      kapp =>
        kapp.slug ===
        attributes.getIn(['Services Kapp Slug', 'value', 0], 'services'),
    ),
  };
  return {
    attributes,
    kapps,
    requiredKapps,
  };
};

// Fetches the Settings Required for this component
const fetchSettings = ({
  setAttributesMap,
  setKapps,
  setRequiredKapps,
  setPreviousAttributesMap,
  setKappName,
  setPreviousKappName,
  currentKapp,
}) => async () => {
  const { kapp } = await CoreAPI.fetchKapp({
    kappSlug: currentKapp.slug,
    include: KAPP_INCLUDES,
  });
  const { attributes, kapps, requiredKapps } = kappMapping(kapp);
  setAttributesMap(attributes);
  setPreviousAttributesMap(attributes);
  setKapps(kapps);
  setRequiredKapps(requiredKapps);
  setKappName(kapp.name);
  setPreviousKappName(kapp.name);
};

// Updates the Settings and Refetches the App
const updateSettings = ({
  addSuccess,
  addError,
  attributesMapDifferences,
  setAttributesMapDifferences,
  kappName,
  setAttributesMap,
  setKapps,
  setRequiredKapps,
  setPreviousAttributesMap,
  setKappName,
  setPreviousKappName,
  reloadApp,
  currentKapp,
}) => async () => {
  const { kapp, serverError } = await CoreAPI.updateKapp({
    kappSlug: currentKapp.slug,
    include: KAPP_INCLUDES,
    kapp: {
      name: kappName,
      attributesMap: attributesMapDifferences,
    },
  });
  if (kapp) {
    const { attributes, kapps, requiredKapps } = kappMapping(kapp);
    addSuccess('Settings were successfully updated', 'Kapp Updated');
    setAttributesMap(attributes);
    setPreviousAttributesMap(attributes);
    setKapps(kapps);
    setRequiredKapps(requiredKapps);
    setKappName(kapp.name);
    setPreviousKappName(kapp.name);
    setAttributesMapDifferences(Map());
    reloadApp();
  } else {
    addError(
      serverError.error || 'Error Updating Kapp',
      serverError.statusText || 'Please contact your system administrator',
    );
  }
};

// Handler that is called when an attribute value is changed.
const handleAttributeChange = ({
  attributesMap,
  setAttributesMap,
  previousAttributesMap,
  setAttributesMapDifferences,
}) => event => {
  const field = event.target.id;
  const value = List(event.target.value);
  const updatedAttributesMap = attributesMap.setIn([field, 'value'], value);
  const diff = updatedAttributesMap
    .filter((v, k) => !previousAttributesMap.get(k).equals(v))
    .map(v => v.get('value'));
  console.log('PREV: ', previousAttributesMap.getIn([field, 'value']).toJS());
  console.log('UPDATED: ', updatedAttributesMap.getIn([field, 'value']).toJS());
  console.log('DIFF: ', diff.toJS());
  setAttributesMap(updatedAttributesMap);
  setAttributesMapDifferences(diff);
};

// Handler that is called when name changes
const handleNameChange = ({ setKappName }) => event => {
  setKappName(event.target.value);
};

const mapStateToProps = state => ({
  currentKapp: selectCurrentKapp(state),
  servicesSettings: state.services.servicesSettings,
  forms: state.services.forms.data,
});

const mapDispatchToProps = {
  ...toastActions,
  reloadApp: commonActions.loadApp,
};

export const ServicesSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('attributesMap', 'setAttributesMap', Map()),
  withState('previousAttributesMap', 'setPreviousAttributesMap', Map()),
  withState('attributesMapDifferences', 'setAttributesMapDifferences', Map()),
  withState('requiredKapps', 'setRequiredKapps', List()),
  withState('kapps', 'setKapps', List()),
  withState('kappName', 'setKappName', ''),
  withState('previousKappName', 'setPreviousKappName', ''),
  withHandlers({
    handleNameChange,
    handleAttributeChange,
    fetchSettings,
    updateSettings,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchSettings();
    },
  }),
)(SettingsComponent);
