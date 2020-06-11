import React, { Fragment } from 'react';
import { TeamForm as TeamFormLib, I18n } from '@kineticdata/react';
import { FormComponents, addToast } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { Link } from '@reach/router';
import { TeamCard } from '../shared/TeamCard';
import { getIn } from 'immutable';

const asArray = value => (value ? [value] : []);

const handleSave = () => team => {
  addToast(`${team.name} updated successfully.`);
};

const layout = ({ fields, error, buttons }) => (
  <form>
    <div className="row">
      <div className="col-12">
        <h5>General</h5>
        {fields.get('localName')}
        {fields.get('description')}
        {fields.get('parentTeam')}
        {fields.get('assignable')}
        {fields.get('icon')}
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-12">
        <h5>Membership</h5>
        {fields.get('memberships')}
      </div>
    </div>
    {error}
    <hr />
    <div className="row">
      <div className="col-12 form-buttons ">{buttons}</div>
    </div>
  </form>
);

export const TeamEdit = ({ formKey, slug: teamSlug, onDelete }) => (
  <div className="page-container page-container--panels">
    <PageTitle parts={[`Edit Team`, 'Teams']} />
    <TeamFormLib
      formKey={formKey}
      teamSlug={teamSlug}
      addFields={() => ({ team }) =>
        team && [
          {
            name: 'assignable',
            label: 'Assignable',
            type: 'select',
            initialValue: team.getIn(['attributesMap', 'Assignable', 0]),
            options: ['True', 'False'].map(el => ({ label: el, value: el })),
          },
          {
            name: 'icon',
            label: 'Icon',
            type: 'text',
            initialValue: team.getIn(['attributesMap', 'Icon', 0]),
            component: FormComponents.IconField,
          },
        ]}
      alterFields={{
        description: {
          component: FormComponents.TextAreaField,
        },
        attributesMap: {
          serialize: ({ values }) => ({
            Assignable: asArray(values.get('assignable')),
            Icon: asArray(values.get('icon')),
          }),
        },
      }}
      components={{
        FormError: FormComponents.FormError,
        FormButtons: FormComponents.generateFormButtons({
          handleDelete: onDelete,
          submitLabel: 'Update Team',
          cancelPath: '/settings/teams',
        }),
        FormLayout: layout,
      }}
      onSave={handleSave}
    >
      {({ form, bindings: { form: formBindings }, initialized }) =>
        initialized && (
          <Fragment>
            <div className="page-panel page-panel--two-thirds page-panel--white">
              <div className="page-title">
                <div
                  role="navigation"
                  aria-label="breadcrumbs"
                  className="page-title__breadcrumbs"
                >
                  <span className="breadcrumb-item">
                    <Link to="/settings">
                      <I18n>settings</I18n>
                    </Link>{' '}
                    /{' '}
                    <Link to="/settings/teams">
                      <I18n>teams</I18n>
                    </Link>{' '}
                    /
                  </span>
                  <h1>
                    <I18n>Edit Team</I18n>
                  </h1>
                </div>
              </div>
              {form}
            </div>
            <div className="page-panel page-panel--one-thirds page-panel--sidebar">
              <br />
              <TeamCard
                team={getIn(form, ['props', 'bindings', 'team'], []).toJS()}
              />
            </div>
          </Fragment>
        )
      }
    </TeamFormLib>
  </div>
);
