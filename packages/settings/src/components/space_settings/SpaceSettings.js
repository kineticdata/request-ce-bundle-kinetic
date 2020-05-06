import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { I18n, SpaceForm } from '@kineticdata/react';
import { compose, withHandlers } from 'recompose';
import axios from 'axios';
import semver from 'semver';
import { connect } from '../../redux/store';
import {
  FormComponents,
  addToast,
  selectVisibleKapps,
  selectAdminKappSlug,
  selectQueueKappSlug,
  selectServicesKappSlug,
} from 'common';
import { PageTitle } from '../shared/PageTitle';
import { List } from 'immutable';
window.semver = semver;

const localAxios = axios.create({ withCredentials: false });

const buildFieldSet = bundleName => [
  'name',
  'defaultLocale',
  'defaultTimezone',
  'defaultKappDisplay',
  'defaultServiceDaysDue',
  'defaultTaskAssigneeTeam',
  'defaultApprovalForm',
  'feedbackFormSlug',
  'helpFormSlug',
  'requestAlertFormSlug',
  'suggestAServiceFormSlug',
  'defaultTaskFormSlug',
  'attributesMap',
  ...(bundleName ? ['displayValue', 'displayValueSPA'] : []),
];

const buildLayout = bundleName => ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <I18n>Display Options</I18n>
    </h2>
    {fields.get('name')}
    <div className="form-group__columns">
      {fields.get('defaultLocale')}
      {fields.get('defaultTimezone')}
    </div>
    {fields.get('defaultKappDisplay')}
    {bundleName && fields.get('displayValueSPA')}
    <br />
    <h2 className="section__title">
      <I18n>Workflow Options</I18n>
    </h2>
    {fields.get('defaultServiceDaysDue')}
    {fields.get('defaultTaskAssigneeTeam')}
    <br />
    <h2 className="section__title">
      <I18n>Form Mapping</I18n>
    </h2>
    {fields.get('defaultApprovalForm')}
    {fields.get('defaultTaskFormSlug')}
    {fields.get('feedbackFormSlug')}
    {fields.get('helpFormSlug')}
    {fields.get('requestAlertFormSlug')}
    {fields.get('suggestAServiceFormSlug')}
    {error}
    {buttons}
  </Fragment>
);

// Add data sources for fetching available bundle versions from S3
const buildAdditionalDataSources = bundleName =>
  bundleName
    ? {
        releases: {
          fn: fetchBundleVersions,
          params: [
            {
              name: bundleName,
            },
          ],
          // Filter out any v2 or lower version bundles as they don't support this feature
          transform: response => response.filter(r => r.major > 2),
        },
        branches: {
          fn: fetchBundleVersions,
          params: [
            {
              name: bundleName,
              branches: true,
            },
          ],
        },
      }
    : {};

const fetchBundleVersions = (options = {}) => {
  return localAxios
    .get(
      `https://kinops.io.s3.amazonaws.com/?list-type=2&prefix=bundles/${options.name ||
        'kinetic'}/${options.branches ? 'branches' : 'releases'}/&delimiter=/`,
    )
    .then(response => {
      const doc = new DOMParser().parseFromString(
        response.data,
        'application/xml',
      );
      return Array.from(
        doc.getElementsByTagName('CommonPrefixes'),
        prefix => prefix.textContent,
      )
        .map(path => {
          const match = path.match(/bundles\/[^/]*\/[^/]*\/([^/]*)\/?/);
          if (match && (!options.branches || match[1] === 'develop')) {
            const version =
              match[1] !== 'develop' ? semver.coerce(match[1]) : null;
            return {
              label: options.branches
                ? 'Development Branch'
                : `Release - v${match[1]}`,
              value: `https://s3.amazonaws.com/kinops.io/bundles/${options.name ||
                'kinetic'}/${options.branches ? 'branches' : 'releases'}/${
                match[1]
              }/index.html`,
              major: version && version.major,
            };
          }
          return null;
        })
        .filter(o => o);
    })
    .catch(e => {
      return [];
    });
};

const initialFormValue = (object, attributeName) =>
  object.hasIn(['attributesMap', attributeName, 0])
    ? { slug: object.getIn(['attributesMap', attributeName, 0]) }
    : null;
const asArray = value => (value ? [value] : []);

