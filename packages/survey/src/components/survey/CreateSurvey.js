import React from 'react';

import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { compose, withHandlers, withState } from 'recompose';

import { DatastoreForm } from '../../records';
import { actions } from '../../redux/modules/settingsDatastore';
import { context } from '../../redux/store';
import { PageTitle } from '../shared/PageTitle';

import { I18n } from '@kineticdata/react';

const CreateSurveyComponent = ({
  spaceAdmin,
  setNewForm,
  newForm,
  bridges,
  loading,
  creating,
  handleSave,
  handleNameChange,
  match,
}) => (
  <div className="page-container page-container--panels">
    <PageTitle parts={['New Form', 'Datastore']} />
    <div className="page-panel page-panel--two-thirds page-panel--white">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="../">
              <I18n>survey</I18n>
            </Link>{' '}
            /{` `}
          </h3>
          <h1>
            <I18n>New Survey</I18n>
          </h1>
        </div>
      </div>
      <div className="datastore-settings">
        <h3 className="section__title">
          <I18n>General Settings</I18n>
        </h3>
        <div className="settings form">
          <div className="form-row">
            <div className="col">
              <div className="form-group required">
                <label htmlFor="name">
                  <I18n>Survey Name</I18n>
                </label>
                <input
                  id="name"
                  name="name"
                  onChange={e => handleNameChange(e.target.value)}
                  value={newForm.name}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group required">
                <label htmlFor="slug">
                  <I18n>Survey Slug</I18n>
                </label>
                <input
                  id="slug"
                  name="slug"
                  onChange={e =>
                    setNewForm(newForm.set('slug', e.target.value))
                  }
                  value={newForm.slug}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">
              <I18n>Survey Description</I18n>{' '}
              <small>
                <I18n>(optional)</I18n>
              </small>
            </label>
            <textarea
              id="description"
              className="form-control"
              onChange={e =>
                setNewForm(newForm.set('description', e.target.value))
              }
              value={newForm.description || ''}
              rows="3"
              name="description"
            />
          </div>
          <div className="form__footer">
            <div className="form__footer__right">
              <Link to="/settings/datastore" className="btn btn-link mb-0">
                <I18n>Cancel</I18n>
              </Link>
              <button
                disabled={
                  newForm.name === '' || newForm.slug === '' || creating
                }
                type="button"
                onClick={handleSave()}
                className="btn btn-secondary"
              >
                <I18n>Create Survey</I18n>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--datastore-sidebar">
      <h3>
        <I18n>New Survey</I18n>
      </h3>
      <p>
        <I18n>
          Creating a new Survey will create a new Kinetic Request datastore form
          to be used for storing data.
        </I18n>
      </p>
      {/*<p>
        <strong>Bridge Name:</strong> Select the Kinetic Core bridge to allow
        for automatic bridge creation for this datastore (The Kinetic Core
        Bridge Adapter must first be installed into Bridgehub to allow this data
        to be retrieved via bridges).
      </p>*/}
    </div>
  </div>
);

const handleSave = ({ createForm, newForm, push, setCreating }) => () => () => {
  setCreating(true);
  createForm({
    form: newForm,
    callback: () => push(`/settings/datastore/${newForm.slug}/settings`),
  });
};

const handleNameChange = ({ setNewForm, newForm }) => value => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  if (
    newForm.slug === '' ||
    slug.includes(newForm.slug) ||
    newForm.slug.includes(slug)
  ) {
    const updatedForm = newForm.set('name', value).set('slug', slug);
    setNewForm(updatedForm);
  } else {
    setNewForm(newForm.set('name', value));
  }
};

export const mapStateToProps = state => ({
  spaceAdmin: state.app.profile.spaceAdmin,
  bridges: state.settingsDatastore.bridges,
});

export const mapDispatchToProps = {
  push,
  createForm: actions.createForm,
};

export const CreateSurvey = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('newForm', 'setNewForm', DatastoreForm()),
  withState('creating', 'setCreating', false),
  withHandlers({
    handleSave,
    handleNameChange,
  }),
)(CreateSurveyComponent);
