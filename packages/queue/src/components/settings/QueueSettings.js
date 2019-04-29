import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { toastActions, AttributeSelectors } from 'common';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import { fetchKapp, updateKapp } from '@kineticdata/react';
import { I18n } from '@kineticdata/react';
import { context } from '../../redux/store';
import { PageTitle } from '../shared/PageTitle';

export const SettingsComponent = ({
  attributesMap,
  handleAttributeChange,
  currentKapp,
  updateSettings,
  attributesMapDifferences,
  kappName,
  handleNameChange,
  previousKappName,
}) => (
  <div className="page-container page-container--space-settings">
    <PageTitle parts={['Kapp Settings', currentKapp.name]} />
    <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="../..">
              <I18n>queue</I18n>
            </Link>{' '}
            /{` `}
            <Link to="..">
              <I18n>settings</I18n>
            </Link>{' '}
            /{` `}
          </h3>
          <h1>
            <I18n>{currentKapp.name}</I18n> <I18n>Settings</I18n>
          </h1>
        </div>
      </div>
      <section>
        <form>
          <h2 className="section__title">
            <I18n>Display Options</I18n>
          </h2>
          <div className="form-group">
            <label>
              <I18n>Kapp Name</I18n>
            </label>
            <small>
              <I18n>The Name of the Kapp Referenced Throughout the Kapp</I18n>
            </small>
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
          <h2 className="section__title">
            <I18n>Form Mapping</I18n>
          </h2>
          {attributesMap.has('Form Workflow') && (
            <div className="form-group">
              <label>
                <I18n>Form Workflow Created</I18n>
              </label>
              <small className="form-text text-muted">
                <I18n>
                  Vaild prefixs are: Created, Deleted, Updated. Only one of each
                  prefix can be selected
                </I18n>
              </small>
              <I18n
                render={translate => (
                  <Typeahead
                    options={[
                      'Created - True',
                      'Created - False',
                      'Created - Standard',
                      'Deleted - True',
                      'Deleted - False',
                      'Deleted - Standard',
                      'Updated - True',
                      'Updated - False',
                      'Updated - Standard',
                    ]}
                    allowNew
                    multiple
                    newSelectionPrefix={translate('Click to add:')}
                    selected={attributesMap
                      .getIn(['Form Workflow', 'value'])
                      .toJS()}
                    onChange={selectedArr => {
                      const checkedArr = selectedArr.reduce((acc, value) => {
                        if (typeof value !== 'string') {
                          value = value['label'];
                        }
                        const prefix = value
                          .trim()
                          .slice(0, value.search(/(-)/) + 2);
                        if (
                          prefix === 'Created - ' ||
                          prefix === 'Deleted - ' ||
                          prefix === 'Updated - '
                        ) {
                          acc.push(value);
                        } else {
                          console.log('must be proceded by a valid prifix');
                        }
                        return acc;
                      }, []);
                      handleAttributeChange({
                        target: { id: 'Form Workflow', value: checkedArr },
                      });
                    }}
                  />
                )}
              />
            </div>
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
              <I18n>Save Changes</I18n>
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
        attributes.getIn(['Services Kapp Slug', 'value', 0], 'queue'),
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
  const { kapp } = await fetchKapp({
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
  const { kapp, serverError } = await updateKapp({
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
  currentKapp: state.app.kapp,
  queueSettings: state.queueSettings,
  forms: state.forms.data,
  reloadApp: state.app.actions.refreshApp,
});

const mapDispatchToProps = {
  ...toastActions,
};

export const QueueSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
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