export const SpaceSettingsComponent = ({
  children,
  onSave,
  visibleKapps,
  adminKappSlug,
  queueKappSlug,
  servicesKappSlug,
  bundleName,
}) => (
  <SpaceForm
    fieldSet={buildFieldSet(bundleName)}
    onSave={onSave}
    addDataSources={buildAdditionalDataSources(bundleName)}
    addFields={() => ({ space }) =>
      space && [
        {
          name: 'defaultKappDisplay',
          label: 'Default Kapp Display',
          type: 'select',
          helpText:
            'Allows Space Administrators to set a default Kapp that will display for Users in their Space. This can be overridden by a User Profile Attribute.',
          options: [
            { label: 'Discussions', value: 'discussions' },
            ...visibleKapps.map(kapp => ({
              label: kapp.name,
              value: kapp.slug,
            })),
          ],
          initialValue: space.getIn([
            'attributesMap',
            'Default Kapp Display',
            0,
          ]),
        },
        {
          name: 'defaultServiceDaysDue',
          label: 'Default Service Days Due',
          type: 'text',
          helpText:
            'Number of days until service is expected to be fulfilled - Overridden by Form / Kapp Attribute',
          initialValue: space.getIn(['attributesMap', 'Service Days Due', 0]),
          component: FormComponents.IntegerField,
        },
        {
          name: 'defaultTaskAssigneeTeam',
          label: 'Default Task Assignee Team',
          type: 'team',
          helpText: 'Team to assign tasks to if not defined in a form or kapp.',
          initialValue: space.hasIn(['attributesMap', 'Task Assignee Team', 0])
            ? {
                name: space.getIn(['attributesMap', 'Task Assignee Team', 0]),
              }
            : null,
        },
        {
          name: 'defaultApprovalForm',
          label: 'Approval Form',
          type: 'form',
          helpText:
            'The Queue kapp form which approvals should be created in (Overridden by Kapp and Form Attributes)',
          initialValue: initialFormValue(space, 'Approval Form Slug'),
          search: { kappSlug: queueKappSlug },
        },
        {
          name: 'defaultTaskFormSlug',
          label: 'Default Task Form',
          type: 'form',
          helpText:
            'The Queue kapp form to use when creating a task item (Overridden by Kapp and Form Attributes)',
          initialValue: initialFormValue(space, 'Task Form Slug'),
          search: { kappSlug: queueKappSlug },
        },
        {
          name: 'feedbackFormSlug',
          label: 'Feedback Form',
          type: 'form',
          helpText: 'Form used for collecting feedback throughout the portal.',
          initialValue: initialFormValue(space, 'Feedback Form Slug'),
          search: { kappSlug: adminKappSlug },
        },
        {
          name: 'helpFormSlug',
          label: 'Help Form',
          type: 'form',
          helpText: 'Form used for requesting help throughout the portal.',
          initialValue: initialFormValue(space, 'Help Form Slug'),
          search: { kappSlug: adminKappSlug },
        },
        {
          name: 'requestAlertFormSlug',
          label: 'Request Alert Form',
          type: 'form',
          helpText:
            'Form used for requesting an alert be displayed in the portal.',
          initialValue: initialFormValue(space, 'Request Alert Form Slug'),
          search: { kappSlug: adminKappSlug },
        },
        {
          name: 'suggestAServiceFormSlug',
          label: 'Suggest a Service Form',
          type: 'form',
          helpText:
            'Form used to request a new service be added to the portal.',
          initialValue: initialFormValue(space, 'Suggest a Service Form Slug'),
          search: { kappSlug: servicesKappSlug },
        },
      ]}
    alterFields={() => ({ space, releases, branches }) =>
      space &&
      releases &&
      branches && {
        name: {
          helpText: 'The Name of the Space referenced throughout the space.',
        },
        attributesMap: {
          serialize: ({ values }) => ({
            'Default Kapp Display': asArray(values.get('defaultKappDisplay')),
            'Service Days Due': asArray(values.get('defaultServiceDaysDue')),
            'Task Assignee Team': asArray(
              values.getIn(['defaultTaskAssigneeTeam', 'name']),
            ),
            'Approval Form Slug': asArray(
              values.getIn(['defaultApprovalForm', 'slug']),
            ),
            'Task Form Slug': asArray(
              values.getIn(['defaultTaskFormSlug', 'slug']),
            ),
            'Feedback Form Slug': asArray(
              values.getIn(['feedbackFormSlug', 'slug']),
            ),
            'Help Form Slug': asArray(values.getIn(['helpFormSlug', 'slug'])),
            'Request Alert Form Slug': asArray(
              values.getIn(['requestAlertFormSlug', 'slug']),
            ),
            'Suggest a Service Form Slug': asArray(
              values.getIn(['suggestAServiceFormSlug', 'slug']),
            ),
          }),
        },
        defaultTimezone: {
          component: FormComponents.SelectField,
          renderAttributes: { typeahead: true },
        },
        defaultLocale: {
          component: FormComponents.SelectField,
          renderAttributes: { typeahead: true },
        },
        displayValueSPA: bundleName
          ? {
              label: 'Bundle Version',
              helpText:
                'Version of the bundle that should be loaded. Use the Kinetic Platform consoles to set a custom bundle location.',
              component: FormComponents.SelectField,
              options: ({ values, branches, releases }) => {
                const versions = releases
                  .sortBy(option => option.label)
                  .reverse()
                  .concat(branches);
                return List(
                  versions.find(
                    v => v.get('value') === values.get('displayValueSPA'),
                  )
                    ? []
                    : [
                        {
                          label: values.get('displayValueSPA'),
                          value: values.get('displayValueSPA'),
                        },
                      ],
                )
                  .concat(versions)
                  .toJS();
              },
              renderAttributes: { typeahead: true },
            }
          : undefined,
      }}
    components={{
      FormLayout: buildLayout(bundleName),
    }}
  >
    {({ form, initialized }) =>
      initialized && (
        <div className="page-container">
          <PageTitle parts={['Space Settings']} />
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="/settings">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>Space Settings</I18n>
                </h1>
              </div>
            </div>
            <section className="form">{form}</section>
          </div>
        </div>
      )
    }
  </SpaceForm>
);

const mapStateToProps = state => ({
  loading: state.app.loading,
  reloadApp: state.app.actions.refreshApp,
  visibleKapps: selectVisibleKapps(state),
  adminKappSlug: selectAdminKappSlug(state),
  queueKappSlug: selectQueueKappSlug(state),
  servicesKappSlug: selectServicesKappSlug(state),
  bundleName: state.app.bundleName
    ? state.app.bundleName.replace('request-ce-bundle-', '')
    : null,
});

// Settings Container
export const SpaceSettings = compose(
  connect(mapStateToProps),
  withHandlers({
    onSave: props => () => () => {
      addToast('Space settings saved successfully.');
      props.reloadApp();
    },
  }),
)(SpaceSettingsComponent);
