import React from 'react';
import axios from 'axios';
import { Modal } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import { bundle } from 'react-kinetic-core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List } from 'immutable';
import { PageTitle } from 'common';
import { isBlank } from '../../../utils';

import {
  BridgeQualification,
  BridgeModelQualification,
  BridgeModelMappingQualification,
  BridgeAttribute,
} from '../../../records';

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
  newAttribute,
  setNewAttribute,
  editAttribute,
  setEditAttribute,
  canGenerateAttributes,
  generateAttributes,
  columns,
  handleColumnChange,
  handleColumnOrderChange,
  handleFormChange,
  loading,
  hasChanged,
  handleSave,
  handleReset,
  staleFields,
  setStaleFields,
  fetchForm,
}) =>
  !loading && (
    <div className="page-container page-container--panels page-container--datastore">
      <PageTitle parts={['Settings', origForm.name, 'Datastore']} />
      <div className="page-panel page-panel--two-thirds page-panel--scrollable page-panel--datastore-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
              <Link to={`/settings/datastore/${origForm.slug}/`}>
                {origForm.name}
              </Link>
            </h3>
            <h1>{origForm.name} Configuration</h1>
          </div>
          <div className="page-title__actions">
            <a
              href={`${bundle.spaceLocation()}/app/#/admin/datastore/form/${
                origForm.slug
              }/builder`}
              className="btn btn-primary"
              target="blank"
            >
              Form Builder <i className="fa fa-fw fa-external-link" />
            </a>
          </div>
        </div>
        {canManage ? (
          <div className="datastore-settings">
            <h3 className="section__title">General Settings</h3>
            <div className="form settings">
              <div className="form-row">
                <div className="col">
                  <div className="form-group required">
                    <label htmlFor="name">Datastore Name</label>
                    <input
                      id="name"
                      name="name"
                      onChange={e => {
                        handleFormChange('name', e.target.value);
                        handleBridgeChange('formName', e.target.value);
                      }}
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
              <div className="form settings">
                <div className="form-group">
                  <label htmlFor="default-search-index">
                    Default Search Index
                  </label>
                  <select
                    id="default-search-index"
                    name="default-search-index"
                    onChange={e => {
                      handleFormChange(
                        'defaultSearchIndex',
                        e.target.value
                          ? {
                              index: e.target.value,
                              direction: 'ASC',
                            }
                          : null,
                      );
                    }}
                    value={
                      (updatedForm.defaultSearchIndex &&
                        updatedForm.defaultSearchIndex.index) ||
                      ''
                    }
                    className="form-control"
                  >
                    <option value="">Don't perform default search</option>
                    <optgroup label="Search by Index:">
                      {List(origForm.indexDefinitions)
                        .filter(d => d.status === 'Built')
                        .map(({ name }) => (
                          <option value={name} key={name}>
                            {name.replace(':UNIQUE', '')}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
                {updatedForm.defaultSearchIndex && (
                  <div className="form-group">
                    <label htmlFor="default-search-direction">
                      Default Search Sort Direction
                    </label>
                    <select
                      id="default-search-direction"
                      name="default-search-direction"
                      onChange={e => {
                        handleFormChange(
                          'defaultSearchIndex',
                          e.target.value
                            ? {
                                index: updatedForm.defaultSearchIndex.index,
                                direction: e.target.value,
                              }
                            : null,
                        );
                      }}
                      value={
                        (updatedForm.defaultSearchIndex &&
                          updatedForm.defaultSearchIndex.direction) ||
                        'ASC'
                      }
                      className="form-control"
                    >
                      <option value="ASC">Ascending</option>
                      <option value="DESC">Descending</option>
                    </select>
                  </div>
                )}
                <table className="table table-datastore table-draggable">
                  <thead>
                    <tr className="header">
                      <th>Field</th>
                      <th>Visible in Table</th>
                    </tr>
                  </thead>
                  <DragDropContext onDragEnd={handleColumnOrderChange}>
                    <Droppable droppableId="columns">
                      {provided => (
                        <tbody ref={provided.innerRef}>
                          {updatedForm.columns.map((col, index) => (
                            <Draggable
                              key={col.name}
                              draggableId={col.name}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${
                                    snapshot.isDragging ? 'dragging' : ''
                                  }`}
                                >
                                  <td>
                                    {col.type === 'value' ? (
                                      col.label
                                    ) : (
                                      <i>
                                        {col.label}{' '}
                                        <small>(system field)</small>
                                      </i>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      onChange={e =>
                                        handleColumnChange(
                                          index,
                                          'visible',
                                          e.target.checked,
                                        )
                                      }
                                      type="checkbox"
                                      checked={col.visible}
                                    />
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                        </tbody>
                      )}
                    </Droppable>
                  </DragDropContext>
                </table>
              </div>
            </div>
            <div className="table-settings">
              <h3 className="section__title">Bridge Configuration</h3>
              <div className="form settings">
                <div className="form-group">
                  <label htmlFor="name">Bridge Name</label>
                  <select
                    id="bridgeName"
                    name="bridgeName"
                    onChange={e =>
                      handleBridgeChange('bridgeName', e.target.value)
                    }
                    value={updatedForm.bridgeName}
                    className="form-control"
                  >
                    {!origForm.bridgeName && <option />}
                    {bridges.map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                {updatedForm.bridgeName && (
                  <div>
                    <div className="form-group">
                      <span>Model & Mapping Name: </span>
                      <strong>
                        {updatedForm.bridgeModel.name ||
                          `Datastore - ${updatedForm.name}`}
                      </strong>
                    </div>
                    <QualificationTable
                      updatedForm={updatedForm}
                      handleBridgeChange={handleBridgeChange}
                      setNewQualification={setNewQualification}
                    />
                    <QualificationModal
                      updatedForm={updatedForm}
                      handleBridgeChange={handleBridgeChange}
                      newQualification={newQualification}
                      setNewQualification={setNewQualification}
                    />
                    <AttributeTable
                      updatedForm={updatedForm}
                      editAttribute={editAttribute}
                      setEditAttribute={setEditAttribute}
                      newAttribute={newAttribute}
                      setNewAttribute={setNewAttribute}
                      handleBridgeChange={handleBridgeChange}
                      canGenerateAttributes={canGenerateAttributes}
                      generateAttributes={generateAttributes}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="form__footer">
              <div className="form__footer__right">
                {hasChanged && (
                  <button
                    type="button"
                    onClick={handleReset()}
                    className="btn btn-link mr-3"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave()}
                  className="btn btn-primary"
                  disabled={!hasChanged}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>You do not have access to configure this datastore.</p>
        )}
      </div>
      <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--datastore-sidebar">
        <h3>Datastore Configuration</h3>
        <p>
          To update the datastore form fields, click the Form Builder button,
          which will open the form builder in a new window. You will need to
          reload this page after making changes in the form builder.
        </p>
        <h4>Table Display Settings</h4>
        <p>
          The Display Table Settings section lists all of the fields that exist
          in this datastore. You may select which fields you'd like to be
          visible in the table when viewing records.
        </p>
      </div>
      <Modal
        isOpen={staleFields}
        toggle={() => setStaleFields(false)}
        size="lg"
      >
        <div className="modal-header">
          <h4 className="modal-title">
            <button
              onClick={() => setStaleFields(false)}
              type="button"
              className="btn btn-link"
            >
              Cancel
            </button>
            <span>Form Has Changed</span>
          </h4>
        </div>
        <div className="modal-body">
          <div className="modal-form">
            <p>
              This datastore's form has been updated. Click reload in order to
              see the latest fields.
            </p>
            {hasChanged && (
              <p className="text-danger">
                <span className="fa fa-exclamation-triangle" />
                &nbsp; You have unsaved changes that will be lost if you reload
                now.
              </p>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => {
              fetchForm(origForm.slug);
              setStaleFields(false);
            }}
            type="button"
            className="btn btn-primary"
          >
            Reload
          </button>
        </div>
      </Modal>
    </div>
  );

const QualificationTable = ({
  updatedForm,
  handleBridgeChange,
  setNewQualification,
}) => (
  <div>
    <div className="table-title">
      <div className="table-title__wrapper">
        <div>Bridge Qualifications</div>
      </div>
      <div className="table-title__actions">
        <button
          onClick={() => setNewQualification(BridgeQualification())}
          className="btn btn-primary pull-right"
        >
          Add Qualification
        </button>
      </div>
    </div>
    <table className="table table-datastore">
      <thead>
        <tr className="header">
          <th>Qualification Name</th>
          <th>Result Type</th>
          <th>Parameters</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {updatedForm.bridgeModel.qualifications.map((qual, index) => (
          <tr key={qual.name}>
            <td>{qual.name}</td>
            <td>{qual.resultType}</td>
            <td>{qual.parameters.length} Parameters</td>
            <td>
              <div className="btn-group btn-group-sm pull-right">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setNewQualification(
                      BridgeQualification(qual)
                        .merge(
                          updatedForm.bridgeModelMapping.qualifications.get(
                            index,
                          ),
                        )
                        .set('index', index),
                    )
                  }
                >
                  <span className="fa fa-fw fa-pencil" />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleBridgeChange('bridgeQualificationDelete', index)
                  }
                >
                  <span className="fa fa-fw fa-close" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {updatedForm.bridgeModel.qualifications.size === 0 && (
          <tr>
            <td colSpan="4" className="text-center">
              No qualifications.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const QualificationModal = ({
  updatedForm,
  handleBridgeChange,
  newQualification,
  setNewQualification,
}) =>
  !!newQualification && (
    <Modal
      size="lg"
      isOpen={!!newQualification}
      toggle={() => setNewQualification(null)}
    >
      <div className="modal-header">
        <h4 className="modal-title">
          <button
            onClick={() => setNewQualification(null)}
            type="button"
            className="btn btn-link"
          >
            Cancel
          </button>
          <span>
            {newQualification.index !== null ? 'Edit' : 'Add'} Qualification
          </span>
        </h4>
      </div>
      <div className="modal-body">
        <div className="modal-form">
          <div className="form-group required">
            <label htmlFor="name">Qualification Name</label>
            <input
              id="name"
              name="name"
              onChange={e =>
                setNewQualification(
                  newQualification.set('name', e.target.value),
                )
              }
              onBlur={e =>
                setNewQualification(
                  newQualification.set('name', e.target.value.trim()),
                )
              }
              value={newQualification.name}
              className="form-control"
            />
          </div>
          <div className="form-group required">
            <label htmlFor="resultType">Result Type</label>
            <select
              id="resultType"
              name="resultType"
              onChange={e =>
                setNewQualification(
                  newQualification.set('resultType', e.target.value),
                )
              }
              value={newQualification.resultType}
              className="form-control"
            >
              <option value="Multiple">Multiple</option>
              <option value="Single">Single</option>
            </select>
          </div>
          <div className="form-group">
            <label>Parameters</label>
            <table className="table table-datastore">
              <thead>
                <tr className="header">
                  <th>Name</th>
                  <th>Notes</th>
                  <th width="1%" />
                </tr>
              </thead>
              <tbody>
                {newQualification.parameters.map((parameter, index) => (
                  <tr key={parameter.name}>
                    <td>{parameter.name}</td>
                    <td>{parameter.notes}</td>
                    <td className="text-right">
                      <div className="btn-group btn-group-sm pull-right">
                        <button
                          className="btn btn-danger"
                          onClick={e =>
                            setNewQualification(
                              newQualification.deleteIn(['parameters', index]),
                            )
                          }
                        >
                          <span className="fa fa-fw fa-close" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {newQualification.parameters.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No parameters.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                {newQualification.newParameterError && (
                  <tr className="alert alert-danger" role="alert">
                    <td colSpan="3">{newQualification.newParameterError}</td>
                  </tr>
                )}
                <tr>
                  <td>
                    <input
                      id="newParameterName"
                      name="newParameterName"
                      onChange={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterName',
                            e.target.value,
                          ),
                        )
                      }
                      onBlur={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterName',
                            e.target.value.trim(),
                          ),
                        )
                      }
                      value={newQualification.newParameterName}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      id="newParameterNotes"
                      name="newParameterNotes"
                      onChange={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterNotes',
                            e.target.value,
                          ),
                        )
                      }
                      onBlur={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterNotes',
                            e.target.value.trim(),
                          ),
                        )
                      }
                      value={newQualification.newParameterNotes}
                      className="form-control"
                    />
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (
                          newQualification.parameters.find(
                            param =>
                              param.name === newQualification.newParameterName,
                          )
                        ) {
                          setNewQualification(
                            newQualification.set(
                              'newParameterError',
                              'A parameter with that name already exists.',
                            ),
                          );
                        } else {
                          setNewQualification(
                            newQualification
                              .update('parameters', parameters => [
                                ...parameters,
                                {
                                  name: newQualification.newParameterName,
                                  notes: newQualification.newParameterNotes,
                                },
                              ])
                              .set('newParameterName', '')
                              .set('newParameterNotes', '')
                              .set('newParameterError', null),
                          );
                        }
                      }}
                      disabled={isBlank(newQualification.newParameterName)}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="form-group">
            <label htmlFor="name">Query</label>
            <textarea
              id="query"
              name="query"
              onChange={e =>
                setNewQualification(
                  newQualification.set('query', e.target.value),
                )
              }
              value={newQualification.query}
              className="form-control"
              rows="3"
            />
          </div>
          {newQualification.error && (
            <div className="alert alert-danger">{newQualification.error}</div>
          )}
        </div>
        <div className="modal-footer">
          <button
            disabled={isBlank(newQualification.name)}
            onClick={() => {
              if (
                updatedForm.bridgeModel.qualifications.find(
                  (qual, index) =>
                    qual.name === newQualification.name &&
                    index !== newQualification.index,
                )
              ) {
                setNewQualification(
                  newQualification.set(
                    'error',
                    'A qualification with that name already exists.',
                  ),
                );
              } else {
                handleBridgeChange('bridgeQualification', newQualification);
                setNewQualification(null);
              }
            }}
            type="button"
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );

const AttributeTable = ({
  updatedForm,
  editAttribute,
  setEditAttribute,
  newAttribute,
  setNewAttribute,
  handleBridgeChange,
  generateAttributes,
  canGenerateAttributes,
}) => (
  <div>
    <div className="table-title">
      <div className="table-title__wrapper">
        <div>Bridge Attributes</div>
      </div>
      <div className="table-title__actions">
        {canGenerateAttributes() && (
          <button
            onClick={() => generateAttributes()}
            className="btn btn-primary pull-right"
          >
            Generate from Fields
          </button>
        )}
      </div>
    </div>
    <table className="table table-datastore">
      <thead>
        <tr className="header">
          <th>Attribute Name</th>
          <th>Mapping</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {updatedForm.bridgeModel.attributes.map((attr, index) => {
          const attrMapping =
            updatedForm.bridgeModelMapping.attributes.find(
              mapAttr => mapAttr.name === attr.name,
            ) || {};
          return (
            <tr key={attr.name}>
              <td>
                {editAttribute.index === index ? (
                  <input
                    id="editAttributeName"
                    name="editAttributeName"
                    onChange={e =>
                      setEditAttribute(
                        editAttribute.set('name', e.target.value),
                      )
                    }
                    onBlur={e =>
                      setEditAttribute(
                        editAttribute.set('name', e.target.value.trim()),
                      )
                    }
                    value={editAttribute.name}
                    className="form-control"
                  />
                ) : (
                  attr.name
                )}
              </td>
              <td>
                {editAttribute.index === index ? (
                  <input
                    id="editAttributeStructureField"
                    name="editAttributeStructureField"
                    onChange={e =>
                      setEditAttribute(
                        editAttribute.set('structureField', e.target.value),
                      )
                    }
                    onBlur={e =>
                      setEditAttribute(
                        editAttribute.set(
                          'structureField',
                          e.target.value.trim(),
                        ),
                      )
                    }
                    value={editAttribute.structureField}
                    className="form-control"
                  />
                ) : (
                  attrMapping.structureField || (
                    <em className="text-muted">No Mapping</em>
                  )
                )}
              </td>
              <td>
                {editAttribute.index === index ? (
                  <div className="btn-group btn-group-sm pull-right">
                    <button
                      className="btn btn-danger"
                      onClick={() => setEditAttribute(new BridgeAttribute())}
                    >
                      <span className="fa fa-fw fa-close" />
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleBridgeChange('bridgeAttribute', editAttribute);
                        setEditAttribute(new BridgeAttribute());
                      }}
                    >
                      <span className="fa fa-fw fa-check" />
                    </button>
                  </div>
                ) : (
                  <div className="btn-group btn-group-sm pull-right">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        setEditAttribute(
                          BridgeAttribute(attr)
                            .merge(attrMapping)
                            .set('index', index),
                        )
                      }
                    >
                      <span className="fa fa-fw fa-pencil" />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleBridgeChange('bridgeAttributeDelete', index)
                      }
                    >
                      <span className="fa fa-fw fa-close" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
        {updatedForm.bridgeModel.attributes.size === 0 && (
          <tr>
            <td colSpan="3" className="text-center">
              No attributes.
            </td>
          </tr>
        )}
      </tbody>
      <tfoot>
        {newAttribute.error && (
          <tr className="alert alert-danger" role="alert">
            <td colSpan="3">{newAttribute.error}</td>
          </tr>
        )}
        <tr>
          <td>
            <input
              id="newAttributeName"
              name="newAttributeName"
              onChange={e =>
                setNewAttribute(newAttribute.set('name', e.target.value))
              }
              onBlur={e =>
                setNewAttribute(newAttribute.set('name', e.target.value.trim()))
              }
              value={newAttribute.name}
              className="form-control"
            />
          </td>
          <td>
            <input
              id="newAttributeStructureField"
              name="newAttributeStructureField"
              onChange={e =>
                setNewAttribute(
                  newAttribute.set('structureField', e.target.value),
                )
              }
              onBlur={e =>
                setNewAttribute(
                  newAttribute.set('structureField', e.target.value.trim()),
                )
              }
              value={newAttribute.structureField}
              className="form-control"
            />
          </td>
          <td className="text-right">
            <button
              className="btn btn-danger"
              onClick={() => {
                if (
                  updatedForm.bridgeModel.attributes.find(
                    attr => attr.name === newAttribute.name,
                  )
                ) {
                  setNewAttribute(
                    newAttribute.set(
                      'error',
                      'An attribute with that name already exists.',
                    ),
                  );
                } else {
                  handleBridgeChange('bridgeAttribute', newAttribute);
                  setNewAttribute(new BridgeAttribute());
                }
              }}
              disabled={isBlank(newAttribute.name)}
            >
              Add
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
);

const handleColumnChange = ({ setFormChanges, updatedForm: { columns } }) => (
  index,
  prop,
  value,
) => {
  const updated = columns.setIn([index, prop], value);
  setFormChanges({ type: 'columns', value: updated });
};

const handleColumnOrderChange = ({
  setFormChanges,
  updatedForm: { columns },
}) => ({ source, destination }) => {
  if (destination && source.index !== destination.index) {
    const updated = columns.update(cols => {
      const col = cols.get(source.index);
      return cols.delete(source.index).insert(destination.index, col);
    });
    setFormChanges({ type: 'columns', value: updated });
  }
};

const handleBridgeChange = ({
  setFormChanges,
  updatedForm: { bridgeModel, bridgeModelMapping },
}) => (type, value) => {
  if (type === 'bridgeName') {
    setFormChanges({ type: 'bridgeName', value });
    setFormChanges({
      type: 'bridgeModelMapping',
      value: bridgeModelMapping.set('bridgeName', value),
    });
  } else if (type === 'formName') {
    if (bridgeModel.name) {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.set('name', `Datastore - ${value}`),
      });
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.set('name', `Datastore - ${value}`),
      });
    }
  } else if (type === 'bridgeQualification') {
    if (value.index === null) {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.update('qualifications', quals =>
          quals.push(BridgeModelQualification(value)),
        ),
      });
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.update('qualifications', quals =>
          quals.push(BridgeModelMappingQualification(value)),
        ),
      });
    } else {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.setIn(
          ['qualifications', value.index],
          BridgeModelQualification(value),
        ),
      });
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.setIn(
          ['qualifications', value.index],
          BridgeModelMappingQualification(value),
        ),
      });
    }
  } else if (type === 'bridgeQualificationDelete') {
    setFormChanges({
      type: 'bridgeModel',
      value: bridgeModel.deleteIn(['qualifications', value]),
    });
    setFormChanges({
      type: 'bridgeModelMapping',
      value: bridgeModelMapping.deleteIn(['qualifications', value]),
    });
  } else if (type === 'bridgeAttribute') {
    if (value.index === null) {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.update('attributes', quals =>
          quals.push({ name: value.name }),
        ),
      });
      !isBlank(value.structureField) &&
        setFormChanges({
          type: 'bridgeModelMapping',
          value: bridgeModelMapping.update('attributes', quals =>
            quals.push({
              name: value.name,
              structureField: value.structureField,
            }),
          ),
        });
    } else {
      const attr = bridgeModel.getIn(['attributes', value.index]);
      const attrMapping = bridgeModelMapping.attributes.find(
        mapAttr => mapAttr.name === attr.name,
      );
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.setIn(['attributes', value.index], {
          name: value.name,
        }),
      });
      if (attrMapping) {
        const index = bridgeModelMapping.attributes.indexOf(attrMapping);
        if (!isBlank(value.structureField)) {
          setFormChanges({
            type: 'bridgeModelMapping',
            value: bridgeModelMapping.setIn(['attributes', index], {
              name: value.name,
              structureField: value.structureField,
            }),
          });
        } else {
          setFormChanges({
            type: 'bridgeModelMapping',
            value: bridgeModelMapping.deleteIn(['attributes', index]),
          });
        }
      } else if (!isBlank(value.structureField)) {
        setFormChanges({
          type: 'bridgeModelMapping',
          value: bridgeModelMapping.update('attributes', quals =>
            quals.push({
              name: value.name,
              structureField: value.structureField,
            }),
          ),
        });
      }
    }
  } else if (type === 'bridgeAttributeDelete') {
    const attr = bridgeModel.getIn(['attributes', value]);
    const attrMapping = bridgeModelMapping.attributes.find(
      mapAttr => mapAttr.name === attr.name,
    );
    setFormChanges({
      type: 'bridgeModel',
      value: bridgeModel.deleteIn(['attributes', value]),
    });
    if (attrMapping) {
      const index = bridgeModelMapping.attributes.indexOf(attrMapping);
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.deleteIn(['attributes', index]),
      });
    }
  }
};

const handleFormChange = ({ setFormChanges }) => (type, value) => {
  setFormChanges({ type, value });
};

const handleSave = ({ updateForm }) => () => () => {
  updateForm();
};

const handleReset = ({ resetForm }) => () => () => {
  resetForm();
};

const generateAttributes = ({
  updatedForm: { columns, bridgeModel, bridgeModelMapping },
  setFormChanges,
}) => () => {
  let updatedBridgeModel = bridgeModel;
  let updatedBridgeModelMapping = bridgeModelMapping;
  columns.forEach(column => {
    if (
      column.type === 'value' &&
      !bridgeModel.attributes.find(a => a.name === column.name)
    ) {
      updatedBridgeModel = updatedBridgeModel.update('attributes', quals =>
        quals.push({ name: column.name }),
      );
      updatedBridgeModelMapping = updatedBridgeModelMapping.update(
        'attributes',
        quals =>
          quals.push({
            name: column.name,
            structureField: `\${fields('values[${column.name}]')}`,
          }),
      );
    }
  });
  if (!bridgeModel.attributes.find(a => a.name === 'Id')) {
    updatedBridgeModel = updatedBridgeModel.update('attributes', quals =>
      quals.push({ name: 'Id' }),
    );
    updatedBridgeModelMapping = updatedBridgeModelMapping.update(
      'attributes',
      quals =>
        quals.push({
          name: 'Id',
          structureField: `\${fields('values[id]')}`,
        }),
    );
  }
  setFormChanges({
    type: 'bridgeModel',
    value: updatedBridgeModel,
  });
  setFormChanges({
    type: 'bridgeModelMapping',
    value: updatedBridgeModelMapping,
  });
};

const canGenerateAttributes = ({
  updatedForm: { columns, bridgeModel },
}) => () => {
  const missing = columns.find(
    column =>
      column.type === 'value' &&
      !bridgeModel.attributes.find(a => a.name === column.name),
  );
  return missing || !bridgeModel.attributes.find(a => a.name === 'Id');
};

const windowFocusListener = ({ setStaleFields, origForm }) => () => {
  // Check if form fields are stale, and if yes, allow user to reload form
  axios
    .get(`${bundle.apiLocation()}/datastore/forms/${origForm.slug}`, {
      params: { include: 'fields' },
    })
    .then(response => ({ form: response.data.form }))
    .then(({ form }) => {
      if (
        !List(origForm.fields)
          .map(({ name }) => name)
          .sort()
          .equals(
            List(form.fields)
              .map(({ name }) => name)
              .sort(),
          )
      ) {
        setStaleFields(true);
      }
    })
    .catch(() => {
      /* Do nothing if form fetch errors */
    });
};

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
  resetForm: actions.resetForm,
};

export const DatastoreSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('newQualification', 'setNewQualification', null),
  withState('newAttribute', 'setNewAttribute', new BridgeAttribute()),
  withState('editAttribute', 'setEditAttribute', new BridgeAttribute()),
  withState('staleFields', 'setStaleFields', false),
  withHandlers({
    handleBridgeChange,
    handleColumnChange,
    handleColumnOrderChange,
    handleFormChange,
    handleSave,
    handleReset,
    windowFocusListener,
  }),
  withHandlers({
    canGenerateAttributes,
    generateAttributes,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.formSlug);
      window.addEventListener('focus', this.props.windowFocusListener);
    },
    componentWillUnmount() {
      window.removeEventListener('focus', this.props.windowFocusListener);
    },
  }),
)(SettingsComponent);
