import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { CoreAPI } from 'react-kinetic-core';

import {
  commonActions,
  toastActions,
  PageTitle,
  AttributeSelectors,
} from 'common';

export const SettingsComponent = ({
  attributesMap,
  handleAttributeChange,
  requiredKapps,
  spaceName,
  handleNameChange,
  handleDefaultLocaleChange,
  defaultLocale,
  locales,
  handleDefaultTimezoneChange,
  defaultTimezone,
  timezones,
  updateSettings,
  isFormDisabled,
}) => (
  <div className="page-container page-container--space-settings">
    <PageTitle parts={['System Settings']} />
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
          <h2 className="section__title">Display Options</h2>
          <div className="form-group">
            <label>Space Name</label>
            <input
              type="text"
              className="form-control"
              value={spaceName}
              onChange={handleNameChange}
            />
            <small>
              The Name of the Space Referenced Throughout the System
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="defaultLocale">Default Locale</label>
            <select
              id="defaultLocale"
              name="defaultLocale"
              className="form-control"
              onChange={handleDefaultLocaleChange}
              value={defaultLocale}
            >
              <option value="">None Selected</option>
              {locales.map(locale => (
                <option
                  value={locale.code}
                  key={`${locale.code}+${locale.name}`}
                >
                  {locale.name}
                </option>
              ))}
            </select>
            <small>
              The default locale used for the Space. This can be overridden per
              user.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="defaultTimezone">Default Timezone</label>
            <select
              id="defaultTimezone"
              name="defaultTimezone"
              className="form-control"
              onChange={handleDefaultTimezoneChange}
              value={defaultTimezone}
            >
              <option value="">None Selected</option>
              {timezones.map(timezone => (
                <option value={timezone.id} key={timezone.id}>
                  {timezone.name} ({timezone.id})
                </option>
              ))}
            </select>
            <small>
              The default timezone used for the Space. This can be overridden
              per user.
            </small>
          </div>
          {attributesMap.has('Default Kapp Display') && (
            <AttributeSelectors.KappSelect
              id="Default Kapp Display"
              value={attributesMap.getIn(['Default Kapp Display', 'value'])}
              onChange={handleAttributeChange}
              valueMapper={value => value.kapp.slug}
              placeholder="--Home--"
              label="Default Kapp Display"
              description={attributesMap.getIn([
                'Default Kapp Display',
                'description',
              ])}
            />
          )}
          <h2 className="section__title">Workflow Options</h2>
          {attributesMap.has('Service Days Due') && (
            <AttributeSelectors.IntegerSelect
              id="Service Days Due"
              value={attributesMap.getIn(['Service Days Due', 'value'])}
              onChange={handleAttributeChange}
              label="Default Service Days Due"
              description={attributesMap.getIn([
                'Service Days Due',
                'description',
              ])}
            />
          )}
          {attributesMap.has('Task Assignee Team') && (
            <AttributeSelectors.TeamSelect
              id="Task Assignee Team"
              value={attributesMap.getIn(['Task Assignee Team', 'value'])}
              onChange={handleAttributeChange}
              valueMapper={value => value.team.name}
              label="Task Assignee Team"
              description={attributesMap.getIn([
                'Task Assignee Team',
                'description',
              ])}
            />
          )}
          <h2 className="section__title">Form Mapping</h2>
          {requiredKapps.queue && attributesMap.has('Approval Form Slug') && (
            <AttributeSelectors.FormSelect
              id="Approval Form Slug"
              value={attributesMap.getIn(['Approval Form Slug', 'value'])}
              onChange={handleAttributeChange}
              valueMapper={value => value.slug}
              kappSlug={requiredKapps.queue.slug}
              label="Default Approval Form"
              style={{ width: '50%' }}
              description={attributesMap.getIn([
                'Approval Form Slug',
                'description',
              ])}
            />
          )}
          {requiredKapps.admin && attributesMap.has('Feedback Form Slug') && (
            <AttributeSelectors.FormSelect
              id="Feedback Form Slug"
              value={attributesMap.getIn(['Feedback Form Slug', 'value'])}
              onChange={handleAttributeChange}
              valueMapper={value => value.slug}
              kappSlug={requiredKapps.admin.slug}
              label="Feedback Form Slug"
              description={attributesMap.getIn([
                'Feedback Form Slug',
                'description',
              ])}
            />
          )}
          {requiredKapps.admin && attributesMap.has('Help Form Slug') && (
            <AttributeSelectors.FormSelect
              id="Help Form Slug"
              value={attributesMap.getIn(['Help Form Slug', 'value'])}
              onChange={handleAttributeChange}
              valueMapper={value => value.slug}
              kappSlug={requiredKapps.admin.slug}
              label="Help Form Slug"
              description={attributesMap.getIn([
                'Help Form Slug',
                'description',
              ])}
            />
          )}
          {requiredKapps.admin &&
            attributesMap.has('Request Alert Form Slug') && (
              <AttributeSelectors.FormSelect
                id="Request Alert Form Slug"
                value={attributesMap.getIn([
                  'Request Alert Form Slug',
                  'value',
                ])}
                onChange={handleAttributeChange}
                valueMapper={value => value.slug}
                kappSlug={requiredKapps.admin.slug}
                label="Request Alert Form Slug"
                description={attributesMap.getIn([
                  'Request Alert Form Slug',
                  'description',
                ])}
              />
            )}
          {requiredKapps.services &&
            attributesMap.has('Suggest a Service Form Slug') && (
              <AttributeSelectors.FormSelect
                id="Suggest a Service Form Slug"
                value={attributesMap.getIn([
                  'Suggest a Service Form Slug',
                  'value',
                ])}
                onChange={handleAttributeChange}
                valueMapper={value => value.slug}
                kappSlug={requiredKapps.services.slug}
                label="Suggest a Service Form Slug"
                description={attributesMap.getIn([
                  'Suggest a Service Form Slug',
                  'description',
                ])}
              />
            )}
          {requiredKapps.queue && attributesMap.has('Task Form Slug') && (
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
        </form>
        <div className="form__footer">
          <span className="form__footer__right">
            <button
              className="btn btn-primary"
              onClick={updateSettings}
              disabled={isFormDisabled()}
            >
              Save Changes
            </button>
          </span>
        </div>
      </section>
    </div>
  </div>
);

const SPACE_INCLUDES = 'details,attributesMap,spaceAttributeDefinitions,kapps';
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
const spaceMapping = space => {
  const attributes = settingsAttributes(
    space.spaceAttributeDefinitions,
    space.attributesMap,
  );
  const kapps = List(space.kapps);
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
  setSpaceName,
  setPreviousSpaceName,
  setDefaultLocale,
  setPreviousDefaultLocale,
  setDefaultTimezone,
  setPreviousDefaultTimezone,
}) => async () => {
  const { space } = await CoreAPI.fetchSpace({
    include: SPACE_INCLUDES,
  });
  const { attributes, kapps, requiredKapps } = spaceMapping(space);
  setAttributesMap(attributes);
  setPreviousAttributesMap(attributes);
  setKapps(kapps);
  setRequiredKapps(requiredKapps);
  setSpaceName(space.name);
  setPreviousSpaceName(space.name);
  setDefaultLocale(space.defaultLocale || '');
  setPreviousDefaultLocale(space.defaultLocale || '');
  setDefaultTimezone(space.defaultTimezone || '');
  setPreviousDefaultTimezone(space.defaultTimezone || '');
};

// Updates the Settings and Re
const updateSettings = ({
  addSuccess,
  addError,
  attributesMapDifferences,
  setAttributesMapDifferences,
  setAttributesMap,
  setKapps,
  setRequiredKapps,
  setPreviousAttributesMap,
  spaceName,
  setSpaceName,
  setPreviousSpaceName,
  defaultLocale,
  setDefaultLocale,
  setPreviousDefaultLocale,
  defaultTimezone,
  setDefaultTimezone,
  setPreviousDefaultTimezone,
  reloadApp,
}) => async () => {
  const { space, serverError } = await CoreAPI.updateSpace({
    include: SPACE_INCLUDES,
    space: {
      name: spaceName,
      defaultLocale: defaultLocale === '' ? null : defaultLocale,
      defaultTimezone: defaultTimezone === '' ? null : defaultTimezone,
      attributesMap: attributesMapDifferences,
    },
  });
  if (space) {
    const { attributes, kapps, requiredKapps } = spaceMapping(space);
    addSuccess('Settings were successfully updated', 'Space Updated');
    setAttributesMap(attributes);
    setPreviousAttributesMap(attributes);
    setKapps(kapps);
    setRequiredKapps(requiredKapps);
    setSpaceName(space.name);
    setPreviousSpaceName(space.name);
    setDefaultLocale(space.defaultLocale || '');
    setPreviousDefaultLocale(space.defaultLocale || '');
    setDefaultTimezone(space.defaultTimezone || '');
    setPreviousDefaultTimezone(space.defaultTimezone || '');
    setAttributesMapDifferences(Map());
    reloadApp();
  } else {
    addError(
      serverError.error || 'Error Updating Space',
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
  setAttributesMap(updatedAttributesMap);
  setAttributesMapDifferences(diff);
};

// Handler that is called when the space name changes
const handleNameChange = ({ setSpaceName }) => e =>
  setSpaceName(e.target.value);

const handleDefaultLocaleChange = ({ setDefaultLocale }) => e =>
  setDefaultLocale(e.target.value);

const handleDefaultTimezoneChange = ({ setDefaultTimezone }) => e =>
  setDefaultTimezone(e.target.value);

const isFormDisabled = ({
  attributesMapDifferences,
  spaceName,
  defaultLocale,
  defaultTimezone,
  previousSpaceName,
  previousDefaultLocale,
  previousDefaultTimezone,
}) => () =>
  !(
    attributesMapDifferences.size !== 0 ||
    spaceName !== previousSpaceName ||
    defaultLocale !== previousDefaultLocale ||
    defaultTimezone !== previousDefaultTimezone
  );
const mapStateToProps = state => ({
  locales: state.app.config.locales,
  timezones: state.app.config.timezones,
});

const mapDispatchToProps = {
  reloadApp: commonActions.loadApp,
  ...toastActions,
};

// Settings Container
export const SpaceSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('attributesMap', 'setAttributesMap', Map()),
  withState('previousAttributesMap', 'setPreviousAttributesMap', Map()),
  withState('attributesMapDifferences', 'setAttributesMapDifferences', Map()),
  withState('requiredKapps', 'setRequiredKapps', List()),
  withState('kapps', 'setKapps', List()),
  withState('spaceName', 'setSpaceName', ''),
  withState('previousSpaceName', 'setPreviousSpaceName', ''),
  withState('defaultLocale', 'setDefaultLocale', ''),
  withState('previousDefaultLocale', 'setPreviousDefaultLocale', ''),
  withState('defaultTimezone', 'setDefaultTimezone', ''),
  withState('previousDefaultTimezone', 'setPreviousDefaultTimezone', ''),
  withHandlers({
    handleNameChange,
    handleDefaultLocaleChange,
    handleDefaultTimezoneChange,
    handleAttributeChange,
    fetchSettings,
    updateSettings,
    isFormDisabled,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchSettings();
    },
  }),
)(SettingsComponent);
