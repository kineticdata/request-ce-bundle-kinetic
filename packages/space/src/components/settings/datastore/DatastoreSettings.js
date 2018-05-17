import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import { bundle } from 'react-kinetic-core';

import { BridgeModelQualification } from '../../../records';

import { actions } from '../../../redux/modules/settingsDatastore';

const SettingsComponent = ({
  canManage,
  updatedForm,
  origForm,
  bridges,
  bridgeModel,
  bridgeName,
  handleBridgeChange,
  newQualification,
  setNewQualification,
  handleAddNewQualfication,
  handleRebuildBridges,
  columns,
  handleColumnChange,
  handleFormChange,
  loading,
  hasChanged,
  handleSave,
}) =>
  !loading && (
    <div className="page-container page-container--panels page-container--datastore">
      <div className="page-panel page-panel--two-thirds page-panel--scrollable page-panel--datastore-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
            </h3>
            <h1>{origForm.name} Configuration</h1>
          </div>
          <div className="page-title__actions">
            {hasChanged && (
              <button
                type="button"
                onClick={handleSave()}
                className="btn btn-secondary mr-3"
              >
                Save Changes
              </button>
            )}
            <a
              href={`${bundle.spaceLocation()}/app/#/admin/datastore/form/${
                origForm.slug
              }/builder`}
              className="btn btn-primary"
              target="blank"
            >
              Form Builder
            </a>
          </div>
        </div>
        {canManage ? (
          <div className="datastore-settings">
            <h3 className="section__title">General Settings</h3>
            <div className="settings">
              <div className="form-row">
                <div className="col">
                  <div className="form-group required">
                    <label htmlFor="name">Datastore Name</label>
                    <input
                      id="name"
                      name="name"
                      onChange={e => handleFormChange('name', e.target.value)}
                      value={updatedForm.name}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group required">
                    <label htmlFor="slug">Datastore Slug</label>
                    <input
                      id="slug"
                      name="slug"
                      onChange={e => handleFormChange('slug', e.target.value)}
                      value={updatedForm.slug}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="name">
                  Datastore Description <small>(optional)</small>
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  onChange={e =>
                    handleFormChange('description', e.target.value)
                  }
                  value={updatedForm.description || ''}
                  rows="3"
                  name="description"
                />
              </div>
            </div>
            <div className="table-settings">
              <h3 className="section__title">Table Display Settings</h3>
              <div className="settings">
                <table className="table">
                  <thead>
                    <tr className="header">
                      <th>Field</th>
                      <th>Visible in Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedForm.columns
                      .filter(col => col.type === 'value')
                      .map(col => (
                        <tr key={col.name}>
                          <td>{col.label}</td>
                          <td>
                            <input
                              onChange={handleColumnChange(col, 'visible')}
                              type="checkbox"
                              checked={col.visible}
                            />
                          </td>
                        </tr>
                      ))}
                    {updatedForm.columns
                      .filter(col => col.type !== 'value')
                      .map(col => (
                        <tr key={col.name}>
                          <td>
                            <i>
                              {col.label} <small>(system field)</small>
                            </i>
                          </td>
                          <td>
                            <input
                              onChange={handleColumnChange(col, 'visible')}
                              type="checkbox"
                              checked={col.visible}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/*
            <div className="table-settings">
              <h3 className="section__title">Bridge Configuration</h3>
              <div className="settings">
                {!bridgeName && (
                  <div>
                    <p>
                      No Bridge Model found. Please select a bridge to build
                      one.
                    </p>
                  </div>
                )}
                {bridgeName &&
                  !bridgeModel && (
                    <div>
                      <p>
                        Click Build Bridge to build a bridge model for your form
                      </p>
                      <button
                        onClick={handleRebuildBridges}
                        className="btn btn-secondary"
                      >
                        Build Bridge
                      </button>
                    </div>
                  )}
                <div className="form-group">
                  <label htmlFor="name">Bridge Name</label>
                  <select
                    id="bridgeName"
                    name="bridgeName"
                    onChange={e =>
                      handleBridgeChange('bridgeName', e.target.value)
                    }
                    value={bridgeName}
                    className="form-control"
                  >
                    <option />
                    {bridges.map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  Bridge Qualifications
                  <table className="table">
                    <thead>
                      <tr className="header">
                        <th>Name</th>
                        <th>Result Type</th>
                        <th>Parameters</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {updatedForm.bridgeModel.qualifications.map(qual => (
                        <tr key={qual.name}>
                          <td>{qual.name}</td>
                          <td>
                            <select
                              className="form-control"
                              value={qual.resultType}
                              onChange={handleBridgeChange(
                                'qual-result-type',
                                qual,
                              )}
                            >
                              <option value="Single">Single</option>
                              <option value="Multiple">Multiple</option>
                            </select>
                          </td>
                          <td>
                            <button
                              type="link"
                              className="btn btn-link"
                              onClick={() => console.log('clicked', qual)}
                            >
                              Parameters ({qual.parameters.size})
                            </button>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm pull-right">
                              <button className="btn btn-danger">
                                <span className="fa fa-fw fa-close" />
                              </button>
                              <a className="btn btn-primary" href="">
                                <span className="fa fa-fw fa-pencil" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <input
                            id="qualification-name"
                            name="qualification-name"
                            placeholder="Qualification Name"
                            onChange={e =>
                              setNewQualification(
                                newQualification.set('name', e.target.value),
                              )
                            }
                            value={newQualification.name}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <select
                            className="form-control"
                            onChange={e =>
                              setNewQualification(
                                newQualification.set(
                                  'resultType',
                                  e.target.value,
                                ),
                              )
                            }
                            value={newQualification.resultType}
                          >
                            <option value="Single">Single</option>
                            <option value="Multiple">Multiple</option>
                          </select>
                        </td>
                        <td />
                        <td>
                          <button
                            disabled={newQualification.name === ''}
                            onClick={handleAddNewQualfication}
                            className="btn btn-primary pull-right"
                          >
                            Add Qualification
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>*/}
          </div>
        ) : (
          <p>You do not have access to configure this datastore.</p>
        )}
      </div>
      <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--datastore-sidebar">
        <h3>Datastore Configuration</h3>
        <p>
          To update the datastore form fields, click the Builder button, which
          will open the form builder in a new window. You will need to reload
          this page after making changes in the form builder, which can be done
          by clicking the reload button.
        </p>
        <h4>Table Display Options</h4>
        <p>
          The Display Table Options section lists all of the fields that exist
          in this datastore. The order in this table will determine the order
          the records appear in the Records table. You may order the table by
          dragging the rows. Visible: Should this field appear in the records
          table? Searchable: Should the data in this field be searchable in the
          records table? Sortable: Should the records table be sortable by this
          field? Unique: Should the data in this field be required to be unique
          for all records?
        </p>
      </div>
    </div>
  );

const handleColumnChange = ({ setFormChanges }) => (column, prop) => () => {
  const updated = column.set(prop, !column.get(prop));
  setFormChanges({ type: 'column', original: column, updated });
};

const handleBridgeChange = ({
  setFormChanges,
  updatedForm: { bridgeModel, bridgeModelMapping },
}) => (type, value) => {
  if (type === 'bridgeName') {
    const updated = bridgeModelMapping.set('bridgeName', value);
    setFormChanges({ type: 'bridgeModelMapping', value: updated });
  }
};

const handleAddNewQualfication = ({
  setFormChanges,
  setNewQualification,
  newQualification,
  updatedForm: { bridgeModel },
}) => () => {
  const updated = bridgeModel.updateIn(['qualifications'], quals =>
    quals.push(newQualification),
  );
  setFormChanges({ type: 'bridgeModel', value: updated });
  setNewQualification(BridgeModelQualification());
};

const handleFormChange = ({ setFormChanges }) => (type, value) => {
  setFormChanges({ type, value });
};

const handleSave = ({ updateForm }) => () => () => {
  updateForm();
};

const handleRebuildBridges = ({
  createBridgeModel,
  updateBridgeModel,
  bridgeModel,
  bridgeModelTemplate,
}) =>
  bridgeModel
    ? updateBridgeModel(bridgeModelTemplate)
    : createBridgeModel(bridgeModelTemplate);

export const mapStateToProps = (state, { match: { params } }) => ({
  loading: state.space.settingsDatastore.currentFormLoading,
  canManage: state.space.settingsDatastore.currentForm.canManage,
  origForm: state.space.settingsDatastore.currentForm,
  updatedForm: state.space.settingsDatastore.currentFormChanges,
  formSlug: params.slug,
  hasChanged: !state.space.settingsDatastore.currentForm.equals(
    state.space.settingsDatastore.currentFormChanges,
  ),
  bridges: state.space.settingsDatastore.bridges,
  bridgeName: '',
});

export const mapDispatchToProps = {
  push,
  fetchForm: actions.fetchForm,
  setFormChanges: actions.setFormChanges,
  updateForm: actions.updateForm,
  updateBridgeModel: actions.updateBridgeModel,
  createBridgeModel: actions.createBridgeModel,
};

export const DatastoreSettings = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState(
    'newQualification',
    'setNewQualification',
    BridgeModelQualification(),
  ),
  withHandlers({
    handleBridgeChange,
    handleColumnChange,
    handleFormChange,
    handleSave,
    handleRebuildBridges,
    handleAddNewQualfication,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.formSlug);
    },
  }),
)(SettingsComponent);
